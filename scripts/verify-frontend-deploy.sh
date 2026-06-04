#!/usr/bin/env bash
# Verify production storefront deploy fingerprint and perf assets.
# Usage: ./scripts/verify-frontend-deploy.sh <base_url> [expected_commit_sha_prefix]
set -euo pipefail

BASE="${1:?base URL e.g. https://layalibeauty.shop}"
EXPECTED="${2:-}"

BASE="${BASE%/}"
BUILD_INFO_URL="${BASE}/api/build-info"
PDP_URL="${BASE}/products/dubai-palace-oud-serum"

echo "GET ${BUILD_INFO_URL}"
JSON="$(curl -fsS "${BUILD_INFO_URL}")"
echo "${JSON}" | python3 -m json.tool

COMMIT="$(echo "${JSON}" | python3 -c "import sys,json; print(json.load(sys.stdin).get('commitSha',''))")"
BUILD="$(echo "${JSON}" | python3 -c "import sys,json; print(json.load(sys.stdin).get('buildTime',''))")"
CACHE_BUST="$(echo "${JSON}" | python3 -c "import sys,json; print(json.load(sys.stdin).get('cacheBust',''))")"

FAIL=0

if [[ -n "${EXPECTED}" ]] && [[ "${COMMIT}" != "${EXPECTED}"* ]] && [[ "${COMMIT}" != *"${EXPECTED}"* ]]; then
  echo "FAIL: commitSha=${COMMIT} does not match expected prefix ${EXPECTED}"
  echo "      → EasyPanel Rebuild from branch main. See deploy/EASYPANEL_DEPLOY_NOW.txt"
  FAIL=1
else
  echo "OK: commitSha=${COMMIT}"
fi

if [[ "${COMMIT}" == 8477f88* ]] || [[ "${BUILD}" == 2026-05-12T12:00:00Z ]]; then
  echo "FAIL: storefront still on stale May 2026 image (8477f88)"
  echo "      → EasyPanel Rebuild from branch main, commit 13659cf. See deploy/EASYPANEL_DEPLOY_NOW.txt"
  FAIL=1
fi

if [[ "${CACHE_BUST}" == manual-pr14-2 ]] || [[ "${CACHE_BUST}" == manual ]]; then
  echo "WARN: cacheBust=${CACHE_BUST} — bump CACHE_BUST build arg and Rebuild"
  FAIL=1
fi

echo "GET ${PDP_URL} (checking WebP assets)"
HTML="$(curl -fsS "${PDP_URL}")"

if echo "${HTML}" | grep -q 'merchant-stack-v8-cdn\|cdn.jsdelivr.net'; then
  echo "OK: PDP uses jsDelivr WebP (merchant-stack-v8-cdn)"
elif echo "${HTML}" | grep -q 'merchant-stack-v7-webp'; then
  echo "OK: PDP uses local WebP (merchant-stack-v7-webp)"
else
  echo "FAIL: PDP still serves old PNG stack (merchant-stack-v6 or older)"
  FAIL=1
fi

if echo "${HTML}" | grep -q '\.webp\|jsdelivr'; then
  echo "OK: PDP HTML includes optimized image URLs"
else
  echo "FAIL: no .webp or jsdelivr URLs in PDP HTML"
  FAIL=1
fi

WEBP_URL="https://cdn.jsdelivr.net/gh/BAYLA09/tetstt@main/frontend/public/products/adskull-image-3b76093b-906d-4b09-aacb-43ddddbf92e1.webp"
echo "HEAD ${WEBP_URL}"
WEBP_META="$(curl -fsSI "${WEBP_URL}" | tr -d '\r')"
WEBP_CODE="$(echo "${WEBP_META}" | awk '/^HTTP/{print $2}')"
WEBP_LEN="$(echo "${WEBP_META}" | awk 'tolower($1)=="content-length:"{print $2}')"

if [[ "${WEBP_CODE}" != "200" ]]; then
  echo "WARN: jsDelivr hero WebP HTTP ${WEBP_CODE}"
else
  echo "OK: jsDelivr hero WebP HTTP 200 size=${WEBP_LEN:-unknown} bytes"
fi

# Legacy PNG check (live before deploy)
if echo "${HTML}" | grep -q 'merchant-stack-v6'; then
  echo "WARN: HTML still references merchant-stack-v6 — rebuild not deployed yet"
fi

exit "${FAIL}"
