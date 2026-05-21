from typing import Any

from fastapi import APIRouter, Response
from fastapi.responses import PlainTextResponse

from app.config import settings
from app.deployment import deploy_build_time_utc, deploy_commit_sha
from app.products import PRODUCTS, lamp_bundle_prices

router = APIRouter()


@router.get("/ping", response_class=PlainTextResponse)
async def ping() -> str:
    return "ok"


@router.head("/ping")
async def ping_head() -> Response:
    return Response(status_code=200)


@router.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@router.head("/health")
async def health_head() -> Response:
    return Response(status_code=200)


@router.get("/version")
async def version() -> dict[str, Any]:
    """Non-secret deploy fingerprint — use to verify EasyPanel built a new image."""
    return {
        "service": "layali-beauty-api",
        "app_version": "0.1.0",
        "commit_sha": deploy_commit_sha(),
        "build_time_utc": deploy_build_time_utc(),
        "app_env": settings.app_env,
        "enable_ip_fraud_check": bool(settings.enable_ip_fraud_check),
        "disable_order_security_checks": bool(settings.disable_order_security_checks),
        "catalog_skus": sorted(PRODUCTS.keys()),
        "lamp_bundle_prices_aed": lamp_bundle_prices(),
        "sheet_webhook_configured": bool(settings.effective_sheet_webhook_url),
        "sheet_webhook_secret_configured": bool(settings.effective_sheet_webhook_secret),
    }


@router.head("/version")
async def version_head() -> Response:
    return Response(status_code=200)
