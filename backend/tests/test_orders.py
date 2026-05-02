import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlalchemy.pool import StaticPool
from app.database import get_session
from app.main import app
from app.models import Base

@pytest.fixture
async def client():
    engine = create_async_engine(
        "sqlite+aiosqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    session_factory = async_sessionmaker(engine, expire_on_commit=False)
    async def override_session():
        async with session_factory() as session:
            yield session
    app.dependency_overrides[get_session] = override_session
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac
    app.dependency_overrides.clear()
    await engine.dispose()

async def test_health(client):
    response = await client.get("/health")
    assert response.json() == {"status": "ok"}

async def test_order_creation_uses_authoritative_price(client):
    response = await client.post("/orders", json={"customer_name": "فاطمة", "phone": "0501234567", "items": [{"sku": "LB-BUNDLE-299", "name": "wrong", "price": 1, "quantity": 1}], "currency": "AED"})
    assert response.status_code == 200, response.text
    body = response.json()
    assert body["total"] == "299"
    assert body["order_id"].startswith("LB-")

async def test_rejects_unknown_sku(client):
    response = await client.post("/orders", json={"customer_name": "فاطمة", "phone": "0501234567", "items": [{"sku": "UNKNOWN", "quantity": 1}], "currency": "AED"})
    assert response.status_code == 400

async def test_upsell_updates_total(client):
    order = await client.post("/orders", json={"customer_name": "فاطمة", "phone": "0501234567", "items": [{"sku": "LB-BUNDLE-299", "quantity": 1}], "currency": "AED"})
    order_id = order.json()["order_id"]
    upsell = await client.post(f"/orders/{order_id}/upsell", json={"sku": "LB-UPSELL-MUSK-39", "quantity": 1})
    assert upsell.status_code == 200, upsell.text
    assert upsell.json()["total"] == "338.00"
