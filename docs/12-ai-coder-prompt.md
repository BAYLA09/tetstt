# Prompt for AI Coder

Copy this prompt into the implementation agent.

---

You are building the Layali Beauty Arabic DTC store. Read every file in `docs/` before coding, especially:

- `docs/01-product-and-offer-brief.md`
- `docs/02-architecture.md`
- `docs/03-frontend-spec.md`
- `docs/04-backend-spec.md`
- `docs/05-database-and-orders.md`
- `docs/06-brand-positioning-and-arabic-copy.md`
- `docs/07-cro-page-blueprints.md`
- `docs/08-design-system.md`
- `docs/09-tracking-pixels-and-capi.md`
- `docs/10-deployment-easypanel.md`
- `docs/11-testing-and-qa.md`

Build two folders:

```text
frontend/
backend/
```

Frontend requirements:

- Next.js App Router + React + TypeScript + Tailwind CSS.
- Arabic RTL, mobile first, premium UAE beauty design.
- Use the provided Layali Beauty logo direction: deep emerald green background with warm metallic gold logo/accent. This palette must drive the header, hero, CTA system, cards, checkout, cart drawer, footer, and placeholder imagery. Follow `docs/08-design-system.md`.
- Pages: home, collection, product landing pages for all offers, about, contact, thank-you.
- Cart drawer with cross-sells.
- Checkout popup with only name and UAE phone.
- Product CTA adds selected offer to cart and opens cart drawer.
- Cart CTA opens checkout popup.
- After valid checkout submit, show a one-time AED 39 upsell for 10-15 seconds, then thank-you.
- Include deferred Meta/TikTok/Snap browser pixels with shared `event_id` dedup strategy.
- Include placeholder premium product images that can be replaced later.
- Include `.env.example`, Dockerfile, README/run instructions.

Backend requirements:

- Python FastAPI, SQLAlchemy async, Alembic, Postgres.
- Endpoints: `GET /health`, `POST /orders`, `POST /orders/{order_id}/upsell`.
- Validate and normalize UAE mobile phone numbers.
- Calculate prices server-side from SKU registry.
- Persist orders, order items, tracking events.
- Run Alembic migrations on container start.
- Send orders to Google Sheet webhook from `SHEET_WEBHOOK_URL`.
- Implement Meta CAPI, TikTok Events API, Snap CAPI with env-gated sending, server-side SHA-256 phone hashing, retries, and provider logs.
- Include `.env.example`, Dockerfile, README/run instructions.

Use these assets:

- `docs/assets/google_apps_script_orders_webhook.js`
- `docs/assets/layali_beauty_sheet_template.csv`
- `docs/assets/frontend.env.example`
- `docs/assets/backend.env.example`

Database internal URL for EasyPanel env:

```text
postgres://layalibeauty:layalibeauty@layalibeauty_database:5432/layalibeauty?sslmode=disable
```

Production domains:

- Frontend: `https://layalibeauty.shop`
- Backend: `https://api.layalibeauty.shop`

Do not invent fake certifications or fake medical claims. Use proof language from the docs. Mark placeholder reviews as seed placeholders until real reviews exist.

Before finalizing, run the automated tests and build checks described in `docs/11-testing-and-qa.md`, and manually test the mobile product-to-thank-you flow.

---
