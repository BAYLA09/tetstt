FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --prefer-offline

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Build args become NEXT_PUBLIC_ env vars at build time
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_ENABLE_PIXELS
ARG NEXT_PUBLIC_META_PIXEL_ID
ARG NEXT_PUBLIC_TIKTOK_PIXEL_ID
ARG NEXT_PUBLIC_SNAP_PIXEL_ID
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL \
    NEXT_PUBLIC_ENABLE_PIXELS=$NEXT_PUBLIC_ENABLE_PIXELS \
    NEXT_PUBLIC_META_PIXEL_ID=$NEXT_PUBLIC_META_PIXEL_ID \
    NEXT_PUBLIC_TIKTOK_PIXEL_ID=$NEXT_PUBLIC_TIKTOK_PIXEL_ID \
    NEXT_PUBLIC_SNAP_PIXEL_ID=$NEXT_PUBLIC_SNAP_PIXEL_ID
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
ENV PORT=3000 HOSTNAME=0.0.0.0
CMD ["node", "server.js"]
