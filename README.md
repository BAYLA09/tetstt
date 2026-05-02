# Layali Beauty Backend

FastAPI COD order backend for `api.layalibeauty.shop`.

## Local run

```sh
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

For local testing without Postgres, set:

```text
DATABASE_URL=sqlite+aiosqlite:///./layali.db
```
