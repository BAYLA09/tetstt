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

### `GET /health`

Returns:

```json
{"status":"ok"}
```

### `POST /orders`

Creates COD order.

Request:

```json
{
  "customer_name": "فاطمة",
  "phone": "+971501234567",
  "items": [
    {"sku":"LB-BUNDLE-299","name":"باقة ليالي بيوتي الفاخرة","price":299,"quantity":1}
  ],
  "currency": "AED",
  "source_url": "https://layalibeauty.shop/products/luxury-bundle",
  "landing_page": "https://layalibeauty.shop/?ttclid=...",
  "event_ids": {
    "initiate_checkout": "evt_...",
    "purchase": "evt_..."
  },
  "tracking": {
    "fbp": "fb.1....",
    "fbc": "fb.1....",
    "ttclid": "...",
    "ttp": "...",
    "sc_click_id": "...",
    "sc_cookie1": "..."
  },
  "utm": {
    "source": "tiktok",
    "medium": "paid",
    "campaign": "...",
    "content": "...",
    "term": "..."
  }
}
```

Response:

```json
{
  "order_id": "LB-20260502-000001",
  "status": "received",
  "total": 299,
  "currency": "AED"
}
```

### `POST /orders/{order_id}/upsell`

Adds post-submit upsell.

Request:

```json
{
  "sku": "LB-UPSELL-MUSK-39",
  "name": "سيروم مسك المطر الأبيض - عرض خاص",
  "price": 39,
  "quantity": 1,
  "event_id": "evt_..."
}
```

Response:

```json
{"order_id":"LB-20260502-000001","total":338,"upsell_added":true}
```

## Validation

### UAE phone

Accept input formats:

- `05XXXXXXXX`
- `5XXXXXXXX`
- `+9715XXXXXXXX`
- `009715XXXXXXXX`

Normalize to:

- E.164 display/API format: `+9715XXXXXXXX`
- Numeric hashing format for Meta/Snap: `9715XXXXXXXX`
- E.164 hashing format for TikTok: `+9715XXXXXXXX` unless an official SDK specifies otherwise.

Reject:

- Non-UAE country code.
- Landline-only numbers.
- Fewer/more digits.
- Repeating fake numbers if simple anti-spam is added.

## Order status

Initial status: `received`.

Future statuses:

- `confirmed`
- `cancelled`
- `shipped`
- `delivered`
- `returned`

## Webhook to Google Sheets

- Env var: `SHEET_WEBHOOK_URL`.
- Send after DB order creation.
- Use retries with timeout.
- If sheet webhook fails, keep DB order and mark `sheet_sync_status=failed` for retry.
- Do not block customer success page indefinitely because the sheet is down.

## CAPI behavior

- Env flags enable/disable each provider.
- Hash phone server-side using SHA-256 after provider-specific normalization.
- Send CAPI events asynchronously after order creation.
- Store provider responses in `tracking_events` with status and truncated error body.
- Never log raw phone in provider logs.

## Rate limiting and abuse controls

- Add simple IP-based rate limit for `POST /orders`.
- Add phone-based duplicate guard: if same phone submits identical cart within 10 minutes, return existing order or flag duplicate.
- Add honeypot field only if frontend supports it invisibly.

## Startup migration

Docker start command should run migrations before starting API:

```sh
alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## CORS

Production allowlist:

- `https://layalibeauty.shop`
- `https://www.layalibeauty.shop` if `www` is enabled

Dev allowlist:

- `http://localhost:3000`
