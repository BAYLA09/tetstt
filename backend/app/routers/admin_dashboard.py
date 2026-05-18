from __future__ import annotations

import hashlib
import logging
import secrets
from datetime import UTC, date, datetime, timedelta
from typing import Annotated

from fastapi import APIRouter, Depends, Header, HTTPException, Query
from sqlalchemy import and_, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.config import settings
from app.db import get_session
from app.models import AdClick, Order
from app.schemas import (
    AdminLoginIn,
    AdminLoginResponse,
    AdminMetricsOut,
    AdminOrdersListOut,
    OrderAdminDetailOut,
    OrderAdminSummaryOut,
    OrderItemAdminOut,
)
from app.services.admin_jwt import admin_auth_configured, issue_admin_token, verify_admin_token

log = logging.getLogger(__name__)

router = APIRouter(prefix="/admin", tags=["admin"])


def _password_matches(given: str, expected: str) -> bool:
    """Length-independent compare without early-exit on username."""
    a = hashlib.sha256(given.encode("utf-8")).digest()
    b = hashlib.sha256(expected.encode("utf-8")).digest()
    return secrets.compare_digest(a, b)


async def require_admin(authorization: Annotated[str | None, Header()] = None) -> None:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    token = authorization.split(" ", 1)[1].strip()
    if not verify_admin_token(token):
        raise HTTPException(status_code=401, detail="Unauthorized")


def _parse_range(
    date_from: str | None,
    date_to: str | None,
) -> tuple[datetime, datetime, str, str]:
    """UTC half-open range [start, end)."""
    today = datetime.now(UTC).date()
    if date_to:
        end_day = date.fromisoformat(date_to)
    else:
        end_day = today
    if date_from:
        start_day = date.fromisoformat(date_from)
    else:
        start_day = end_day - timedelta(days=29)
    if start_day > end_day:
        raise HTTPException(status_code=400, detail="date_from must be on or before date_to")

    start_dt = datetime(start_day.year, start_day.month, start_day.day, tzinfo=UTC)
    end_dt = datetime(end_day.year, end_day.month, end_day.day, tzinfo=UTC) + timedelta(days=1)
    return start_dt, end_dt, start_day.isoformat(), end_day.isoformat()


def _mask_phone(phone: str) -> str:
    digits = "".join(c for c in phone if c.isdigit())
    if len(digits) < 6:
        return "***"
    return f"{digits[:3]}···{digits[-4:]}"


@router.post("/login", response_model=AdminLoginResponse)
async def admin_login(payload: AdminLoginIn) -> AdminLoginResponse:
    if not admin_auth_configured():
        raise HTTPException(status_code=503, detail="Admin login is not configured on this server")
    if not settings.admin_username or not settings.admin_password:
        raise HTTPException(status_code=503, detail="Admin login is not configured on this server")
    if not _password_matches(payload.username, settings.admin_username) or not _password_matches(
        payload.password, settings.admin_password
    ):
        log.warning("admin_login_failed")
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = issue_admin_token()
    return AdminLoginResponse(access_token=token)


@router.get("/metrics", response_model=AdminMetricsOut)
async def admin_metrics(
    _: None = Depends(require_admin),
    session: AsyncSession = Depends(get_session),
    date_from: str | None = Query(None, description="YYYY-MM-DD (UTC)"),
    date_to: str | None = Query(None, description="YYYY-MM-DD (UTC) inclusive"),
) -> AdminMetricsOut:
    start_dt, end_dt, ds, de = _parse_range(date_from, date_to)

    clicks = int(
        (
            await session.execute(select(func.count()).select_from(AdClick).where(AdClick.created_at >= start_dt, AdClick.created_at < end_dt))
        ).scalar_one()
    )

    orders_stmt = select(func.count()).select_from(Order).where(Order.created_at >= start_dt, Order.created_at < end_dt)
    orders_count = int((await session.execute(orders_stmt)).scalar_one())

    revenue_raw = (
        await session.execute(
            select(func.coalesce(func.sum(Order.total), 0))
            .select_from(Order)
            .where(Order.created_at >= start_dt, Order.created_at < end_dt),
        )
    ).scalar_one()
    revenue = float(revenue_raw or 0)

    conversion = (orders_count / clicks * 100.0) if clicks else None
    aov = (revenue / orders_count) if orders_count else None

    status_rows = (
        await session.execute(
            select(Order.status, func.count())
            .select_from(Order)
            .where(Order.created_at >= start_dt, Order.created_at < end_dt)
            .group_by(Order.status),
        )
    ).all()
    orders_by_status = {str(s): int(c) for s, c in status_rows}

    pending_sheet = int(
        (
            await session.execute(
                select(func.count())
                .select_from(Order)
                .where(
                    Order.created_at >= start_dt,
                    Order.created_at < end_dt,
                    Order.sheet_sync_status == "pending",
                ),
            )
        ).scalar_one()
    )

    with_upsell = int(
        (
            await session.execute(
                select(func.count())
                .select_from(Order)
                .where(
                    Order.created_at >= start_dt,
                    Order.created_at < end_dt,
                    Order.upsell_total > 0,
                ),
            )
        ).scalar_one()
    )
    upsell_rate = (with_upsell / orders_count * 100.0) if orders_count else None

    return AdminMetricsOut(
        date_from=ds,
        date_to=de,
        clicks=clicks,
        orders=orders_count,
        revenue_aed=round(revenue, 2),
        conversion_rate_percent=round(conversion, 2) if conversion is not None else None,
        average_order_value_aed=round(aov, 2) if aov is not None else None,
        orders_by_status=orders_by_status,
        pending_sheet_sync_count=pending_sheet,
        orders_with_upsell=with_upsell,
        upsell_attach_rate_percent=round(upsell_rate, 2) if upsell_rate is not None else None,
    )


