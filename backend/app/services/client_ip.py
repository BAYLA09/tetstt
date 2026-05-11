"""Resolve the real client IP behind reverse proxies (EasyPanel, Cloudflare, etc.)."""

from __future__ import annotations

import ipaddress

from starlette.requests import Request


def _is_usable_public_ip(ip: str) -> bool:
    """True for routable addresses we can send to MaxMind; excludes RFC1918 / loopback / link-local."""
    try:
        addr = ipaddress.ip_address(ip.strip())
    except ValueError:
        return False
    if addr.is_private or addr.is_loopback or addr.is_link_local or addr.is_reserved or addr.is_multicast:
        return False
    if addr.version == 6 and addr.ipv4_mapped is not None:
        v4 = ipaddress.ip_address(str(addr.ipv4_mapped))
        if v4.is_private or v4.is_loopback or v4.is_link_local:
            return False
    return True


def get_client_ip(request: Request) -> str | None:
    """
    Prefer provider-specific headers, then the first *public* IP in X-Forwarded-For
    (some chains prepend a private edge IP — taking only the first token breaks fraud checks).
    Fall back to the left-most XFF token, then TCP peer host (works with uvicorn --proxy-headers).
    """
    single_value_headers = (
        "cf-connecting-ip",
        "true-client-ip",
        "fastly-client-ip",
        "x-real-ip",
    )
    for name in single_value_headers:
        raw = request.headers.get(name)
        if not raw:
            continue
        ip = raw.split(",")[0].strip()
        if ip and _is_usable_public_ip(ip):
            return ip

    xff = request.headers.get("x-forwarded-for")
    if xff:
        parts = [p.strip() for p in xff.split(",") if p.strip()]
        for ip in parts:
            if _is_usable_public_ip(ip):
                return ip
        if parts:
            return parts[0]

    if request.client and request.client.host:
        return request.client.host
    return None
