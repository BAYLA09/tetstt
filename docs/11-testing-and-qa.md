# Testing and QA

## Success definition

The site is ready when a mobile visitor from TikTok/Snap can land on a product page, add the premium offer to cart, see relevant cross-sells, submit a COD order with only name and valid UAE phone, see a one-time AED 39 upsell, reach thank-you page, and the backend stores/sends the order with deduplicated tracking events.

## Automated tests

### Frontend

Add tests for:

- UAE phone validation and normalization.
- Cart add/remove/update totals.
- Offer selection.
- Cross-sell selection rules.
- Event ID generation.
- Checkout form enables CTA only when valid.

Expected commands:

- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`

### Backend

Add tests for:

- UAE phone validation.
- SKU price authority.
- Order total calculation.
- Order creation endpoint.
- Upsell endpoint.
- Sheet webhook retry behavior with mocked HTTP.
- CAPI payload hashing with mocked HTTP.

Expected commands:

- `pytest`
- `ruff check .`
- `python -m compileall app`

## Manual QA flows

### Mobile product conversion

1. Open `/products/luxury-bundle` at 390px width.
2. CTA is visible above fold or sticky after scroll.
3. Tap `أضيفي العرض للسلة`.
4. Cart drawer opens.
5. Bundle appears at AED 299.
6. Cross-sell `ثنائي السيروم الفاخر` appears at AED 99.
7. Add cross-sell.
8. Total updates to AED 398.
9. Tap `إتمام الطلب`.
10. Checkout popup opens.
11. Invalid phone keeps CTA disabled.
12. Valid UAE phone enables CTA.
13. Submit creates order.
14. AED 39 upsell appears with timer.
15. Accept upsell.
16. Thank-you page shows final total AED 437.

### Desktop layout

1. Open home at 1440px.
2. Hero text is right, image left.
3. Next visual section alternates image/text.
4. Header/footer menus work.
5. Cart drawer is side drawer, not full-screen.

### Tracking QA

1. Open URL with `?utm_source=tiktok&ttclid=test123&fbclid=fbtest&ScCid=snaptest`.
2. Add to cart and checkout.
3. Backend receives click IDs.
4. Browser and server events use the same event IDs.
5. CAPI logs show phone hashed.
6. If tokens are missing, providers are skipped without breaking the order.

### Sheet QA

1. Paste `assets/google_apps_script_orders_webhook.js` into Apps Script, then **Deploy → New deployment → Web app** (Execute as: Me, Who has access: Anyone).
2. Set `GOOGLE_SHEETS_WEBHOOK_URL` on the API to the `/exec` URL (no leading space after `=`).
3. If the script uses `LAYALI_WEBHOOK_SECRET`, set the same value in `SHEETS_WEBHOOK_SECRET` on the API.
4. Submit a test order; confirm `GET /version` shows `sheet_webhook_configured: true`.
5. Verify a new row on the **`Orders`** tab (columns match `assets/layali_beauty_sheet_template.csv`, including **`url`**).

## Acceptance checklist

- RTL works on every page.
- Product CTAs open cart drawer.
- Cart CTA opens checkout popup.
- Checkout has exactly two required fields: name and phone.
- UAE phone validation works on frontend and backend.
- Order totals are backend-authoritative.
- Upsell appears after saved order.
- Thank-you page confirms COD and next steps.
- Postgres stores order.
- Sheet receives order.
- CAPI can be toggled by env.
- Pixel scripts are deferred.
- No ad tokens are in frontend.
- Docker builds both services.
- Backend migrations run on start.
