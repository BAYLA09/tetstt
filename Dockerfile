FROM python:3.12-slim

WORKDIR /app

ARG COMMIT_SHA=unknown
ARG BUILD_TIME_UTC=unknown
ARG CACHE_BUST=manual

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DEPLOY_COMMIT_SHA=${COMMIT_SHA} \
    DEPLOY_BUILD_TIME_UTC=${BUILD_TIME_UTC} \
    DOCKER_CACHE_BUST=${CACHE_BUST}

RUN echo "==== backend_docker_build_clock_utc=$(date -u +%Y-%m-%dT%H:%M:%SZ) ====" && \
    echo "DEPLOY_COMMIT_SHA=${COMMIT_SHA}" && \
    echo "DEPLOY_BUILD_TIME_UTC=${BUILD_TIME_UTC}" && \
    echo "CACHE_BUST=${CACHE_BUST}"

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .

ENV PORT=8000
EXPOSE 8000

CMD ["sh", "-c", "echo \"api_start DEPLOY_COMMIT_SHA=${DEPLOY_COMMIT_SHA} DEPLOY_BUILD_TIME_UTC=${DEPLOY_BUILD_TIME_UTC}\" && exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000} --proxy-headers --forwarded-allow-ips='*'"]
