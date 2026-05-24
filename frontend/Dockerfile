# Next.js storefront — NEXT_PUBLIC_* must exist at `next build` (Docker build-args + .env.production).
# EasyPanel: **Rebuild** the image; a 0–2s "deploy" usually skips `docker build` or reuses a cached image.
#
# Build context:
# - **Context = this folder (`frontend/`)** → leave `FRONTEND_SOURCE_DIR` unset (default `.`).
# - **Context = repo root** (`…/code/` with `-f …/frontend/Dockerfile`) → set build-arg **`FRONTEND_SOURCE_DIR=frontend`**
#   or use **`Dockerfile.frontend`** at repo root instead.

FROM node:20-alpine AS deps
ARG FRONTEND_SOURCE_DIR=.
WORKDIR /app
COPY ${FRONTEND_SOURCE_DIR}/package.json ${FRONTEND_SOURCE_DIR}/package-lock.json ./
RUN echo "deps FRONTEND_SOURCE_DIR=${FRONTEND_SOURCE_DIR}" && npm ci

FROM node:20-alpine AS builder
WORKDIR /app

ARG FRONTEND_SOURCE_DIR=.
ARG CACHE_BUST=manual
ARG COMMIT_SHA=unknown
ARG BUILD_TIME_UTC=
ARG NEXT_PUBLIC_API_BASE_URL=https://api.layalibeauty.shop
ARG NEXT_PUBLIC_ORDER_USE_SAME_ORIGIN_PROXY=false
ARG NEXT_PUBLIC_GIT_COMMIT=
ARG NEXT_PUBLIC_APP_BUILD_MARKER=layalibeauty-storefront
ARG NEXT_PUBLIC_ENABLE_PIXELS=true
ARG NEXT_PUBLIC_SNAP_PIXEL_ID=62ce5297-74a9-4a82-a2fb-eb3e4dbfb23b

ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_ORDER_USE_SAME_ORIGIN_PROXY=$NEXT_PUBLIC_ORDER_USE_SAME_ORIGIN_PROXY
ENV NEXT_PUBLIC_APP_BUILD_MARKER=$NEXT_PUBLIC_APP_BUILD_MARKER
ENV NEXT_PUBLIC_DOCKER_CACHE_BUST=$CACHE_BUST
ENV NEXT_PUBLIC_ENABLE_PIXELS=$NEXT_PUBLIC_ENABLE_PIXELS
ENV NEXT_PUBLIC_SNAP_PIXEL_ID=$NEXT_PUBLIC_SNAP_PIXEL_ID

COPY --from=deps /app/node_modules ./node_modules
COPY ${FRONTEND_SOURCE_DIR}/ .

# Build-time clock + proof EasyPanel ran `docker build` (see panel build logs).
RUN echo "==== docker_build_clock_utc=$(date -u +%Y-%m-%dT%H:%M:%SZ) ====" && \
    echo "builder FRONTEND_SOURCE_DIR=${FRONTEND_SOURCE_DIR}" && \
    echo "CACHE_BUST=${CACHE_BUST}" && \
    echo "COMMIT_SHA_ARG=${COMMIT_SHA}" && \
    echo "BUILD_TIME_UTC_ARG=${BUILD_TIME_UTC}" && \
    echo "NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}" && \
    echo "NEXT_PUBLIC_ORDER_USE_SAME_ORIGIN_PROXY=${NEXT_PUBLIC_ORDER_USE_SAME_ORIGIN_PROXY}" && \
    echo "NEXT_PUBLIC_ENABLE_PIXELS=${NEXT_PUBLIC_ENABLE_PIXELS}" && \
    echo "NEXT_PUBLIC_SNAP_PIXEL_ID=${NEXT_PUBLIC_SNAP_PIXEL_ID}" && \
    echo "NEXT_PUBLIC_GIT_COMMIT_ARG=${NEXT_PUBLIC_GIT_COMMIT}"

# Bake commit + build time into .env.production for `next build` (NEXT_PUBLIC_*).
RUN set -e; \
    CMT="${NEXT_PUBLIC_GIT_COMMIT}"; \
    if [ -z "$CMT" ] || [ "$CMT" = "unknown" ]; then CMT="${COMMIT_SHA}"; fi; \
    echo "NEXT_PUBLIC_GIT_COMMIT=${CMT}" >> .env.production; \
    echo "NEXT_PUBLIC_COMMIT_SHA=${CMT}" >> .env.production; \
    BT="${BUILD_TIME_UTC}"; \
    if [ -z "$BT" ]; then BT=$(date -u +%Y-%m-%dT%H:%M:%SZ); fi; \
    echo "NEXT_PUBLIC_BUILD_TIME=${BT}" >> .env.production; \
    echo "NEXT_PUBLIC_ENABLE_PIXELS=${NEXT_PUBLIC_ENABLE_PIXELS}" >> .env.production; \
    echo "NEXT_PUBLIC_SNAP_PIXEL_ID=${NEXT_PUBLIC_SNAP_PIXEL_ID}" >> .env.production; \
    echo "next_wrote_build_identity commit=${CMT} time=${BT}"

RUN echo "next_build_env NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL" && \
    echo "next_build_env NEXT_PUBLIC_ORDER_USE_SAME_ORIGIN_PROXY=$NEXT_PUBLIC_ORDER_USE_SAME_ORIGIN_PROXY" && \
    echo "next_build_env NEXT_PUBLIC_ENABLE_PIXELS=$NEXT_PUBLIC_ENABLE_PIXELS" && \
    echo "next_build_env NEXT_PUBLIC_SNAP_PIXEL_ID=$NEXT_PUBLIC_SNAP_PIXEL_ID"

RUN npm run build && \
    echo "next_build_finished_ok" && \
    ls -la .next | head -25

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts

EXPOSE 3000

# Bind 0.0.0.0 here so EasyPanel/reverse-proxy health checks work even if an old
# image had `next start` without -H in package.json or the panel overrides npm scripts.
CMD ["sh", "-c", "echo \"next_start bind=0.0.0.0 PORT=${PORT:-3000}\" && exec ./node_modules/.bin/next start -H 0.0.0.0 -p ${PORT:-3000}"]
