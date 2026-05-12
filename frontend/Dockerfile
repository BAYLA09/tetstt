# Next.js storefront — NEXT_PUBLIC_* must exist at `next build` (Docker build-args + .env.production).
# EasyPanel: **Rebuild** the image; a 1–2s "deploy" usually skips `docker build`.

FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app

ARG CACHE_BUST=manual
ARG NEXT_PUBLIC_API_BASE_URL=https://api.layalibeauty.shop
ARG NEXT_PUBLIC_ORDER_USE_SAME_ORIGIN_PROXY=false
ARG NEXT_PUBLIC_GIT_COMMIT=unknown
ARG NEXT_PUBLIC_APP_BUILD_MARKER=layalibeauty-storefront

ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_ORDER_USE_SAME_ORIGIN_PROXY=$NEXT_PUBLIC_ORDER_USE_SAME_ORIGIN_PROXY
ENV NEXT_PUBLIC_GIT_COMMIT=$NEXT_PUBLIC_GIT_COMMIT
ENV NEXT_PUBLIC_APP_BUILD_MARKER=$NEXT_PUBLIC_APP_BUILD_MARKER
ENV NEXT_PUBLIC_DOCKER_CACHE_BUST=$CACHE_BUST

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time clock + proof EasyPanel ran `docker build` (see panel build logs).
RUN echo "==== docker_build_clock_utc=$(date -u +%Y-%m-%dT%H:%M:%SZ) ====" && \
    echo "CACHE_BUST=${CACHE_BUST}" && \
    echo "NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}" && \
    echo "NEXT_PUBLIC_ORDER_USE_SAME_ORIGIN_PROXY=${NEXT_PUBLIC_ORDER_USE_SAME_ORIGIN_PROXY}" && \
    echo "NEXT_PUBLIC_GIT_COMMIT=${NEXT_PUBLIC_GIT_COMMIT}" && \
    echo "NEXT_PUBLIC_APP_BUILD_MARKER=${NEXT_PUBLIC_APP_BUILD_MARKER}"

# Next reads .env.production during `next build` (dynamic build clock).
RUN BT=$(date -u +%Y-%m-%dT%H:%M:%SZ) && \
    echo "NEXT_PUBLIC_BUILD_TIME=${BT}" >> .env.production && \
    echo "next_wrote_NEXT_PUBLIC_BUILD_TIME=${BT}"

RUN echo "next_build_env NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL" && \
    echo "next_build_env NEXT_PUBLIC_ORDER_USE_SAME_ORIGIN_PROXY=$NEXT_PUBLIC_ORDER_USE_SAME_ORIGIN_PROXY"

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

CMD ["sh", "-c", "echo \"next_start PORT=${PORT:-3000}\" && exec npm run start"]
