from __future__ import annotations

import ipaddress
import logging
import re
from dataclasses import dataclass
from typing import Any

import httpx
from fastapi import HTTPException
from starlette.requests import Request

from app.config import settings
from app.services.phone import numeric_phone

log = logging.getLogger(__name__)


@dataclass
class FraudDecision:
    allowed: bool
    reason: str
    provider_payload: dict[str, Any] | None = None


def _is_private_or_local_ip(ip: str | None) -> bool:
    if not ip:
        return True
    try:
        parsed = ipaddress.ip_address(ip)
    except ValueError:
        return True
    return parsed.is_private or parsed.is_loopback or parsed.is_link_local


def is_whitelisted_phone(phone_e164: str) -> bool:
    allowed = {
        item.strip()
        for item in (settings.whitelisted_phones or "").split(",")
        if item.strip()
    }
    return phone_e164 in allowed


def _is_uae_mobile_cod(phone_e164: str) -> bool:
    """UAE mobile under 971 (5 + 8 digits), digits-only — survives odd Unicode/plus/spacing."""
    d = numeric_phone(phone_e164)
    if d.startswith("00971"):
        d = d[2:]
    return bool(re.fullmatch(r"9715\d{8}", d))


async def evaluate_order_ip(ip: str | None, phone_e164: str) -> FraudDecision:
    if is_whitelisted_phone(phone_e164):
        return FraudDecision(True, "phone_whitelisted")

    # UAE mobiles: never tie COD to client IP (Easypanel / BFF / Unicode phone formatting).
    if _is_uae_mobile_cod(phone_e164):
        return FraudDecision(True, "uae_mobile_bypass")

    # Secondary guard: normalized +971… from our phone helper
    compact = phone_e164.strip().replace(" ", "").replace("-", "")
    if compact.startswith("+971"):
        return FraudDecision(True, "uae_e164_bypass")

    if not settings.enable_ip_fraud_check:
        return FraudDecision(True, "fraud_check_disabled")

    if _is_private_or_local_ip(ip):
        return FraudDecision(False, "missing_or_private_ip")

    if not settings.maxmind_account_id or not settings.maxmind_license_key:
        return FraudDecision(False, "maxmind_credentials_missing")

    url = f"https://geoip.maxmind.com/geoip/v2.1/insights/{ip}"
    try:
        async with httpx.AsyncClient(timeout=5) as client:
            response = await client.get(
                url,
                auth=(settings.maxmind_account_id, settings.maxmind_license_key),
            )
            response.raise_for_status()
            payload = response.json()
    except Exception as exc:
        return FraudDecision(False, f"maxmind_lookup_failed:{type(exc).__name__}")

    country_code = (
        payload.get("country", {}).get("iso_code")
        or payload.get("registered_country", {}).get("iso_code")
    )
    if country_code != settings.order_allowed_country:
        return FraudDecision(False, f"country_not_allowed:{country_code}", payload)

    traits = payload.get("traits", {})
    blocked_traits = [
        "is_anonymous",
        "is_anonymous_proxy",
        "is_anonymous_vpn",
        "is_hosting_provider",
        "is_public_proxy",
        "is_residential_proxy",
        "is_tor_exit_node",
    ]
    for trait in blocked_traits:
        if traits.get(trait):
            return FraudDecision(False, f"blocked_trait:{trait}", payload)

    risk_score = traits.get("ip_risk")
    if isinstance(risk_score, (int, float)) and risk_score >= settings.maxmind_max_ip_risk:
        return FraudDecision(False, f"ip_risk_too_high:{risk_score}", payload)

    return FraudDecision(True, "maxmind_allowed", payload)


async def verify_order_ip(
    client_ip: str | None,
    phone_e164: str,
    *,
    request: Request | None = None,
) -> None:
    decision = await evaluate_order_ip(client_ip, phone_e164)
    if decision.allowed:
        return

    xff = (request.headers.get("x-forwarded-for") or "")[:256] if request else ""
    origin = request.headers.get("origin") if request else None
    referer = (request.headers.get("referer") or "")[:160] if request else ""
    ua_len = len(request.headers.get("user-agent") or "") if request else 0
    log.warning(
        "order_ip_fraud_rejected reason=%s client_ip=%r xff=%r origin=%r referer=%r ua_len=%s phone_digits_prefix=%s",
        decision.reason,
        client_ip,
        xff,
        origin,
        referer,
        ua_len,
        (numeric_phone(phone_e164)[:6] + "…") if phone_e164 else None,
    )

    raise HTTPException(
        status_code=403,
        detail={
            "message": (
                "لم يتم قبول الطلب بعد فحص أمني. إذا رقمك إماراتي صحيح، جرّبي من شبكة أخرى أو تواصلي معنا."
            ),
            "reason": decision.reason,
        },
    )
