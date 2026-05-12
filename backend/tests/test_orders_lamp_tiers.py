"""POST /orders must accept lamp bundle tier SKUs from the storefront."""

from __future__ import annotations

from decimal import Decimal
from unittest.mock import AsyncMock, patch

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.products import LAMP_OFFER_SKUS, PRODUCTS


@pytest.fixture
def api() -> TestClient:
    with TestClient(app) as c:
        yield c


def _payload(sku: str, *, quantity: int = 1) -> dict:
    return {
        "customer_name": "اختبار طلب",
        "phone": "+971501234567",
        "items": [{"sku": sku, "quantity": quantity}],
        "currency": "AED",
    }


@pytest.fixture
def no_sidecars() -> None:
    with (
        patch("app.routers.orders.send_order_to_sheet", new_callable=AsyncMock),
        patch("app.routers.orders.send_capi_events", new_callable=AsyncMock),
    ):
        yield


def test_catalog_contains_lamp_tier_skus_and_prices() -> None:
    assert LAMP_OFFER_SKUS <= set(PRODUCTS.keys())
    assert PRODUCTS["LB-LAMP-189"]["price"] == Decimal("299")
    assert PRODUCTS["LB-LAMP-OUD-379"]["price"] == Decimal("379")
    assert PRODUCTS["LB-LAMP-TRIPLE-449"]["price"] == Decimal("449")


def test_post_orders_lb_lamp_oud_379(api: TestClient, no_sidecars) -> None:
    r = api.post("/orders", json=_payload("LB-LAMP-OUD-379"))
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["total"] == pytest.approx(379.0)
    assert data["status"] == "received"
    assert data["currency"] == "AED"


def test_post_orders_lb_lamp_triple_449(api: TestClient, no_sidecars) -> None:
    r = api.post("/orders", json=_payload("LB-LAMP-TRIPLE-449", quantity=1))
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["total"] == pytest.approx(449.0)


def test_post_orders_lb_lamp_189(api: TestClient, no_sidecars) -> None:
    r = api.post("/orders", json=_payload("LB-LAMP-189"))
    assert r.status_code == 200, r.text
    assert r.json()["total"] == pytest.approx(299.0)


def test_post_orders_unknown_lamp_sku_returns_400(api: TestClient, no_sidecars) -> None:
    r = api.post("/orders", json=_payload("LB-LAMP-OUD-000"))
    assert r.status_code == 400
    body = r.json()
    detail = body.get("detail", "")
    assert isinstance(detail, str) and "Unknown SKU" in detail
