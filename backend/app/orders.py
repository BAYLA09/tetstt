from datetime import datetime, timedelta, timezone
from decimal import Decimal
from fastapi import HTTPException
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.integrations import dispatch_capi_events
from app.models import Order, OrderItem
from app.phone import phone_hash_for_duplicate
from app.products import PRODUCTS, UPSELL_SKUS
from app.schemas import OrderIn, UpsellIn

async def create_order(session: AsyncSession, payload: OrderIn) -> Order:
    phone_hash = phone_hash_for_duplicate(payload.phone)
    signature = sorted((item.sku, item.quantity) for item in payload.items)
    existing = await find_duplicate(session, phone_hash, signature)
    if existing:
        return existing
    public_order_id = await next_public_order_id(session)
    order = Order(public_order_id=public_order_id, customer_name=payload.customer_name.strip(), phone_e164=payload.phone, phone_hash=phone_hash, currency="AED", subtotal=Decimal("0"), upsell_total=Decimal("0"), total=Decimal("0"), source_url=payload.source_url, landing_page=payload.landing_page, utm_source=payload.utm.get("source"), utm_medium=payload.utm.get("medium"), utm_campaign=payload.utm.get("campaign"), utm_content=payload.utm.get("content"), utm_term=payload.utm.get("term"), tracking_payload=payload.tracking, event_ids=payload.event_ids)
    subtotal = Decimal("0")
    for item in payload.items:
        if item.sku not in PRODUCTS or item.sku in UPSELL_SKUS:
            raise HTTPException(status_code=400, detail=f"Unknown SKU: {item.sku}")
        product = PRODUCTS[item.sku]
        line_total = product["price"] * item.quantity
        subtotal += line_total
        order.items.append(OrderItem(sku=item.sku, name=product["name"], unit_price=product["price"], quantity=item.quantity, line_total=line_total))
    order.subtotal = subtotal
    order.total = subtotal
    session.add(order)
    await dispatch_capi_events(session, order)
    await session.commit()
    await session.refresh(order, attribute_names=["items"])
    return order

async def add_upsell(session: AsyncSession, order_id: str, payload: UpsellIn) -> Order:
    if payload.sku not in UPSELL_SKUS:
        raise HTTPException(status_code=400, detail="Invalid upsell SKU")
    result = await session.execute(select(Order).options(selectinload(Order.items)).where(Order.public_order_id == order_id))
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if any(item.is_upsell for item in order.items):
        return order
    product = PRODUCTS[payload.sku]
    line_total = product["price"] * payload.quantity
    order.items.append(OrderItem(sku=payload.sku, name=product["name"], unit_price=product["price"], quantity=payload.quantity, line_total=line_total, is_upsell=True))
    order.upsell_total = Decimal(str(order.upsell_total)) + line_total
    order.total = Decimal(str(order.total)) + line_total
    await dispatch_capi_events(session, order, event_name="Upsell")
    await session.commit()
    await session.refresh(order, attribute_names=["items"])
    return order

async def next_public_order_id(session: AsyncSession) -> str:
    today = datetime.now(timezone.utc).strftime("%Y%m%d")
    prefix = f"LB-{today}-"
    result = await session.execute(select(func.count(Order.id)).where(Order.public_order_id.like(f"{prefix}%")))
    return f"{prefix}{int(result.scalar() or 0) + 1:06d}"

async def find_duplicate(session: AsyncSession, phone_hash: str, signature: list[tuple[str, int]]) -> Order | None:
    since = datetime.now(timezone.utc) - timedelta(minutes=10)
    result = await session.execute(select(Order).options(selectinload(Order.items)).where(Order.phone_hash == phone_hash, Order.created_at >= since).order_by(Order.created_at.desc()))
    for order in result.scalars():
        order_signature = sorted((item.sku, item.quantity) for item in order.items if not item.is_upsell)
        if order_signature == signature:
            return order
    return None
