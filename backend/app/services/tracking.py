from __future__ import annotations

import time
from typing import Any

import httpx

from app.config import settings
from app.services.hashing import sha256_hex
from app.services.phone import normalize_uae_phone


def provider_hashes(phone: str) -> dict[str, str]:
    normalized = normalize_uae_phone(phone)
    numeric = normalized.e164.replace("+", "")
    return {
        "meta_ph": sha256_hex(numeric),
        "snap_ph": sha256_hex(numeric),
        "tiktok_phone": sha256_hex(normalized.e164),
    }


async def send_capi_events(order: dict[str, Any], user_agent: str | None, ip: str | None) -> None:
    """Best-effort CAPI dispatch. Orders must never fail because an ad API is down."""
    payload_order = {
        **order,
        "items": [
            {
                "content_id": item["sku"],
                "content_name": item["name"],
                "quantity": item["quantity"],
                "price": item["price"],
            }
            for item in order.get("items", [])
        ],
    }
    tasks = []
    if settings.meta_access_token and settings.meta_pixel_id:
        tasks.append(_send_meta(payload_order, user_agent, ip))
    if settings.tiktok_access_token and settings.tiktok_pixel_id:
        tasks.append(_send_tiktok(payload_order, user_agent, ip))
    if settings.snap_access_token and settings.snap_pixel_id:
        tasks.append(_send_snap(payload_order, user_agent, ip))
    for task in tasks:
        try:
            await task
        except Exception:
            continue


async def _send_meta(order: dict[str, Any], user_agent: str | None, ip: str | None) -> None:
    hashes = provider_hashes(order["phone_e164"])
    payload = {
        "data": [
            {
                "event_name": "Purchase",
                "event_time": int(time.time()),
                "event_id": order["event_ids"].get("purchase"),
                "action_source": "website",
                "event_source_url": order.get("source_url"),
                "user_data": {
                    "ph": hashes["meta_ph"],
                    "client_user_agent": user_agent,
                    "client_ip_address": ip,
                    "fbp": order["tracking"].get("fbp"),
                    "fbc": order["tracking"].get("fbc"),
                },
                "custom_data": {
                    "currency": "AED",
                    "value": order["total"],
                    "contents": order["items"],
                },
            }
        ],
        "access_token": settings.meta_access_token,
    }
    async with httpx.AsyncClient(timeout=5) as client:
        await client.post(f"https://graph.facebook.com/v20.0/{settings.meta_pixel_id}/events", json=payload)


async def _send_tiktok(order: dict[str, Any], user_agent: str | None, ip: str | None) -> None:
    hashes = provider_hashes(order["phone_e164"])
    payload = {
        "event_source": "web",
        "event_source_id": settings.tiktok_pixel_id,
        "data": [
            {
                "event": "CompletePayment",
                "event_time": int(time.time()),
                "event_id": order["event_ids"].get("purchase"),
                "user": {
                    "phone": hashes["tiktok_phone"],
                    "ttclid": order["tracking"].get("ttclid"),
                    "ttp": order["tracking"].get("ttp"),
                    "ip": ip,
                    "user_agent": user_agent,
                },
                "page": {"url": order.get("source_url")},
                "properties": {
                    "currency": "AED",
                    "value": order["total"],
                    "contents": order["items"],
                },
            }
        ],
    }
    async with httpx.AsyncClient(timeout=5) as client:
        await client.post(
            "https://business-api.tiktok.com/open_api/v1.3/event/track/",
            json=payload,
            headers={"Access-Token": settings.tiktok_access_token or ""},
        )


async def _send_snap(order: dict[str, Any], user_agent: str | None, ip: str | None) -> None:
    hashes = provider_hashes(order["phone_e164"])
    payload = {
        "data": [
            {
                "event_name": "PURCHASE",
                "event_time": int(time.time()),
                "event_id": order["event_ids"].get("purchase"),
                "action_source": "WEB",
                "event_source_url": order.get("source_url"),
                "user_data": {
                    "ph": [hashes["snap_ph"]],
                    "client_ip_address": ip,
                    "client_user_agent": user_agent,
                    "sc_click_id": order["tracking"].get("sc_click_id"),
                },
                "custom_data": {
                    "currency": "AED",
                    "value": str(order["total"]),
                    "contents": order["items"],
                },
            }
        ]
    }
    async with httpx.AsyncClient(timeout=5) as client:
        await client.post(
            f"https://tr.snapchat.com/v3/{settings.snap_pixel_id}/events",
            json=payload,
            headers={"Authorization": f"Bearer {settings.snap_access_token}"},
        )
