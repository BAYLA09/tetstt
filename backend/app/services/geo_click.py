from __future__ import annotations

import logging
from dataclasses import dataclass
from typing import Any

import httpx
from starlette.requests import Request

from app.config import settings
from app.services.client_ip import get_cf_ip_country, get_client_ip
from app.services.fraud import _is_private_or_local_ip

log = logging.getLogger(__name__)


@dataclass
class ClickGeoResult:
    client_ip: str | None
    cf_country: str | None
    maxmind_country: str | None
    country_code: str | None
    geo_valid_uae: bool
    geo_reject_reason: str | None
    ad_platform: str | None


def detect_ad_platform(*, fbclid: str | None, ttclid: str | None, sc_click_id: str | None) -> str | None:
    if fbclid:
        return "meta"
    if ttclid:
        return "tiktok"
    if sc_click_id:
        return "snap"
    return None


async def _maxmind_country_and_traits(ip: str) -> tuple[str | None, dict[str, Any], str | None]:
    """Returns (country_iso, traits, error_reason)."""
    if not settings.maxmind_account_id or not settings.maxmind_license_key:
        return None, {}, "maxmind_credentials_missing"

    url = f"{settings.maxmind_api_url.rstrip('/')}/{ip}"
    try:
        async with httpx.AsyncClient(timeout=5) as client:
            response = await client.get(
                url,
                auth=(settings.maxmind_account_id, settings.maxmind_license_key),
            )
            response.raise_for_status()
            payload = response.json()
    except Exception as exc:
        log.warning("click_maxmind_lookup_failed ip=%r exc=%s", ip, type(exc).__name__)
        return None, {}, f"maxmind_lookup_failed:{type(exc).__name__}"

    country = payload.get("country", {}).get("iso_code") or payload.get("registered_country", {}).get("iso_code")
    traits = payload.get("traits") or {}
    return (str(country).upper() if country else None), traits, None


def _maxmind_traits_blocked(traits: dict[str, Any]) -> str | None:
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
            return f"blocked_trait:{trait}"

    risk_score = traits.get("ip_risk")
    if isinstance(risk_score, (int, float)) and risk_score >= settings.maxmind_max_ip_risk:
        return f"ip_risk_too_high:{risk_score}"
    return None


def evaluate_uae_click_geo(
    *,
    cf_country: str | None,
    maxmind_country: str | None,
    maxmind_block_reason: str | None,
) -> tuple[bool, str | None, str | None]:
    """
    Require UAE from Cloudflare and/or MaxMind when available.
    Reject if any source says non-AE or MaxMind flags risky traits.
    """
    if maxmind_block_reason:
        return False, maxmind_country or cf_country, maxmind_block_reason

    known: list[str] = []
    if cf_country:
        known.append(cf_country.upper())
    if maxmind_country:
        known.append(maxmind_country.upper())

    if not known:
        return False, None, "geo_unknown"

    if any(c != settings.order_allowed_country for c in known):
        return False, known[0], f"country_not_{settings.order_allowed_country}"

    return True, settings.order_allowed_country, None


async def resolve_click_geo(
    request: Request,
    *,
    fbclid: str | None,
    ttclid: str | None,
    sc_click_id: str | None,
) -> ClickGeoResult:
    client_ip = get_client_ip(request)
    cf_country = get_cf_ip_country(request)
    maxmind_country: str | None = None
    maxmind_block: str | None = None

    if client_ip and not _is_private_or_local_ip(client_ip):
        mm_country, traits, mm_err = await _maxmind_country_and_traits(client_ip)
        maxmind_country = mm_country
        if mm_err and not mm_country:
            log.debug("click_maxmind_degraded reason=%s ip=%r", mm_err, client_ip)
        trait_block = _maxmind_traits_blocked(traits) if traits else None
        if trait_block:
            maxmind_block = trait_block

    geo_valid, country_code, reject = evaluate_uae_click_geo(
        cf_country=cf_country,
        maxmind_country=maxmind_country,
        maxmind_block_reason=maxmind_block,
    )

    return ClickGeoResult(
        client_ip=client_ip,
        cf_country=cf_country,
        maxmind_country=maxmind_country,
        country_code=country_code,
        geo_valid_uae=geo_valid,
        geo_reject_reason=reject,
        ad_platform=detect_ad_platform(fbclid=fbclid, ttclid=ttclid, sc_click_id=sc_click_id),
    )
