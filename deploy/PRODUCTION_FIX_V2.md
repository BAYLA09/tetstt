# EasyPanel backend — deploy from `production-fix-v2`

This branch exists **only** to force a clean Git + Docker build on EasyPanel.  
**`main` is unchanged** — do not delete it. Point the **backend API** service at this branch.

## EasyPanel settings (backend API service)

| Field | Value |
|-------|--------|
| **Git branch** | `production-fix-v2` |
| **Build context** | Repository root (contains root `Dockerfile` + `backend/`) |
| **Dockerfile** | `Dockerfile` |

### Build arguments (set on every deploy)

```
COMMIT_SHA=<git sha on production-fix-v2 — see GitHub>
BUILD_TIME_UTC=<now UTC ISO8601>
CACHE_BUST=production-fix-v2-<unix-timestamp>
DEPLOY_BRANCH=production-fix-v2
```

Enable **no cache / disable build cache** if the panel offers it.

### Runtime environment

**Do not change** `DATABASE_URL`, secrets, or sheet URLs unless you already planned to.  
Only switch the **Git branch** and **rebuild**.

Remove stale runtime overrides (if present): `COMMIT_SHA`, `DEPLOY_COMMIT_SHA`, `GIT_SHA` — use build args instead.

## After rebuild

```bash
./scripts/verify-backend-deploy.sh https://api.layalibeauty.shop <commit-on-production-fix-v2>
```

On the server:

```bash
./scripts/probe-webhook-from-container.sh <api-container-id>
```

`GET /version` must show `commit_sha` matching this branch’s HEAD, not `8477f88`.

## When stable

You may point EasyPanel back to `main` later, or keep deploying from `production-fix-v2` and merge `main` into it periodically.
