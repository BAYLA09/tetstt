# Fastest migration off EasyPanel (no app code changes)

Same repo, same Dockerfiles. Only hosting / deploy mechanics change.

**Goal:** immutable image tags, `docker build --no-cache`, env applied on container **create**, and a deploy fingerprint you can trust (`/version` + image digest).

---

## Recommendation (fastest → most control)

| Option | Time to migrate | Clean rebuild | Outbound webhooks | Notes |
|--------|-----------------|---------------|-------------------|--------|
| **Railway** | ~30–60 min | Good (Git deploy, clear build logs) | Works | GitHub → Dockerfile at repo root; env in dashboard; easy rollbacks |
| **Render** | ~30–60 min | Good | Works | Web Service + Docker; “Clear build cache” in UI |
| **Fly.io** | ~45–90 min | Excellent (`--no-cache` in CI) | Works | `fly deploy`; global regions; slightly more CLI |
| **Coolify** (VPS) | ~1–2 h | Excellent (you control Docker) | Works | Self-hosted PaaS; like EasyPanel but you own `docker build` |
| **VPS + Docker Compose** | ~1–2 h | **Best** | Works | Full control; use `deploy/docker-compose.backend.yml` in this repo |
| **EasyPanel (stay)** | 0 | **Unreliable** | Works | Only if nuclear rebuild checklist fixes digest + `/version` |

**Practical pick for Layali COD store today**

1. **Railway** or **Render** if you want managed + minimal ops (fastest escape from cache ghosts).
2. **Hetzner + Coolify** or **raw VPS + Compose** if you already have a VPS and want guaranteed `--no-cache` forever.

---

## Railway (fastest managed)

1. New project → **Deploy from GitHub** → repo `main`.
2. Set **Root directory** = repository root (where `Dockerfile` is).
3. **Dockerfile path** = `Dockerfile`.
4. **Build command / args** (if UI supports Docker build args):

   ```
   COMMIT_SHA=$RAILWAY_GIT_COMMIT_SHA
   BUILD_TIME_UTC=<auto>
   CACHE_BUST=$RAILWAY_DEPLOYMENT_ID
   ```

5. **Variables** (runtime): `DATABASE_URL`, `GOOGLE_SHEETS_WEBHOOK_URL`, `SHEETS_WEBHOOK_SECRET`, `FRONTEND_URL`, etc.
6. Custom domain: `api.layalibeauty.shop` → CNAME to Railway.
7. Verify: `./scripts/verify-backend-deploy.sh https://api.layalibeauty.shop $RAILWAY_GIT_COMMIT_SHA`

**Do not** set runtime `COMMIT_SHA` unless you also bake it at build — use Railway’s commit for build args only.

---

## Render

1. **New Web Service** → Docker → connect repo.
2. **Root directory:** repo root; **Dockerfile:** `Dockerfile`.
3. Enable **Clear build cache & deploy** on the first migration deploy.
4. Env vars in **Environment** tab; redeploy after changes.
5. Health check path: `/ping`.

---

## Fly.io

```bash
# once: fly launch --no-deploy  (pick region, app name)
# set secrets:
fly secrets set DATABASE_URL=... GOOGLE_SHEETS_WEBHOOK_URL=...
# deploy with fresh build:
fly deploy --no-cache
fly logs
curl https://<app>.fly.dev/version
```

Use `fly.toml` with `[build] dockerfile = "Dockerfile"` at repo root.

---

## VPS + Docker Compose (maximum certainty)

On the server, from a fresh clone of `main`:

```bash
export COMMIT_SHA=$(git rev-parse HEAD)
export BUILD_TIME_UTC=$(date -u +%Y-%m-%dT%H:%M:%SZ)
export CACHE_BUST=$(date +%s)
docker compose -f deploy/docker-compose.backend.yml build --no-cache --pull
docker compose -f deploy/docker-compose.backend.yml up -d --force-recreate
./scripts/verify-backend-deploy.sh https://api.layalibeauty.shop "$COMMIT_SHA"
```

Image tag is `layali-api:${COMMIT_SHA}` — no anonymous `:latest` drift.

---

## Cutover checklist (any host)

1. Build fresh image with new `CACHE_BUST`.
2. Point DNS / reverse proxy to new service.
3. `curl /version` — `commit_sha` + recent `build_time_utc`.
4. `docker exec` webhook probe script.
5. One test order; confirm `sheet_sync_status` in admin.
6. Decommission old EasyPanel service to avoid split-brain.

---

## What you do **not** need to change

- FastAPI application code
- Postgres schema (same `DATABASE_URL`)
- Apps Script or sheet layout
- Storefront (only `NEXT_PUBLIC_API_URL` if API hostname changes)
