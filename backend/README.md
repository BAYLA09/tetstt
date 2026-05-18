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

For local testing without Postgres, set:

```text
DATABASE_URL=sqlite+aiosqlite:///./layali.db
```

## Admin dashboard and analytics

When `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `ADMIN_JWT_SECRET` (16+ chars) are set, the API exposes:

- `POST /admin/login` — JSON body `{ "username", "password" }`; returns a bearer JWT.
- `GET /admin/metrics` — date range query params `date_from` / `date_to` (`YYYY-MM-DD`, UTC); requires `Authorization: Bearer <token>`.
- `GET /admin/orders` and `GET /admin/orders/{public_order_id}` — same auth.

`POST /analytics/click` accepts paid click ids (`fbclid`, `ttclid`, and/or `sc_click_id`) for landing-page attribution; it does not require admin auth.

For a greenfield Postgres schema (including `ad_clicks`), see `migrations/sql/layali_cod_store_postgres_bootstrap.sql`. SQLite dev databases pick up new tables on startup via SQLAlchemy `create_all`.
