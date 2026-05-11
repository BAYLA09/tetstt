FROM python:3.12-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

# Do NOT chain `alembic upgrade head` here: if Postgres is not ready yet or the DB URL
# is wrong, the container exits before uvicorn starts → Easypanel stays RED with ~0% CPU.
# Schema is created by FastAPI startup (`init_db` / create_all) with retries.
CMD ["sh", "-c", "echo 'Layali API: starting uvicorn on :8000' && exec uvicorn app.main:app --host 0.0.0.0 --port 8000"]