@router.get("/orders", response_model=AdminOrdersListOut)
async def admin_orders(
    _: None = Depends(require_admin),
    session: AsyncSession = Depends(get_session),
    date_from: str | None = Query(None),
    date_to: str | None = Query(None),
    status: str | None = Query(None, description="Filter by order.status"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
) -> AdminOrdersListOut:
    start_dt, end_dt, _, _ = _parse_range(date_from, date_to)
    filters = [Order.created_at >= start_dt, Order.created_at < end_dt]
    if status:
        filters.append(Order.status == status.strip())

    total = int((await session.execute(select(func.count()).select_from(Order).where(and_(*filters)))).scalar_one())

    stmt = (
        select(Order)
        .options(selectinload(Order.items))
        .where(and_(*filters))
        .order_by(Order.created_at.desc())
        .offset(offset)
        .limit(limit)
    )
    rows = (await session.execute(stmt)).scalars().unique().all()
    out: list[OrderAdminSummaryOut] = []
    for o in rows:
        preview = " · ".join(f"{it.name} ×{it.quantity}" for it in o.items[:4])
        if len(o.items) > 4:
            preview += " …"
        out.append(
            OrderAdminSummaryOut(
                public_order_id=o.public_order_id,
                created_at=o.created_at.isoformat() if o.created_at else "",
                customer_name=o.customer_name,
                phone_display=_mask_phone(o.phone_e164),
                total=float(o.total),
                currency=o.currency,
                status=o.status,
                utm_source=o.utm_source,
                items_preview=preview,
            )
        )
    return AdminOrdersListOut(total=total, limit=limit, offset=offset, orders=out)


@router.get("/orders/{public_order_id}", response_model=OrderAdminDetailOut)
async def admin_order_detail(
    public_order_id: str,
    _: None = Depends(require_admin),
    session: AsyncSession = Depends(get_session),
) -> OrderAdminDetailOut:
    stmt = select(Order).options(selectinload(Order.items)).where(Order.public_order_id == public_order_id)
    order = (await session.execute(stmt)).scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    tracking = order.tracking_payload or {}
    keys = sorted(str(k) for k in tracking)

    items_out = [
        OrderItemAdminOut(
            sku=it.sku,
            name=it.name,
            unit_price=float(it.unit_price),
            quantity=it.quantity,
            line_total=float(it.line_total),
            is_upsell=it.is_upsell,
        )
        for it in sorted(order.items, key=lambda x: (x.is_upsell, x.created_at or datetime.min.replace(tzinfo=UTC)))
    ]

    ev = order.event_ids or {}
    event_ids = {str(k): str(v) for k, v in ev.items()}

    return OrderAdminDetailOut(
        public_order_id=order.public_order_id,
        internal_id=order.id,
        created_at=order.created_at.isoformat() if order.created_at else "",
        updated_at=order.updated_at.isoformat() if order.updated_at else "",
        customer_name=order.customer_name,
        phone_e164=order.phone_e164,
        currency=order.currency,
        subtotal=float(order.subtotal),
        upsell_total=float(order.upsell_total),
        total=float(order.total),
        status=order.status,
        source_url=order.source_url,
        landing_page=order.landing_page,
        utm={
            "source": order.utm_source,
            "medium": order.utm_medium,
            "campaign": order.utm_campaign,
            "content": order.utm_content,
            "term": order.utm_term,
        },
        tracking_keys=keys,
        event_ids=event_ids,
        sheet_sync_status=order.sheet_sync_status,
        sheet_sync_error=order.sheet_sync_error,
        items=items_out,
    )
