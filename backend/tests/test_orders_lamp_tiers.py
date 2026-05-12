"""POST /orders must accept lamp bundle tier SKUs from the storefront."""

from __future__ import annotations

from decimal import Decimal
from unittest.mock import AsyncMock, patch

import pytest
from fastapi.testclient import TestClient

import app.routers.orders as orders_mod
from app.main import app
from app.products import LAMP_OFFER_SKUS, PRODUCTS


@pytest.fixture
def api() -> TestClient:
    with TestClient(app) as c:
        yield c


def _payload(sku: str, *, quantity: int = 1, line_price: float | None = None) -> dict:
    line: dict = {"sku": sku, "quantity": quantity}
    if line_price is not None:
        line["price"] = line_price
    return {
        "customer_name": "اختبار طلب",
        "phone": "+971501234567",
        "items": [line],
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


def test_post_orders_lb_lamp_189_client_price_379(api: TestClient, no_sidecars) -> None:
    r = api.post("/orders", json=_payload("LB-LAMP-189", line_price=379.0))
    assert r.status_code == 200, r.text
    assert r.json()["total"] == pytest.approx(379.0)


def test_post_orders_lb_lamp_189_client_price_449(api: TestClient, no_sidecars) -> None:
    r = api.post("/orders", json=_payload("LB-LAMP-189", line_price=449.0))
    assert r.status_code == 200, r.text
    assert r.json()["total"] == pytest.approx(449.0)


def test_tier_skus_resolve_via_fallback_when_absent_from_products_dict(
    api: TestClient, no_sidecars: None
) -> None:
    """Simulates a stale API image: PRODUCTS has base lamp but not tier bundle rows."""
    narrow = {k: v for k, v in orders_mod.PRODUCTS.items() if k not in ("LB-LAMP-OUD-379", "LB-LAMP-TRIPLE-449")}
    with patch.object(orders_mod, "PRODUCTS", narrow):
        r = api.post("/orders", json=_payload("LB-LAMP-OUD-379"))
    assert r.status_code == 200, r.text
    assert r.json()["total"] == pytest.approx(379.0)


def test_post_orders_unknown_lamp_sku_returns_400(api: TestClient, no_sidecars) -> None:
    r = api.post("/orders", json=_payload("LB-LAMP-OUD-000"))
    assert r.status_code == 400
    body = r.json()
    detail = body.get("detail", "")
    assert isinstance(detail, str) and "Unknown SKU" in detail
