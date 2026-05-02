# Deployment on EasyPanel

## Services

Create two app services:

1. `layali-frontend`
2. `layali-backend`

Database already exists:

```text
postgres://layalibeauty:layalibeauty@layalibeauty_database:5432/layalibeauty?sslmode=disable
```

## Domains

Frontend:

- `https://layalibeauty.shop`
- Optional redirect from `https://www.layalibeauty.shop`

Backend:

- `https://api.layalibeauty.shop`

## Frontend Dockerfile target

Use a multi-stage Node build:

- Install dependencies.
- Build Next.js.
- Run production server on port `3000`.
- Expose port `3000`.

Suggested env:

```text
NEXT_PUBLIC_SITE_URL=https://layalibeauty.shop
NEXT_PUBLIC_API_BASE_URL=https://api.layalibeauty.shop
NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_TIKTOK_PIXEL_ID=
NEXT_PUBLIC_SNAP_PIXEL_ID=
NEXT_PUBLIC_ENABLE_PIXELS=true
```

## Backend Dockerfile target

Use Python 3.12 slim:

- Install dependencies.
- Copy app and Alembic files.
- Expose port `8000`.
- Run migrations before serving:

```sh
alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Suggested env:

```text
APP_ENV=production
DATABASE_URL=postgres://layalibeauty:layalibeauty@layalibeauty_database:5432/layalibeauty?sslmode=disable
FRONTEND_ORIGIN=https://layalibeauty.shop
SHEET_WEBHOOK_URL=
META_PIXEL_ID=
META_ACCESS_TOKEN=
TIKTOK_PIXEL_ID=
TIKTOK_ACCESS_TOKEN=
SNAP_PIXEL_ID=
SNAP_ACCESS_TOKEN=
```

## Health checks

Backend:

```text
GET /health
```

Frontend:

```text
GET /
```

## EasyPanel deployment rules

- Use backend service name `layali-backend` and expose port `8000`.
- Use frontend service name `layali-frontend` and expose port `3000`.
- Add `FRONTEND_ORIGIN` exactly as production domain to backend CORS.
- Do not expose Postgres publicly.
- Set secrets through EasyPanel environment UI, not committed files.

## Migration safety

- Alembic migrations must be idempotent and run on container start.
- Backend should fail loudly if migrations fail.
- Do not auto-drop tables.

## Logs to watch after deploy

- Backend startup migration output.
- `/health` returns OK.
- CORS preflight from frontend to backend succeeds.
- First test order appears in DB.
- First test order appears in sheet.
- CAPI providers are skipped or sent based on env configuration.
