# Layali Beauty DTC Store Documentation

This folder is the implementation brief for an Arabic, UAE-focused, premium DTC beauty store at `layalibeauty.shop` with FastAPI backend at `api.layalibeauty.shop`.

## Goal

Build a branded Arabic COD store that feels like Layali Beauty owns the products, supports high-ticket pricing, increases AOV with cart cross-sells and post-submit upsells, and sends every order to Google Sheets plus ad platforms through browser pixels and server-side CAPI.

## Required deliverable shape

```text
frontend/   # Next.js + React + Tailwind storefront
backend/    # Python FastAPI API, Postgres models, migrations, CAPI, webhook dispatch
```

## Non-negotiables

- Arabic first, RTL everywhere.
- Mobile first; Snapchat and TikTok traffic will be mostly mobile.
- COD only: no payment gateway.
- Checkout collects only `name` and valid UAE phone.
- Product CTA adds the selected offer to cart, opens the cart drawer, then cart CTA opens checkout popup.
- After valid checkout submit, show a 10-15 second one-time upsell at AED 39, then thank-you.
- Cart drawer must show relevant cross-sells to increase AOV.
- All conversion events must use deterministic `event_id` so browser pixels and server CAPI deduplicate correctly.
- Web pixels should be deferred/consent-aware for speed.
- Server-side CAPI hashes phone numbers before sending to ad platforms.
