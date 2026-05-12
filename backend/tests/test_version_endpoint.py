"""GET /version exposes deploy metadata (no secrets)."""

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_ping_ok() -> None:
    r = client.get("/ping")
    assert r.status_code == 200
    assert r.text == "ok"


def test_version_ok() -> None:
    r = client.get("/version")
    assert r.status_code == 200
    data = r.json()
    assert data["service"] == "layali-beauty-api"
    assert "commit_sha" in data
    assert "build_time_utc" in data
    assert "enable_ip_fraud_check" in data
    assert "disable_order_security_checks" in data
    assert isinstance(data["enable_ip_fraud_check"], bool)
    assert "catalog_skus" in data
    skus = data["catalog_skus"]
    assert isinstance(skus, list)
    assert "LB-LAMP-OUD-379" in skus
    assert "LB-LAMP-TRIPLE-449" in skus
    lamp = data["lamp_bundle_prices_aed"]
    assert isinstance(lamp, dict)
    assert lamp["LB-LAMP-189"] == "299"
    assert lamp["LB-LAMP-OUD-379"] == "379"
    assert lamp["LB-LAMP-TRIPLE-449"] == "449"


def test_version_head() -> None:
    r = client.head("/version")
    assert r.status_code == 200
