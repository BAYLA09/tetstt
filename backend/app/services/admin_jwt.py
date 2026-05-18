from __future__ import annotations

import time
from typing import Any

import jwt

from app.config import settings


def admin_auth_configured() -> bool:
    return bool(
        settings.admin_username
        and settings.admin_password
        and settings.admin_jwt_secret
        and len(settings.admin_jwt_secret) >= 16,
    )


def issue_admin_token() -> str:
    if not admin_auth_configured():
        raise ValueError("admin auth not configured")
    now = int(time.time())
    payload: dict[str, Any] = {"sub": "layali-admin", "iat": now, "exp": now + 86400}
    return jwt.encode(payload, settings.admin_jwt_secret or "", algorithm="HS256")


def verify_admin_token(token: str) -> dict[str, Any] | None:
    if not settings.admin_jwt_secret:
        return None
    try:
        return jwt.decode(token, settings.admin_jwt_secret, algorithms=["HS256"])
    except jwt.PyJWTError:
        return None
