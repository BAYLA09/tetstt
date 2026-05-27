# Backend: force a completely fresh Docker build

Use this when EasyPanel shows “deploy success” but `GET /version` still reports an old `commit_sha` / `build_time_utc`, or webhook behavior changes only after **Restart** (env) but not **Rebuild** (image).

**No Apps Script steps here** — only container image, cache, env, and outbound HTTP.

---

## What went wrong on EasyPanel (typical)

| Symptom | Cause |
|--------|--------|
| `commit_sha` stuck on `8477f88`, `build_time_utc` stuck on May 12 | **Build args** `COMMIT_SHA` / `BUILD_TIME_UTC` not updated on rebuild, or panel only **Restarted** the old image |
| New `/version` fields appear but `commit_sha` is old | Image **code** updated; **baked** `DEPLOY_COMMIT_SHA` still from old build args |
| Webhook URL changed in panel but behavior unchanged until Rebuild | **Runtime env** updated on restart, but **Python process / image** still old until full rebuild |
| Deploy finishes in 0–2 seconds | **No `docker build`** — pull/restart of existing image |

`/version` reads `DEPLOY_COMMIT_SHA` from the **image ENV** (set at build from `COMMIT_SHA` build arg). Updating only runtime `COMMIT_SHA` in the panel does **not** fix `/version` if `DEPLOY_COMMIT_SHA` is already baked.

---

## EasyPanel: nuclear clean rebuild (do in order)

### 1. Stop serving traffic from the old container

- Scale service to **0** replicas, **or** disable the route temporarily, **or** rename the service after cutover (step 7).

### 2. Fix service build settings (backend API only)

| Setting | Value |
|---------|--------|
| Git branch | **`production-fix-v2`** (backend API on EasyPanel) — see `deploy/PRODUCTION_FIX_V2.md`. Use `main` for dev only. |
| Build context / root | **Repository root** (folder that contains root `Dockerfile` + `backend/`) |
| Dockerfile path | `Dockerfile` (root file — **not** `backend/Dockerfile` unless context is `backend/`) |

**Valid pairs:**

- **A (recommended):** context = repo root → Dockerfile = `Dockerfile` (copies `backend/`)
- **B:** context = `backend/` → Dockerfile = `Dockerfile` (file inside `backend/`)

### 3. Build arguments (change every forced rebuild)

Get current SHA from GitHub `main`, then set **Build arguments** (not only runtime env):

```bash
COMMIT_SHA=<full-or-short-sha-from-main>
BUILD_TIME_UTC=$(date -u +%Y-%m-%dT%H:%M:%SZ)
CACHE_BUST=forced-nocache-$(date +%s)
```

Example:

```
COMMIT_SHA=9a91289
BUILD_TIME_UTC=2026-05-27T20:00:00Z
CACHE_BUST=forced-nocache-1748380800
```

If the panel has **“No cache” / “Disable cache” / “Pull latest base images”**, enable all of them for this one build.

### 4. Runtime environment — refresh without stale overrides

Set / update (runtime **Environment**):

- `GOOGLE_SHEETS_WEBHOOK_URL` = your current Apps Script `/exec` URL (no leading space)
- `SHEETS_WEBHOOK_SECRET` = only if the script uses `LAYALI_WEBHOOK_SECRET`
- `DATABASE_URL`, `FRONTEND_URL`, etc.

**Remove or leave unset** on runtime (unless you know you need them):

- `COMMIT_SHA`, `GIT_SHA`, `GITHUB_SHA`, `DEPLOY_COMMIT_SHA`, `DEPLOY_BUILD_TIME_UTC`

Those belong in **build args** for a single source of truth. Duplicate runtime values confuse verification.

After changing env, you must **recreate** the container (rebuild or “replace” deployment), not only save env in the UI.

### 5. Rebuild and watch build logs (mandatory)

Trigger **Rebuild** (not **Restart**). A real build log must include:

```text
==== backend_docker_build_clock_utc=2026-05-27T...
DEPLOY_COMMIT_SHA=9a91289
CACHE_BUST=forced-nocache-...
```

Build should take **minutes** (pip install + copy), not seconds.

If logs do not show `backend_docker_build_clock_utc`, the panel did not run your Dockerfile.

### 6. Verify from your machine

```bash
./scripts/verify-backend-deploy.sh https://api.layalibeauty.shop <expected-commit-sha>
```

Pass = `commit_sha` matches, `build_time_utc` is recent, `sheet_webhook_configured` is true.

### 7. Verify image identity on the host (SSH to EasyPanel node)

If you have shell on the server:

```bash
# Running container ID
docker ps --filter "name=layali" --format '{{.ID}} {{.Image}} {{.CreatedAt}}'

# Image digest (immutable ID) — save and compare after next deploy
docker inspect <container_id> --format 'Image={{.Image}}'
docker image inspect <image_id> --format 'Id={{.Id}} Created={{.Created}}'

# Baked deploy metadata inside the running container
docker exec <container_id> sh -c 'echo DEPLOY_COMMIT_SHA=$DEPLOY_COMMIT_SHA; echo DEPLOY_BUILD_TIME_UTC=$DEPLOY_BUILD_TIME_UTC; echo CACHE=$DOCKER_CACHE_BUST'

# Startup line in logs
docker logs <container_id> 2>&1 | head -20
```

After a **fresh** rebuild, **Image Id** and **Created** must change. If they do not, the panel reused the same image.

### 8. Confirm webhook HTTP leaves the container

On the **same host** as the API container:

```bash
./scripts/probe-webhook-from-container.sh <container_name_or_id>
```

Or manually:

```bash
docker exec <container_id> python -c "
import os, httpx
url = os.environ.get('GOOGLE_SHEETS_WEBHOOK_URL') or os.environ.get('SHEET_WEBHOOK_URL')
print('url_set', bool(url))
if url:
    r = httpx.post(url, json={'orderid':'probe-from-container'}, timeout=15, follow_redirects=True)
    print('status', r.status_code, 'body', r.text[:200])
"
```

You should see `url_set True` and HTTP `200` with a JSON body. This proves **outbound** traffic from the running container, independent of the storefront.

---

## Local proof build (same Dockerfile as production)

On any machine with Docker, from **repository root**:

```bash
./scripts/build-backend-fresh.sh 9a91289
docker run --rm -p 8000:8000 \
  -e GOOGLE_SHEETS_WEBHOOK_URL='https://script.google.com/macros/s/.../exec' \
  layali-api:9a91289
curl -sS localhost:8000/version | jq .
```

Compare that image’s `/version` with production. If local is correct and production is not, the problem is **only** EasyPanel image selection/cache.

---

## If EasyPanel still reuses old images

1. **Delete** the old service (or change image name/tag in panel if supported).
2. Create a **new** app service pointing at the same repo/`main` with a **unique image name** (e.g. `layali-api-v2`).
3. Point `api.layalibeauty.shop` to the new service.
4. Or migrate to a host with explicit `docker build --no-cache` — see `docs/DEPLOY_HOSTING_MIGRATION.md`.

---

## Quick checklist

- [ ] Build logs show new `backend_docker_build_clock_utc` (today)
- [ ] `curl /version` → `commit_sha` matches GitHub `main`
- [ ] `docker inspect` → image **Created** time is today
- [ ] `docker exec` → `DEPLOY_COMMIT_SHA` matches build arg
- [ ] `docker exec` → webhook POST returns 200 from inside container
- [ ] Place test order → admin or API shows `sheet_sync_status` (not stuck on old behavior)
