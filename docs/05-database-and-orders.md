# Database and Orders

## Database

Use Postgres database `layalibeauty`.

Production internal connection example:

```text
postgres://layalibeauty:layalibeauty@layalibeauty_database:5432/layalibeauty?sslmode=disable
```

Store it as `DATABASE_URL` in backend environment variables.

## Tables

### `orders`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid pk | Internal ID |
| `public_order_id` | varchar unique | Example `LB-20260502-000001` |
| `customer_name` | varchar | Raw name |
| `phone_e164` | varchar | Example `+971501234567` |
| `phone_hash` | varchar | SHA-256 normalized phone for duplicate matching |
| `currency` | varchar | `AED` |
| `subtotal` | numeric | Before upsell |
| `upsell_total` | numeric | Added after submit |
| `total` | numeric | Final total |
| `status` | varchar | `received` default |
| `source_url` | text | Page submitted from |
| `landing_page` | text | First landing page if captured |
| `utm_source` | varchar | nullable |
| `utm_medium` | varchar | nullable |
| `utm_campaign` | varchar | nullable |
| `utm_content` | varchar | nullable |
| `utm_term` | varchar | nullable |
| `tracking_payload` | jsonb | Click IDs/cookies, no tokens |
| `event_ids` | jsonb | Browser/server dedup IDs |
| `sheet_sync_status` | varchar | `pending/sent/failed` |
| `sheet_sync_error` | text | nullable, truncated |
| `created_at` | timestamptz | default now |
| `updated_at` | timestamptz | auto update |

### `order_items`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid pk | Internal ID |
| `order_id` | uuid fk | references orders |
| `sku` | varchar | Product SKU |
| `name` | varchar | Arabic item name at order time |
| `unit_price` | numeric | AED |
| `quantity` | int | >=1 |
| `line_total` | numeric | unit * qty |
| `is_upsell` | boolean | default false |
| `created_at` | timestamptz | default now |

### `tracking_events`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid pk | Internal ID |
| `order_id` | uuid fk nullable | Link to order |
| `provider` | varchar | `meta/tiktok/snap/sheet` |
| `event_name` | varchar | Provider event |
| `event_id` | varchar | Dedup ID |
| `status` | varchar | `sent/failed/skipped` |
| `request_payload_redacted` | jsonb | No raw PII |
| `response_payload` | jsonb | truncated |
| `error` | text | nullable |
| `created_at` | timestamptz | default now |

## Indexes

- `orders(public_order_id)` unique.
- `orders(phone_hash)`.
- `orders(created_at)`.
- `tracking_events(provider, event_id)`.
- `order_items(order_id)`.

## Public order ID

Format:

```text
LB-YYYYMMDD-000001
```

Use a sequence or safe transaction to avoid duplicates.

## Sheet columns

Keep sheet columns stable. Add new fields to the right only.

See `assets/layali_beauty_sheet_template.csv`.

## Order totals

- Backend must calculate totals from accepted SKUs/prices, not trust frontend total.
- Frontend may send item names/prices for UX, but backend should map SKU to authoritative price.
- If a SKU is unknown, reject order.

## Product price registry in backend

```python
# Authoritative source: backend/app/products.py — keep in sync with storefront offer tiers.
PRODUCTS = {
    "LB-BUNDLE-299": ...,
    "LB-SERUM-MUSK-59": ...,
    "LB-SERUM-OUD-69": ...,
    "LB-SERUM-SET-99": ...,
    "LB-LAMP-189": ...,       # lamp only
    "LB-LAMP-OUD-379": ...,   # lamp + oud serum
    "LB-LAMP-TRIPLE-449": ...,  # lamp + two oud serums
    "LB-UPSELL-MUSK-39": ...,
    "LB-UPSELL-OUD-39": ...,
}
```
