# Fix site speed WITHOUT EasyPanel deploy

EasyPanel ma kay-deploy-ach l’frontend (live baqi 3la commit **`8477f88`** May 2026).  
Hna 2 solutions — **A** is fastest (5 min f Cloudflare), **B** is permanent (Vercel).

---

## A) Cloudflare Worker — 5 minutes (RECOMMENDED)

Domain **`layalibeauty.shop`** deja 3la Cloudflare (`cf-ray` f headers).  
Ma khassak **EasyPanel rebuild**.

### Steps

1. Login [Cloudflare Dashboard](https://dash.cloudflare.com) → domain **layalibeauty.shop**
2. **Workers & Pages** → **Create** → **Create Worker**
3. Copy-paste **kol** `deploy/cloudflare-worker-fast-images.js` → **Save and deploy**
4. **Settings** → **Triggers** → **Add route**:
   - **`layalibeauty.shop/*`** (wa7ed route — HTML + images + ads)
5. (Optional) **Triggers** → **Cron** → `*/5 * * * *` — keeps PDP cache warm
6. **Caching** → **Configuration** → **Purge Everything** (once)

### Verify

Open DevTools → Network on https://layalibeauty.shop/products/dubai-palace-oud-serum  
Images: **Type = webp**, **Size ~35–67 KB**, header **`X-Layali-Image-Source: github-webp`**

---

## B) Vercel — auto-deploy mn GitHub (permanent)

Ma t7taj EasyPanel l frontend.

1. [vercel.com/new](https://vercel.com/new) → Import **`BAYLA09/tetstt`**
2. **Root Directory** = `frontend`
3. **Environment**: `NEXT_PUBLIC_API_BASE_URL=https://api.layalibeauty.shop`
4. Deploy → copy Vercel URL → test speed
5. Cloudflare DNS: **CNAME** `@` or `www` → `cname.vercel-dns.com` (Vercel gives exact record)

GitHub Actions (optional): add secrets `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` — workflow `.github/workflows/deploy-frontend-vercel.yml` deploys on every push to `main`.

---

## C) EasyPanel replica bug (~50% requests 20s)

Tests show **alternating** ~0.5s and ~20s TTFB → 2 containers, wa7ed mrid.

F EasyPanel (minimal):
- Frontend service → **Replicas = 1**
- **Restart** all containers
- Or **Delete** old deployment w redéploy wa7ed container

---

## D) Merge branches (auto Git pull)

Frontend EasyPanel kay-follow **`main`** or **`deploy-frontend-livefix`**, machi `production-fix-v2`.

Perf fixes merged to: **`main`**, **`deploy-frontend`**, **`deploy-frontend-livefix`**, **`deploy-frontend-v2`**.

Ila EasyPanel connected l Git, push triggers rebuild automatically.

Verify:
```bash
./scripts/verify-frontend-deploy.sh https://layalibeauty.shop
```

---

## Root cause summary

| Problem | Cause |
|---------|--------|
| Old code live | EasyPanel ma rebuild-ach; branch mismatch |
| 1–2 MB PNGs | May 2026 image stack |
| ~20s half the time | 2 origin replicas, 1 broken/slow |
| `no-store` cache | Old `next.config.ts` on live |

Code fixes are on **`main`** + **`production-fix-v2`**. Worker (A) fixes images **today** without Docker.
