FROM python:3.12-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

# Echo helps Easypanel/Docker logs show whether we reached uvicorn (vs crashing earlier).
CMD ["sh", "-c", "echo 'Layali API: starting uvicorn on :8000' && exec uvicorn app.main:app --host 0.0.0.0 --port 8000"]
