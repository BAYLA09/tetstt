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

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Fail build if lamp tier SKUs are missing (wrong context / stale tree copied into the image).
RUN test -f app/products.py \
  && grep -qF "LB-LAMP-OUD-379" app/products.py \
  && grep -qF "LB-LAMP-TRIPLE-449" app/products.py \
  && python -c "from decimal import Decimal; from app.products import PRODUCTS; assert PRODUCTS['LB-LAMP-OUD-379']['price']==Decimal('379') and PRODUCTS['LB-LAMP-TRIPLE-449']['price']==Decimal('449')"

ENV PORT=8000
EXPOSE 8000

CMD ["sh", "-c", "echo \"api_start DEPLOY_COMMIT_SHA=${DEPLOY_COMMIT_SHA} DEPLOY_BUILD_TIME_UTC=${DEPLOY_BUILD_TIME_UTC}\" && exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000} --proxy-headers --forwarded-allow-ips='*'"]
