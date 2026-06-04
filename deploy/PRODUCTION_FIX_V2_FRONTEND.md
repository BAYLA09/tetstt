# EasyPanel frontend — deploy from `main`

The live storefront was on commit **`8477f88`** (May 2026). Speed fixes are on **`main`** at **`13659cf`**.

## EasyPanel settings (frontend / layalibeauty.shop)

| Field | Value |
|-------|--------|
| **Git branch** | **`main`** |
| **Build context** | **`frontend`** (Option A) **or** repo root + **`Dockerfile.frontend`** (Option B) |
| **Dockerfile** | **`Dockerfile`** (Option A) **or** **`Dockerfile.frontend`** (Option B) |
| **Replicas** | **1** (two replicas caused ~50% of requests at ~20s TTFB) |

### Build arguments (every rebuild — bump `CACHE_BUST` each time)

```
COMMIT_SHA=13659cf
BUILD_TIME_UTC=<now UTC ISO8601>
CACHE_BUST=frontend-speed-13659cf-1
NEXT_PUBLIC_API_BASE_URL=https://api.layalibeauty.shop
NEXT_PUBLIC_ORDER_USE_SAME_ORIGIN_PROXY=false
NEXT_PUBLIC_APP_BUILD_MARKER=layalibeauty-storefront
```

Enable **Rebuild** / **Disable build cache**. A deploy that finishes in **0–2 seconds** is a restart only.

## After rebuild — verify

```bash
./scripts/verify-frontend-deploy.sh https://layalibeauty.shop 13659cf
```

Or manually:

1. `curl -sS https://layalibeauty.shop/api/build-info` → **`commitSha`** starts with **`13659cf`** (not `8477f88`).
2. PDP images load from **`cdn.jsdelivr.net`** as **`.webp`** (~35–67 KB).
3. TTFB under **3s**.

## Backend

Same branch **`main`**, rebuild with fresh `CACHE_BUST`. See **`deploy/EASYPANEL_DEPLOY_NOW.txt`**.

See also: **`deploy/PRODUCTION_FIX_V2.md`**
