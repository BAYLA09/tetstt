# Architecture

## Stack

Frontend:

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui or Radix UI for accessible RTL drawers/dialogs
- Zustand for cart/checkout state
- React Hook Form + Zod for checkout validation
- Framer Motion for light drawer/modal transitions
- `next/image` for optimized product images

Backend:

- Python 3.12+
- FastAPI
- Pydantic v2
- SQLAlchemy 2 async
- Alembic
- asyncpg
- httpx
- tenacity
- pydantic-settings
- uvicorn

Database:

```text
postgres://layalibeauty:layalibeauty@layalibeauty_database:5432/layalibeauty?sslmode=disable
```

Store this as backend `DATABASE_URL`; never expose it in frontend.

## Target folders

```text
frontend/
  app/
    layout.tsx
    page.tsx
    collections/page.tsx
    products/[slug]/page.tsx
    about/page.tsx
    contact/page.tsx
    thank-you/[orderId]/page.tsx
  components/
    cart/
    checkout/
    product/
    sections/
    tracking/
    ui/
  data/
    products.ts
    offers.ts
    copy.ts
  lib/
    api.ts
    cart.ts
    events.ts
    phone.ts
    pixels.ts
  public/images/placeholders/
  Dockerfile
  .env.example

backend/
  app/
    main.py
    config.py
    db.py
    models.py
    schemas.py
    routers/
      health.py
      orders.py
    services/
      orders.py
      sheet_webhook.py
      meta_capi.py
      tiktok_events_api.py
      snap_capi.py
      hashing.py
      phone.py
    migrations/
  alembic.ini
  Dockerfile
  .env.example
```

## Main flow

1. Visitor lands from TikTok, Snapchat, Meta, or direct traffic.
2. Frontend captures UTM and click IDs: `fbclid`, `_fbp`, `_fbc`, `ttclid`, `_ttp`, `ScCid`, `_scid`.
3. Browser pixel events load after interactive/consent.
4. Product CTA adds selected offer to cart and opens cart drawer.
5. Cart cross-sells raise AOV.
6. Cart CTA opens checkout popup.
7. Checkout validates `name` and UAE mobile phone only.
8. Backend validates again, calculates totals from SKU registry, creates Postgres order, posts to Google Sheets webhook, and sends CAPI events.
9. Frontend shows a one-time AED 39 upsell for 10-15 seconds.
10. Accepted upsell calls backend and updates final order total.
11. Buyer lands on thank-you page with COD confirmation steps.

## Event architecture

Every trackable action uses:

- `event_id`
- platform event name
- page URL
- cart/order contents
- AED value
- click IDs/cookies
- IP and user-agent captured on backend

The same `event_id` must be sent to browser pixel and backend CAPI for deduplication.

## Performance

- Product/home pages should be mostly static.
- Hydrate only cart, checkout, tracking, and interactive sections.
- Pixel scripts use `afterInteractive` or lazy loading.
- Product images use optimized placeholders until final assets arrive.
- Do not block checkout on ad platform availability.

## Privacy and security

- Raw phone/name only go to backend and Google Sheet.
- Ad platforms receive hashed phone only.
- Tokens stay server-side.
- CORS only allows `https://layalibeauty.shop` and optional `www`.
- Rate-limit order creation by IP and phone.
