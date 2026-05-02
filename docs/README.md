# Layali Beauty DTC Store Documentation

This folder is the implementation brief for an Arabic, UAE-focused, premium DTC beauty store at `layalibeauty.shop` with FastAPI backend at `api.layalibeauty.shop`.

## Goal

Build a branded Arabic COD store that feels like Layali Beauty owns the products, supports high-ticket pricing, increases AOV with cart cross-sells and post-submit upsells, and sends every order to Google Sheets plus ad platforms through browser pixels and server-side CAPI.

## Required deliverable shape

The AI coder should deliver:

```text
frontend/   # Next.js + React + Tailwind storefront
backend/    # Python FastAPI API, Postgres models, migrations, CAPI, webhook dispatch
```

## Documents

1. `01-product-and-offer-brief.md` - products, offers, prices, bundles, AOV rules.
2. `02-architecture.md` - full frontend/backend/data/event architecture.
3. `03-frontend-spec.md` - pages, components, cart drawer, checkout popup, responsive behavior.
4. `04-backend-spec.md` - FastAPI endpoints, validation, order flow, CAPI, sheet webhook.
5. `05-database-and-orders.md` - Postgres schema and migration startup rules.
6. `06-brand-positioning-and-arabic-copy.md` - brand voice, ICP language, emotional copy, proof claims.
7. `07-cro-page-blueprints.md` - home, collection, product landing pages, cart, checkout, thank-you CRO.
8. `08-design-system.md` - premium Arabic visual system and component rules.
9. `09-tracking-pixels-and-capi.md` - Meta/TikTok/Snap web pixel + CAPI requirements.
10. `10-deployment-easypanel.md` - Docker, env vars, domains, EasyPanel deployment.
11. `11-testing-and-qa.md` - QA checklist and acceptance tests.
12. `12-ai-coder-prompt.md` - copy/paste prompt for the implementation agent.

## Assets

- `assets/frontend.env.example`
- `assets/backend.env.example`
- `assets/google_apps_script_orders_webhook.js`
- `assets/layali_beauty_sheet_template.csv`

## Non-negotiables

- Arabic first, RTL everywhere.
- Mobile first; Snapchat and TikTok traffic will be mostly mobile.
- COD only: no payment gateway.
- Checkout collects only `name` and valid UAE phone.
- Product CTA adds the selected offer to cart, opens the cart drawer, then cart CTA opens checkout popup.
- After valid checkout submit, show a 10-15 second one-time upsell at AED 39, then create order and thank-you page.
- Cart drawer must show relevant cross-sells to increase AOV.
- All conversion events must use deterministic `event_id` so browser pixels and server CAPI deduplicate correctly.
- Web pixels should be deferred/consent-aware for speed.
- Server-side CAPI hashes phone numbers before sending to ad platforms.
