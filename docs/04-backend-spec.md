# Backend Spec

## Core requirements

- FastAPI backend at `api.layalibeauty.shop`.
- COD orders only.
- Persist orders in Postgres.
- Send orders to Google Sheets webhook.
- Send Meta, TikTok, and Snap CAPI events when env vars are configured.
- Validate UAE phone server-side.
- Run database migrations on backend start.

## API endpoints

- `GET /health` returns `{ "status": "ok" }`.
- `POST /orders` creates a COD order.
- `POST /orders/{order_id}/upsell` adds the AED 39 post-submit upsell.

## Validation

Accept UAE mobile formats only and normalize to `+9715XXXXXXXX`. Hash provider-specific normalized phone values with SHA-256 before ad platform calls.

## Startup migration

Docker start command should run migrations before API startup:

```sh
alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000
```
