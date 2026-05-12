from __future__ import annotations

import logging
from datetime import UTC, datetime
from decimal import Decimal, InvalidOperation
from typing import Annotated
from uuid import uuid4
from fastapi import APIRouter, Depends, Header, HTTPException, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.db import get_session
from app.models import Order, OrderItem
from app.products import LAMP_OFFER_SKUS, PRODUCTS
from app.schemas import OrderCreate, OrderResponse, UpsellCreate
from app.services.fraud import verify_order_ip
from app.services.phone import normalize_uae_phone, numeric_phone, phone_hash
from app.services.sheet_webhook import send_order_to_sheet
from app.services.tracking import send_capi_events

log = logging.getLogger(__name__)

router = APIRouter(prefix="/orders", tags=["orders"])

# Stale API images may lack tier rows in PRODUCTS — keep in sync with app/products.py.
_LAMP_TIER_FALLBACK_SKUS: dict[str, tuple[Decimal, str, str]] = {
    "LB-LAMP-OUD-379": (Decimal("379"), "موقد ليالي الفاخر + سيروم عود قصر دبي", "LY-L3OU2"),
    "LB-LAMP-TRIPLE-449": (Decimal("449"), "موقد ليالي الفاخر + سيرومين عود قصر دبي", "LY-L4TP3"),
}

# When storefront submits LB-LAMP-189 with client line price, map to bundle sheet + total (old catalog had only base SKU).
_LAMP_BUNDLE_BY_CLIENT_PRICE: dict[Decimal, tuple[str, str]] = {
    Decimal("299"): ("موقد ليالي الفاخر", "LY-L2MP1"),
    Decimal("379"): ("موقد ليالي الفاخر + سيروم عود قصر دبي", "LY-L3OU2"),
    Decimal("449"): ("موقد ليالي الفاخر + سيرومين عود قصر دبي", "LY-L4TP3"),
}


def _decimal_optional(v: float | None) -> Decimal | None:
    if v is None:
        return None
    try:
        return Decimal(str(v))
    except (InvalidOperation, TypeError, ValueError):
        return None


def _resolve_line_price_name_sheet(*, sku: str, client_price: float | None) -> tuple[Decimal, str, str] | None:
    """Authoritative unit price, display name, sheet SKU. None if SKU unknown."""
    row = PRODUCTS.get(sku)
    if row:
        price: Decimal = row["price"]
        name = str(row["name"])
        sheet = str(row["sheet_sku"])
        if sku == "LB-LAMP-189" and settings.allow_lamp_bundle_client_price:
            cp = _decimal_optional(client_price)
            if cp is not None and cp in _LAMP_BUNDLE_BY_CLIENT_PRICE:
                name, sheet = _LAMP_BUNDLE_BY_CLIENT_PRICE[cp]
                price = cp
        return price, name, sheet
    fb = _LAMP_TIER_FALLBACK_SKUS.get(sku)
    if fb:
        p, name, sheet = fb
        return p, name, sheet
    return None


def format_sheet_phone(phone_e164: str) -> str:
    if phone_e164.startswith("+971") and len(phone_e164) == 13:
        return f"+971 {phone_e164[4:6]} {phone_e164[6:9]} {phone_e164[9:]}"
    return phone_e164


def line_total(price: Decimal, quantity: int) -> Decimal:
    return price * Decimal(quantity)


def get_client_ip(request: Request) -> str | None:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else None


def order_to_sheet_payload(order: Order, items: list[dict]) -> dict:
    return {
        "date": datetime.now(UTC).strftime("%d/%m/%Y"),
        "orderid": order.public_order_id,
        "country": "AED",
        "name": order.customer_name,
        "phone": format_sheet_phone(order.phone_e164),
        "product": "/".join(str(item["name"]) for item in items),
        "sku": "/".join(str(item["sku"]) for item in items),
        "quantity": "/".join(str(item["quantity"]) for item in items),
        "totalprice": float(order.total),
        "currency": order.currency,
        "status": "",
        "items": items,
        "created_at": order.created_at.isoformat() if order.created_at else datetime.now(UTC).isoformat(),
        "public_order_id": order.public_order_id,
        "customer_name": order.customer_name,
        "phone_e164": order.phone_e164,
        "total": float(order.total),
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
    log.info("order_submit_started path=/orders")
    log.info(
        "order_security_config ENABLE_IP_FRAUD_CHECK=%r(type=%s) DISABLE_ORDER_SECURITY_CHECKS=%r(type=%s) ENABLE_CAPT=%r(type=%s)",
        settings.enable_ip_fraud_check,
        type(settings.enable_ip_fraud_check).__name__,
        settings.disable_order_security_checks,
        type(settings.disable_order_security_checks).__name__,
        settings.enable_capt,
        type(settings.enable_capt).__name__,
    )
    try:
        normalized_phone = normalize_uae_phone(payload.phone)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    client_ip = get_client_ip(request)
    await verify_order_ip(client_ip=client_ip, phone_e164=normalized_phone, request=request)
    subtotal = Decimal("0")
    order_items: list[OrderItem] = []
    order_items_payload: list[dict] = []

    for item in payload.items:
        resolved = _resolve_line_price_name_sheet(sku=item.sku, client_price=item.price)
        if not resolved:
            log.warning("order_unknown_sku sku=%r lamp_tiers_in_catalog=%s", item.sku, LAMP_OFFER_SKUS <= set(PRODUCTS))
            extra = ""
            if (item.sku or "").startswith("LB-LAMP-"):
                extra = (
                    " — غالباً خدمة الـ API على الإنترنت **قديمة** ولم تُحدَّث بعد إضافة عروض الموقد. "
                    "في Easypanel: أعدي **Rebuild** لخدمة **الـ backend/API** من branch `main`، "
                    "ثم افتحي `GET /version` وتأكدي أن `catalog_skus` يحتوي LB-LAMP-OUD-379 و LB-LAMP-TRIPLE-449."
                )
            raise HTTPException(status_code=400, detail=f"Unknown SKU: {item.sku}{extra}")
        price, line_name, sheet_sku = resolved
        quantity = item.quantity
        subtotal += line_total(price, quantity)
        order_items_payload.append(
            {
                "sku": sheet_sku,
                "name": line_name,
                "price": float(price),
                "quantity": quantity,
                "is_upsell": False,
            }
        )
        order_items.append(
            OrderItem(
                sku=item.sku,
                name=line_name,
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
    order.public_order_id = f"nama-{datetime.now(UTC):%Y%m%d}-{uuid4().hex[:8].upper()}"
    session.add(order)
    await session.commit()

    sheet_payload = order_to_sheet_payload(order, order_items_payload)
    try:
        await send_order_to_sheet(sheet_payload)
    except Exception:
        log.exception("order_sheet_webhook_failed order_id=%s", order.public_order_id)
    try:
        await send_capi_events(sheet_payload, user_agent, client_ip)
    except Exception:
        log.exception(
            "order_capi_sidecar_failed order_id=%s phone_digits_prefix=%s",
            order.public_order_id,
            (numeric_phone(normalized_phone)[:6] + "…") if normalized_phone else None,
        )

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
) -> OrderResponse:
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
