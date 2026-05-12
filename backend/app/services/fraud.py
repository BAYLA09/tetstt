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


def _digits_uae_national(phone_e164: str) -> str:
    """971… national digits (no leading +)."""
    d = numeric_phone((phone_e164 or "").strip())
    if d.startswith("00971"):
        d = d[2:]
    return d


def is_uae_national_phone_e164(phone_e164: str) -> bool:
    """True for any normalized UAE E.164 (+971…), mobile or landline — storefront policy: no IP/MaxMind gate."""
    d = _digits_uae_national(phone_e164)
    return bool(d.startswith("971") and len(d) >= 11)


def _is_uae_mobile_cod(phone_e164: str) -> bool:
    """UAE mobile under 971 (5 + 8 digits), digits-only — survives odd Unicode/plus/spacing."""
    d = _digits_uae_national(phone_e164)
    return bool(re.fullmatch(r"9715\d{8}", d))


def is_uae_cod_phone(phone_e164: str) -> bool:
    """UAE COD mobile — IP/MaxMind must not block checkout for these numbers."""
    if _is_uae_mobile_cod(phone_e164):
        return True
    compact = (phone_e164 or "").strip().replace(" ", "").replace("-", "")
    return compact.startswith("+971")


async def evaluate_order_ip(ip: str | None, phone_e164: str) -> FraudDecision:
    if settings.disable_order_security_checks:
        return FraudDecision(True, "security_globally_disabled")

    if not settings.enable_ip_fraud_check:
        return FraudDecision(True, "fraud_check_disabled")

    if is_whitelisted_phone(phone_e164):
        return FraudDecision(True, "phone_whitelisted")

    if _is_uae_mobile_cod(phone_e164):
        return FraudDecision(True, "uae_mobile_bypass")

    compact = phone_e164.strip().replace(" ", "").replace("-", "")
    if compact.startswith("+971"):
        return FraudDecision(True, "uae_e164_bypass")

    if _is_private_or_local_ip(ip):
        log.warning(
            "order_ip_missing_or_private_allow_degraded reason=missing_or_private_ip ip=%r phone_digits_prefix=%s",
            ip,
            (numeric_phone(phone_e164)[:6] + "…") if phone_e164 else None,
        )
        return FraudDecision(True, "missing_or_private_ip_allow")

    if not settings.maxmind_account_id or not settings.maxmind_license_key:
        log.warning("order_ip_maxmind_credentials_missing_allow")
        return FraudDecision(True, "maxmind_credentials_missing_allow")

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
        log.warning(
            "order_ip_maxmind_lookup_failed_allow exc=%s ip=%r",
            type(exc).__name__,
            ip,
        )
        return FraudDecision(True, f"maxmind_lookup_failed_allow:{type(exc).__name__}")

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
    rid = getattr(request.state, "request_id", "-") if request else "-"
    log.info(
        "order_fraud_verify_enter rid=%s phone_digits_prefix=%s is_uae_national=%s disable_security=%s enable_ip_check=%s",
        rid,
        (numeric_phone((phone_e164 or "").strip())[:6] + "…") if phone_e164 else None,
        is_uae_national_phone_e164(phone_e164),
        settings.disable_order_security_checks,
        settings.enable_ip_fraud_check,
    )
    if settings.disable_order_security_checks:
        log.warning("order_security_bypassed_by_env DISABLE_ORDER_SECURITY_CHECKS=true")
        return

    # First: any UAE national number — never block checkout for IP/MaxMind on this store.
    if is_uae_national_phone_e164(phone_e164):
        log.info(
            "order_ip_fraud_skipped_uae_national_phone phone_digits_prefix=%s",
            (numeric_phone(phone_e164)[:6] + "…") if phone_e164 else None,
        )
        return

    if not settings.enable_ip_fraud_check:
        log.info("order_ip_fraud_check_disabled ENABLE_IP_FRAUD_CHECK=false")
        return

    if is_uae_cod_phone(phone_e164):
        log.info("order_ip_fraud_skipped_uae_phone (store is UAE COD)")
        return

    decision = await evaluate_order_ip(client_ip, phone_e164)
    if decision.allowed:
        return

    xff = (request.headers.get("x-forwarded-for") or "")[:256] if request else ""
    origin = request.headers.get("origin") if request else None
    referer = (request.headers.get("referer") or "")[:160] if request else ""
    ua_len = len(request.headers.get("user-agent") or "") if request else 0
    log.warning(
        "order_rejected_security rid=%s reason=%s client_ip=%r xff=%r origin=%r referer=%r ua_len=%s phone_digits_prefix=%s",
        rid,
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
                "لم يتم قبول الطلب بعد فحص أمني على الشبكة. إذا كنتِ على VPN أو شبكة غير عادية، "
                "جرّبي بدونها أو تواصلي معنا."
            ),
            "reason": decision.reason,
            "code": "ORDER_SECURITY_IP",
        },
        headers={
            "X-Order-Security-Reason": decision.reason,
            "X-Order-Security-Code": "ORDER_SECURITY_IP",
        },
    )
