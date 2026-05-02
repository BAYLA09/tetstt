# Testing and QA

## Success definition

The site is ready when a mobile visitor can land on a product page, add the premium offer to cart, see relevant cross-sells, submit a COD order with only name and valid UAE phone, see a one-time AED 39 upsell, reach thank-you page, and the backend stores/sends the order with deduplicated tracking events.

## Expected commands

Frontend: `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`.

Backend: `pytest`, `ruff check .`, `python -m compileall app`.

## Manual QA flow

Open `/products/luxury-bundle` at mobile width, add the bundle, add refill cross-sell, validate invalid/valid phone behavior, submit order, accept upsell, confirm thank-you total.
