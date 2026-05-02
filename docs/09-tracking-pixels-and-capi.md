# Tracking, Pixels, and CAPI

## Research basis

- Meta CAPI: use the same browser `eventID` and server `event_id` with the same event name for deduplication. Meta recommends this for browser + CAPI setups, with a 48-hour deduplication window.
- Meta customer data: phone `ph` requires SHA-256 hashing after normalization; `_fbp` and `_fbc` are not hashed.
- TikTok: Advanced Matching and Events API use SHA-256 hashed phone/email. Use a consistent `event_id` across Pixel and Events API for deduplication. Keep `ttclid` when present.
- Snap: CAPI requires `event_id` for deduplication; Pixel maps this to `client_dedup_id`. Phone `ph` is normalized to country code digits only, then SHA-256 hashed. Capture `ScCid` click ID.
- Google tags: build a central consent/deferred loader so consent mode or a CMP can be enabled cleanly.

## Event names

| Business action | Meta | TikTok | Snap |
|---|---|---|---|
| Page view | `PageView` | `PageView` | `PAGE_VIEW` |
| Product view | `ViewContent` | `ViewContent` | `VIEW_CONTENT` |
| Add to cart | `AddToCart` | `AddToCart` | `ADD_CART` |
| Begin checkout | `InitiateCheckout` | `InitiateCheckout` | `START_CHECKOUT` |
| COD order submitted | `Purchase` | `CompletePayment` | `PURCHASE` |

For COD, fire purchase when the order is submitted because that is the conversion. Track confirmation/delivery later as offline events if needed.

## Deduplication rule

Frontend generates `event_id` and sends the same value to:

1. Browser pixel call.
2. Backend order payload.
3. Server CAPI payload.

Recommended format:

```text
evt_{eventName}_{uuid}
```

For order submit, either:

- frontend sends `purchase_event_id` before `POST /orders`, and backend uses it for CAPI; or
- backend returns `purchase_event_id` and frontend fires browser Purchase immediately with that same value.

Use the first option for simpler timing.

## Browser pixel loading

- Defer pixels with `next/script` `afterInteractive` or a lazy custom loader.
- Do not block first render, cart, or checkout on pixels.
- Queue events if a pixel is not ready.
- Keep ad API tokens out of frontend.
- Put all tracking in `frontend/lib/events.ts` and `frontend/components/tracking`.

## IDs to capture

### Meta

- Read `_fbp`.
- Read `_fbc`.
- If URL has `fbclid` and `_fbc` is missing, create `_fbc` as `fb.1.{timestamp}.{fbclid}`.
- Send `fbp` and `fbc` to backend unhashed.

### TikTok

- Capture `ttclid` from URL and persist it first-party.
- Read `_ttp` when set by Pixel.
- For phone hashing, normalize to E.164 with `+` before hashing unless the final SDK explicitly says otherwise.

### Snap

- Capture `ScCid`.
- Read `_scid` where available and pass as `sc_cookie1` if used by the integration.
- For phone hashing, remove `+` and non-digits.

## Phone normalization for hashing

Checkout normalized phone:

```text
+971501234567
```

Meta hash input:

```text
971501234567
```

TikTok hash input:

```text
+971501234567
```

Snap hash input:

```text
971501234567
```

Trim before hashing. Hash only server-side for CAPI.

## Backend provider services

Create:

- `meta_capi.py`
- `tiktok_events_api.py`
- `snap_capi.py`

Each service must:

- skip cleanly if env vars are missing;
- include event name, event ID, event time, URL, IP, user-agent, contents, value, currency `AED`;
- include click IDs/cookies where available;
- hash phone server-side;
- retry transient failures;
- persist redacted request/response in `tracking_events`.

## Env vars

Frontend:

- `NEXT_PUBLIC_META_PIXEL_ID`
- `NEXT_PUBLIC_TIKTOK_PIXEL_ID`
- `NEXT_PUBLIC_SNAP_PIXEL_ID`
- `NEXT_PUBLIC_ENABLE_PIXELS`

Backend:

- `META_PIXEL_ID`
- `META_ACCESS_TOKEN`
- `TIKTOK_PIXEL_ID`
- `TIKTOK_ACCESS_TOKEN`
- `SNAP_PIXEL_ID`
- `SNAP_ACCESS_TOKEN`

## QA

- Browser AddToCart and backend AddToCart share an event ID.
- Browser Purchase and server Purchase share an event ID.
- Raw phone never leaves backend except to order DB/sheet.
- Provider failures never block order creation.
- CAPI logs are redacted.
