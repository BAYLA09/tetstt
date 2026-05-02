# Layali Beauty Backend

FastAPI COD order API with Postgres persistence, sheet webhook dispatch, and env-gated CAPI logging.

## Run locally

```sh
python -m venv .venv
. .venv/bin/activate
pip install -e ".[dev]"
DATABASE_URL=sqlite+aiosqlite:///./local.db alembic upgrade head
DATABASE_URL=sqlite+aiosqlite:///./local.db uvicorn app.main:app --reload
```
