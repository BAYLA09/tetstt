from __future__ import annotations

from starlette.requests import Request


def get_client_ip(request: Request) -> str | None:
    """Prefer CDN/proxy headers, then first X-Forwarded-For hop."""
    for header in ("cf-connecting-ip", "x-real-ip"):
        raw = request.headers.get(header)
        if raw:
            ip = raw.strip().split(",")[0].strip()
            if ip:
                return ip
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else None


def get_cf_ip_country(request: Request) -> str | None:
    """Cloudflare country code (ISO 3166-1 alpha-2), when present."""
    raw = request.headers.get("cf-ipcountry") or request.headers.get("CF-IPCountry")
    if not raw:
        return None
    code = raw.strip().upper()
    if code in {"", "XX", "T1"}:
        return None
    return code[:2]
