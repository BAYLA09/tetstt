# Layali Beauty Backend

FastAPI COD order backend for `api.layalibeauty.shop`.

## Local run

```sh
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The app creates missing database tables on startup; Alembic migrations are not
run automatically in the Docker command.

## Admin dashboard API

When `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `ADMIN_JWT_SECRET` (16+ chars) are set:

- `POST /admin/login` — JSON `{ "username", "password" }` → `{ "access_token", "token_type", "expires_in" }`.
- `GET /admin/metrics?date_from=YYYY-MM-DD&date_to=YYYY-MM-DD` — Bearer token; returns UAE-valid clicks (Cloudflare + MaxMind), platform breakdown, orders, revenue, conversion (orders ÷ UAE clicks), AOV, orders-by-status, sheet-sync pending, upsell attach rate.
- `GET /admin/economics` — Bearer token; lifetime AOV (AED/USD), avg pieces per order for profit calculator defaults.
- `GET /admin/orders?date_from=&date_to=&status=&limit=&offset=` — Bearer token; JSON `{ total, limit, offset, orders: [...] }` with optional `status` filter.
- `GET /admin/orders/{public_order_id}` — Bearer token; full order + line items.

**Ad clicks:** `POST /analytics/click` (public) records a row only when the body includes at least one of `fbclid`, `ttclid`, or `sc_click_id` (Snap). The storefront beacon sends once per session.

For production Postgres, either run **Alembic** (`alembic upgrade head`) or apply the idempotent script `migrations/sql/layali_cod_store_postgres_bootstrap.sql` (full orders + items + tracking + ad_clicks). The older `migrations/sql/20260517_ad_clicks_postgres.sql` only adds `ad_clicks` if you already have orders from Alembic.

For local testing without Postgres, set:

```text
DATABASE_URL=sqlite+aiosqlite:///./layali.db
```
