from __future__ import annotations

import logging
from datetime import datetime
from typing import Any
from urllib.parse import urlparse
from zoneinfo import ZoneInfo

import httpx

from app.config import settings

log = logging.getLogger(__name__)

_SHEET_TZ = ZoneInfo("Asia/Dubai")


def sheet_webhook_host() -> str | None:
    url = settings.effective_sheet_webhook_url
    if not url:
        return None
    return urlparse(url).netloc or None


def interpret_apps_script_response(data: Any) -> tuple[bool, str | None]:
    """
    Layali Apps Script returns { ok: true|false, error?: string }.
    Only ok:true counts as success — avoids false sent on HTML, {}, or {success:true}.
    """
    if not isinstance(data, dict):
        return False, "Webhook response was not JSON object (wrong /exec URL or HTML error page)"
    if data.get("ok") is True:
        return True, None
    if data.get("ok") is False:
        return False, str(data.get("error") or data)[:500]
    if data.get("success") is True:
        return (
            False,
            "Webhook returned {success:true} but not {ok:true} — wrong /exec URL or stale deployment",
        )
    return False, f"Unexpected webhook JSON (need ok:true): {str(data)[:200]}"


async def _post_sheet_webhook(
    webhook_url: str,
    body: dict,
    *,
    follow_redirects: bool,
) -> tuple[int, str, Any | None]:
    async with httpx.AsyncClient(timeout=12, follow_redirects=follow_redirects) as client:
        response = await client.post(webhook_url, json=body)
        response.raise_for_status()
        try:
            data = response.json()
        except Exception:
            data = None
        return response.status_code, (response.text or "")[:500], data


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
        _status_code, _text, data = await _post_sheet_webhook(
            webhook_url, body, follow_redirects=True
        )
        ok, err = interpret_apps_script_response(data)
        if not ok:
            log.warning(
                "sheet_webhook_app_script_error orderid=%r err=%s body=%r",
                payload.get("orderid"),
                (err or "")[:300],
                str(data)[:200],
            )
            return "failed", err
        log.info(
            "sheet_webhook_sent orderid=%r appscript=%r",
            payload.get("orderid"),
            data,
        )
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


async def probe_sheet_webhook() -> dict[str, Any]:
    """
    Admin-only diagnostic: POST a probe row to the configured webhook and report HTTP/JSON.
    Creates one sheet row with orderid layali-probe-* (safe to delete).
    """
    webhook_url = settings.effective_sheet_webhook_url
    host = sheet_webhook_host()
    if not webhook_url:
        return {
            "configured": False,
            "host": None,
            "secret_configured": bool(settings.effective_sheet_webhook_secret),
            "follow_redirects": True,
            "without_redirect": None,
            "with_redirect": None,
            "verdict": "skipped",
            "error": "GOOGLE_SHEETS_WEBHOOK_URL / SHEET_WEBHOOK_URL not set",
        }

    probe_id = f"layali-probe-{datetime.now(_SHEET_TZ):%Y%m%d%H%M%S}"
    body: dict[str, Any] = {
        "date": datetime.now(_SHEET_TZ).strftime("%d/%m/%Y"),
        "orderid": probe_id,
        "country": "UAE",
        "name": "Sheet probe (delete me)",
        "phone": "+971500000000",
        "product": "DIAGNOSTIC",
        "url": "https://layalibeauty.shop",
        "sku": "PROBE",
        "quantity": "1",
        "totalprice": 0,
        "currency": "AED",
        "status": "probe",
    }
    if settings.effective_sheet_webhook_secret:
        body["secret"] = settings.effective_sheet_webhook_secret

    without: dict[str, Any] | None = None
    try:
        code, text, data = await _post_sheet_webhook(webhook_url, body, follow_redirects=False)
        without = {"http_status": code, "body_preview": text[:300], "json": data}
    except Exception as exc:
        without = {"error": str(exc)[:500]}

    with_redirect: dict[str, Any] | None = None
    verdict = "unknown"
    error: str | None = None
    try:
        code, text, data = await _post_sheet_webhook(webhook_url, body, follow_redirects=True)
        ok, err = interpret_apps_script_response(data)
        with_redirect = {
            "http_status": code,
            "body_preview": text[:300],
            "json": data,
            "appscript_ok": ok,
            "appscript_error": err,
        }
        if ok:
            verdict = "ok"
        else:
            verdict = "failed"
            error = err
    except Exception as exc:
        with_redirect = {"error": str(exc)[:500]}
        verdict = "failed"
        error = str(exc)[:500]

    return {
        "configured": True,
        "host": host,
        "secret_configured": bool(settings.effective_sheet_webhook_secret),
        "probe_orderid": probe_id,
        "follow_redirects": True,
        "without_redirect": without,
        "with_redirect": with_redirect,
        "verdict": verdict,
        "error": error,
    }
