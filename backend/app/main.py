import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.db import init_db
from app.deployment import deploy_build_time_utc, deploy_commit_sha
from app.products import LAMP_OFFER_SKUS, PRODUCTS
from app.routers import health, orders

log = logging.getLogger(__name__)

app = FastAPI(title=settings.app_name, version="0.1.0")

origins = settings.allowed_origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def on_startup() -> None:
    lamp_prices_ok = all(sku in PRODUCTS for sku in LAMP_OFFER_SKUS)
    log.info(
        "app_startup commit_sha=%s build_time_utc=%s app_env=%s ENABLE_IP_FRAUD_CHECK=%s "
        "DISABLE_ORDER_SECURITY_CHECKS=%s catalog_sku_count=%s lamp_offer_skus_ok=%s",
        deploy_commit_sha(),
        deploy_build_time_utc(),
        settings.app_env,
        settings.enable_ip_fraud_check,
        settings.disable_order_security_checks,
        len(PRODUCTS),
        lamp_prices_ok,
    )
    await init_db()


app.include_router(health.router)
app.include_router(orders.router)
