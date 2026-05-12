# Next.js storefront — build must receive NEXT_PUBLIC_* as build-args (inlined at `next build`).
# EasyPanel: set Build args (or Dockerfile ARG defaults below), then **Rebuild** (not only Restart).

FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app

ARG NEXT_PUBLIC_API_BASE_URL=https://api.layalibeauty.shop
ARG NEXT_PUBLIC_ORDER_USE_SAME_ORIGIN_PROXY=false

ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_ORDER_USE_SAME_ORIGIN_PROXY=$NEXT_PUBLIC_ORDER_USE_SAME_ORIGIN_PROXY

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN echo "next_build_env NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL" && \
    echo "next_build_env NEXT_PUBLIC_ORDER_USE_SAME_ORIGIN_PROXY=$NEXT_PUBLIC_ORDER_USE_SAME_ORIGIN_PROXY"

RUN npm run build && \
    echo "next_build_finished_ok" && \
    ls -la .next | head -20

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

ARG NEXT_PUBLIC_API_BASE_URL=https://api.layalibeauty.shop
ARG NEXT_PUBLIC_ORDER_USE_SAME_ORIGIN_PROXY=false

ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_ORDER_USE_SAME_ORIGIN_PROXY=$NEXT_PUBLIC_ORDER_USE_SAME_ORIGIN_PROXY

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts

EXPOSE 3000

CMD ["sh", "-c", "echo \"next_start PORT=${PORT:-3000}\" && exec npm run start"]
