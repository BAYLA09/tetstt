#!/usr/bin/env bash
# Build backend API image with zero cache — same root Dockerfile as EasyPanel production.
# Usage: ./scripts/build-backend-fresh.sh [COMMIT_SHA]
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

COMMIT_SHA="${1:-$(git rev-parse --short HEAD 2>/dev/null || echo unknown)}"
BUILD_TIME_UTC="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
CACHE_BUST="${CACHE_BUST:-production-fix-v2-$(date +%s)}"
DEPLOY_BRANCH="${DEPLOY_BRANCH:-production-fix-v2}"
IMAGE_TAG="layali-api:${COMMIT_SHA}"

echo "Building ${IMAGE_TAG} (no cache)"
echo "  COMMIT_SHA=${COMMIT_SHA}"
echo "  BUILD_TIME_UTC=${BUILD_TIME_UTC}"
echo "  CACHE_BUST=${CACHE_BUST}"

docker build --no-cache --pull \
  -f Dockerfile \
  --build-arg "COMMIT_SHA=${COMMIT_SHA}" \
  --build-arg "BUILD_TIME_UTC=${BUILD_TIME_UTC}" \
  --build-arg "CACHE_BUST=${CACHE_BUST}" \
  --build-arg "DEPLOY_BRANCH=${DEPLOY_BRANCH}" \
  -t "${IMAGE_TAG}" \
  .

echo ""
echo "Image ID:"
docker image inspect "${IMAGE_TAG}" --format '  Id={{.Id}}'
docker image inspect "${IMAGE_TAG}" --format '  Created={{.Created}}'
echo ""
echo "Run locally:"
echo "  docker run --rm -p 8000:8000 -e GOOGLE_SHEETS_WEBHOOK_URL='...' ${IMAGE_TAG}"
