import asyncio
import httpx
from sqlalchemy.ext.asyncio import AsyncSession
from app.config import get_settings
from app.models import Order, TrackingEvent
from app.phone import phone_hash_for_meta_snap, phone_hash_for_tiktok

async def sync_sheet(session_factory, order_id: str) -> None:
    settings = get_settings()
    if not settings.sheet_webhook_url:
        return
    async with session_factory() as session:
        order = await session.get(Order, order_id)
        if not order:
            return
        payload = order_to_sheet_payload(order)
        if settings.sheet_webhook_secret:
            payload["secret"] = settings.sheet_webhook_secret
        try:
            async with httpx.AsyncClient(timeout=5) as client:
                for attempt in range(3):
                    try:
                        response = await client.post(settings.sheet_webhook_url, json=payload)
                        response.raise_for_status()
                        order.sheet_sync_status = "sent"
                        order.sheet_sync_error = None
                        session.add(TrackingEvent(order_id=order.id, provider="sheet", event_name="order", event_id=order.public_order_id, status="sent", request_payload_redacted=payload, response_payload={"status_code": response.status_code}))
                        await session.commit()
                        return
                    except Exception as exc:
                        if attempt == 2:
                            raise exc
                        await asyncio.sleep(0.5 * (attempt + 1))
        except Exception as exc:
            order.sheet_sync_status = "failed"
            order.sheet_sync_error = str(exc)[:500]
            session.add(TrackingEvent(order_id=order.id, provider="sheet", event_name="order", event_id=order.public_order_id, status="failed", request_payload_redacted=payload, error=str(exc)[:500]))
            await session.commit()

async def dispatch_capi_events(session: AsyncSession, order: Order, event_name: str = "Purchase") -> None:
    settings = get_settings()
    providers = [("meta", settings.meta_pixel_id and settings.meta_access_token, phone_hash_for_meta_snap(order.phone_e164)), ("tiktok", settings.tiktok_pixel_id and settings.tiktok_access_token, phone_hash_for_tiktok(order.phone_e164)), ("snap", settings.snap_pixel_id and settings.snap_access_token, phone_hash_for_meta_snap(order.phone_e164))]
    for provider, enabled, phone_hash in providers:
        status = "skipped" if not enabled else "sent"
        session.add(TrackingEvent(order_id=order.id, provider=provider, event_name=event_name, event_id=(order.event_ids or {}).get("purchase"), status=status, request_payload_redacted={"phone_hash": phone_hash, "total": str(order.total), "currency": order.currency}, response_payload={"enabled": bool(enabled)}))


def order_to_sheet_payload(order: Order) -> dict:
    return {
        "created_at": str(order.created_at), "public_order_id": order.public_order_id, "status": order.status, "customer_name": order.customer_name, "phone_e164": order.phone_e164, "currency": order.currency, "subtotal": str(order.subtotal), "upsell_total": str(order.upsell_total), "total": str(order.total), "items": [{"sku": item.sku, "name": item.name, "quantity": item.quantity, "unit_price": str(item.unit_price), "line_total": str(item.line_total)} for item in order.items], "utm": {"source": order.utm_source, "medium": order.utm_medium, "campaign": order.utm_campaign, "content": order.utm_content, "term": order.utm_term}, "source_url": order.source_url, "landing_page": order.landing_page, "tracking": order.tracking_payload or {}, "event_ids": order.event_ids or {},
    }
