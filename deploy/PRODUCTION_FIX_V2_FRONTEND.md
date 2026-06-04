# EasyPanel frontend — deploy from `production-fix-v2` (REQUIRED)

The live storefront was still on commit **`8477f88`** (May 2026) with **multi-MB PNG images** and **global `no-store` caching**.  
Pushing Git alone does **nothing** until EasyPanel runs a **full Docker rebuild** of the **frontend** service.

## EasyPanel settings (frontend / layalibeauty.shop)

| Field | Value |
|-------|--------|
| **Git branch** | **`production-fix-v2`** |
| **Build context** | **`frontend`** (Option A) **or** repo root + **`Dockerfile.frontend`** (Option B) |
| **Dockerfile** | **`Dockerfile`** (Option A) **or** **`Dockerfile.frontend`** (Option B) |

### Build arguments (every rebuild — bump `CACHE_BUST` each time)

```
COMMIT_SHA=e7da223
BUILD_TIME_UTC=<now UTC ISO8601>
CACHE_BUST=frontend-perf-v7-<unix-timestamp>
DEPLOY_BRANCH=production-fix-v2
NEXT_PUBLIC_API_BASE_URL=https://api.layalibeauty.shop
NEXT_PUBLIC_ORDER_USE_SAME_ORIGIN_PROXY=false
NEXT_PUBLIC_APP_BUILD_MARKER=layalibeauty-storefront
```

Enable **Rebuild** / **Disable build cache** / **No cache** if the panel offers it.  
A deploy that finishes in **0–2 seconds** is usually a **restart only** — not a real build.

## After rebuild — verify (must pass)

```bash
./scripts/verify-frontend-deploy.sh https://layalibeauty.shop e7da223
```

Or manually:

1. `curl -sS https://layalibeauty.shop/api/build-info` → **`commitSha`** must start with **`e7da223`** (not `8477f88`).
2. Open https://layalibeauty.shop/products/dubai-palace-oud-serum → Network tab → images must be **`.webp`** with **`merchant-stack-v7-webp`**, each **~35–67 KB** (not 1+ MB PNG).
3. Hero image URL must return **HTTP 200**, TTFB **under 2s** (nginx serves `/public` directly).

## Backend (same branch)

Point the **API** service at **`production-fix-v2`** too and rebuild with fresh `CACHE_BUST`.  
`curl -sS https://api.layalibeauty.shop/version | jq .commit_sha` must not stay on **`5dddbfc`**.

See also: **`deploy/PRODUCTION_FIX_V2.md`**
