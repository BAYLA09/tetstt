FROM python:3.12-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN chmod +x /app/start.sh

ENV HOST=0.0.0.0 \
    PORT=8000

EXPOSE 8000

# Schema is created by FastAPI startup (`init_db` / create_all) with retries.
CMD ["/app/start.sh"]
