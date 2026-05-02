from __future__ import annotations

from datetime import UTC, datetime
from decimal import Decimal
from typing import Annotated
from uuid import uuid4
from fastapi import APIRouter, Depends, Header, HTTPException, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_session
from app.models import Order, OrderItem
from app.products import PRODUCTS
from app.schemas import OrderCreate, OrderResponse, UpsellCreate
from app.services.phone import normalize_uae_phone, phone_hash
from app.services.sheet_webhook import send_order_to_sheet
from app.services.tracking import send_capi_events

router = APIRouter(prefix="/orders", tags=["orders"])


def line_total(price: Decimal, quantity: int) -> Decimal:
    return price * Decimal(quantity)


def get_client_ip(request: Request) -> str | None:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else None


def order_to_sheet_payload(order: Order, items: list[dict]) -> dict:
    return {
        "created_at": order.created_at.isoformat() if order.created_at else datetime.now(UTC).isoformat(),
        "public_order_id": order.public_order_id,
        "status": order.status,
        "customer_name": order.customer_name,
        "phone_e164": order.phone_e164,
        "currency": order.currency,
        "subtotal": float(order.subtotal),
        "upsell_total": float(order.upsell_total),
        "total": float(order.total),
        "items": items,
        "utm": {
            "source": order.utm_source,
            "medium": order.utm_medium,
            "campaign": order.utm_campaign,
            "content": order.utm_content,
            "term": order.utm_term,
        },
        "tracking": order.tracking_payload or {},
        "event_ids": order.event_ids or {},
        "source_url": order.source_url,
        "landing_page": order.landing_page,
    }


@router.post("", response_model=OrderResponse)
async def create_order(
    payload: OrderCreate,
    request: Request,
    user_agent: Annotated[str | None, Header(alias="user-agent")] = None,
    session: AsyncSession = Depends(get_session),
) -> OrderResponse:
    normalized_phone = normalize_uae_phone(payload.phone)
    subtotal = Decimal("0")
    order_items: list[OrderItem] = []
    order_items_payload: list[dict] = []

    for item in payload.items:
        product = PRODUCTS.get(item.sku)
        if not product:
            raise HTTPException(status_code=400, detail=f"Unknown SKU: {item.sku}")
        quantity = item.quantity
        price = product["price"]
        subtotal += line_total(price, quantity)
        order_items_payload.append(
            {
                "sku": item.sku,
                "name": product["name"],
                "price": float(price),
                "quantity": quantity,
                "is_upsell": False,
            }
        )
        order_items.append(
            OrderItem(
                sku=item.sku,
                name=product["name"],
                unit_price=price,
                quantity=quantity,
                line_total=line_total(price, quantity),
                is_upsell=False,
            )
        )

    utm = payload.utm or {}
    order = Order(
        customer_name=payload.customer_name.strip(),
        phone_e164=normalized_phone,
        phone_hash=phone_hash(normalized_phone),
        currency="AED",
        subtotal=subtotal,
        upsell_total=Decimal("0"),
        total=subtotal,
        source_url=payload.source_url,
        landing_page=payload.landing_page,
        utm_source=utm.get("source"),
        utm_medium=utm.get("medium"),
        utm_campaign=utm.get("campaign"),
        utm_content=utm.get("content"),
        utm_term=utm.get("term"),
        tracking_payload=payload.tracking,
        event_ids=payload.event_ids,
        sheet_sync_status="pending",
    )
    order.items = order_items
    order.public_order_id = f"LB-{datetime.now(UTC):%Y%m%d}-{uuid4().hex[:8].upper()}"
    session.add(order)
    await session.commit()

    sheet_payload = order_to_sheet_payload(order, order_items_payload)
    await send_order_to_sheet(sheet_payload)
    await send_capi_events(sheet_payload, user_agent, get_client_ip(request))

    return OrderResponse(
        order_id=order.public_order_id,
        status=order.status,
        total=float(order.total),
        currency=order.currency,
    )


@router.post("/{order_id}/upsell", response_model=OrderResponse)
async def add_upsell(
    order_id: str,
    payload: UpsellCreate,
    session: AsyncSession = Depends(get_session),
) -> UpsellResponse:
    product = PRODUCTS.get(payload.sku)
    if not product or product["price"] != Decimal("39"):
        raise HTTPException(status_code=400, detail="Invalid upsell SKU")

    result = await session.execute(select(Order).where(Order.public_order_id == order_id))
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    upsell_total = product["price"] * Decimal(payload.quantity)
    item = OrderItem(
        order_id=order.id,
        sku=payload.sku,
        name=product["name"],
        unit_price=product["price"],
        quantity=payload.quantity,
        line_total=upsell_total,
        is_upsell=True,
    )
    order.upsell_total += upsell_total
    order.total += upsell_total
    if payload.event_id:
        event_ids = dict(order.event_ids or {})
        event_ids["upsell"] = payload.event_id
        order.event_ids = event_ids
    session.add(item)
    await session.commit()
    await session.refresh(order)
    return OrderResponse(
        order_id=order.public_order_id,
        status=order.status,
        total=float(order.total),
        currency=order.currency,
        upsell_added=True,
    )
