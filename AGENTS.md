# AGENTS.md

## Cursor Cloud specific instructions

### Architecture

Two services — **Backend** (FastAPI/Python 3.12) on port 8000 and **Frontend** (Next.js 16/React 19) on port 3000. No docker-compose or Makefile; services are run individually.

### Running services

**Backend:**
```sh
cd /workspace/backend
. .venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend:**
```sh
cd /workspace/frontend
npm run dev
```

### Important caveats

- The backend uses SQLite locally (no Postgres needed). The `.env` must set `DATABASE_URL=sqlite+aiosqlite:///./layali_dev.db`. Tables are auto-created on startup.
- The `.env.example` contains `MAXMIND_API_BASE_URL` which is **not** a valid config field — the Settings model uses `maxmind_api_url`. Remove `MAXMIND_API_BASE_URL` from `.env` or the app will fail with `Extra inputs are not permitted`.
- Disable external integrations locally: set `ENABLE_IP_FRAUD_CHECK=false`, `ENABLE_CAPT=false`, `ENABLE_META_CAPT=false`, `ENABLE_TIKTOK_CAPT=false`, `ENABLE_SNAP_CAPT=false`.
- Frontend `.env.local` should point `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000` and `NEXT_PUBLIC_ENABLE_PIXELS=false`.

### Lint and test commands

| Service | Lint | Test |
|---------|------|------|
| Backend | `cd backend && . .venv/bin/activate && ruff check .` | `cd backend && . .venv/bin/activate && pytest` (no tests exist yet) |
| Frontend | `cd frontend && npx eslint .` | N/A (no test framework configured) |
| Frontend build | `cd frontend && npm run build` | — |

### Known issue

Backend has a pre-existing lint error (`F821: Undefined name UpsellResponse` in `app/routers/orders.py:156`). This is in existing code and should not block development.
