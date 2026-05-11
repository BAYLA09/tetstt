from __future__ import annotations

import ipaddress
from dataclasses import dataclass
from typing import Any

import httpx
from fastapi import HTTPException

from app.config import settings


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


async def evaluate_order_ip(ip: str | None, phone_e164: str) -> FraudDecision:
    if is_whitelisted_phone(phone_e164):
        return FraudDecision(True, "phone_whitelisted")

    # UAE E.164: always skip IP / MaxMind for COD — Easypanel and BFFs often hide the real public IP.
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
    if country_code != settings.allowed_order_country:
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


async def verify_order_ip(client_ip: str | None, phone_e164: str) -> None:
    decision = await evaluate_order_ip(client_ip, phone_e164)
    if decision.allowed:
        return

    raise HTTPException(
        status_code=403,
        detail={
            "message": (
                "لم يتم قبول الطلب بعد فحص أمني. إذا رقمك إماراتي صحيح، جرّبي من شبكة أخرى أو تواصلي معنا."
            ),
            "reason": decision.reason,
        },
    )
