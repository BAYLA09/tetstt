from __future__ import annotations

import httpx

from app.config import settings


async def send_order_to_sheet(payload: dict) -> tuple[str, str | None]:
    webhook_url = settings.effective_sheet_webhook_url
    if not webhook_url:
        return "skipped", None

    body = dict(payload)
    if settings.effective_sheet_webhook_secret:
        body["secret"] = settings.effective_sheet_webhook_secret

    try:
        async with httpx.AsyncClient(timeout=6) as client:
            response = await client.post(webhook_url, json=body)
            response.raise_for_status()
        return "sent", None
    except Exception as exc:  # Keep order creation resilient if Sheets is down.
        return "failed", str(exc)[:500]
