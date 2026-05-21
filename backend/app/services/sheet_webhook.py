from __future__ import annotations

import logging

import httpx

from app.config import settings

log = logging.getLogger(__name__)


async def send_order_to_sheet(payload: dict) -> tuple[str, str | None]:
    webhook_url = settings.effective_sheet_webhook_url
    if not webhook_url:
        log.warning("sheet_webhook_skipped: GOOGLE_SHEETS_WEBHOOK_URL / SHEET_WEBHOOK_URL not set")
        return "skipped", None

    body = dict(payload)
    if settings.effective_sheet_webhook_secret:
        body["secret"] = settings.effective_sheet_webhook_secret

    try:
        # Google Apps Script web apps often respond with redirects; httpx defaults to no follow.
        async with httpx.AsyncClient(timeout=12, follow_redirects=True) as client:
            response = await client.post(webhook_url, json=body)
            response.raise_for_status()
            # Apps Script doPost often returns HTTP 200 with JSON { ok: false } (e.g. wrong secret) — not an HTTP error.
            try:
                data = response.json()
            except Exception:
                data = None
            if isinstance(data, dict) and data.get("ok") is False:
                err = str(data.get("error") or data)
                log.warning("sheet_webhook_app_script_error orderid=%r err=%s", payload.get("orderid"), err[:300])
                return "failed", err[:500]
        return "sent", None
    except httpx.HTTPStatusError as exc:
        detail = (exc.response.text or "")[:500]
        log.warning(
            "sheet_webhook_http_error status=%s orderid=%r body_head=%r",
            exc.response.status_code,
            payload.get("orderid"),
            detail[:200],
        )
        return "failed", f"HTTP {exc.response.status_code}: {detail}"[:500]
    except Exception as exc:  # Keep order creation resilient if Sheets is down.
        log.warning("sheet_webhook_failed orderid=%r err=%s", payload.get("orderid"), exc)
        return "failed", str(exc)[:500]
