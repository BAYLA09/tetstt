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
- `GET /admin/metrics?date_from=YYYY-MM-DD&date_to=YYYY-MM-DD` — Bearer token; returns clicks, orders, revenue, conversion (orders ÷ ad clicks).
- `GET /admin/orders?...` — Bearer token; paginated order summaries.
- `GET /admin/orders/{public_order_id}` — Bearer token; full order + line items.

**Ad clicks:** `POST /analytics/click` (public) records a row only when the body includes at least one of `fbclid`, `ttclid`, or `sc_click_id` (Snap). The storefront beacon sends once per session.

For production Postgres, apply `migrations/sql/20260517_ad_clicks_postgres.sql` or run Alembic revision `20260517_0002`.

For local testing without Postgres, set:

```text
DATABASE_URL=sqlite+aiosqlite:///./layali.db
```
