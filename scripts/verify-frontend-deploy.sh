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
  echo "      → EasyPanel frontend was NOT rebuilt from production-fix-v2. See deploy/PRODUCTION_FIX_V2_FRONTEND.md"
  FAIL=1
else
  echo "OK: commitSha=${COMMIT}"
fi

if [[ "${COMMIT}" == 8477f88* ]] || [[ "${BUILD}" == 2026-05-12T12:00:00Z ]]; then
  echo "FAIL: storefront still on stale May 2026 image (8477f88 / manual-pr14-2)"
  FAIL=1
fi

if [[ "${CACHE_BUST}" == manual-pr14-2 ]] || [[ "${CACHE_BUST}" == manual ]]; then
  echo "WARN: cacheBust=${CACHE_BUST} — bump CACHE_BUST build arg and Rebuild"
  FAIL=1
fi

echo "GET ${PDP_URL} (checking WebP assets)"
HTML="$(curl -fsS "${PDP_URL}")"

if echo "${HTML}" | grep -q 'merchant-stack-v7-webp'; then
  echo "OK: PDP references merchant-stack-v7-webp"
else
  echo "FAIL: PDP still serves old PNG stack (merchant-stack-v6 or older)"
  FAIL=1
fi

if echo "${HTML}" | grep -q '\.webp'; then
  echo "OK: PDP HTML includes .webp image URLs"
else
  echo "FAIL: no .webp URLs in PDP HTML"
  FAIL=1
fi

WEBP_URL="${BASE}/products/adskull-image-3b76093b-906d-4b09-aacb-43ddddbf92e1.webp?v=merchant-stack-v7-webp"
echo "HEAD ${WEBP_URL}"
WEBP_META="$(curl -fsSI "${WEBP_URL}" | tr -d '\r')"
WEBP_CODE="$(echo "${WEBP_META}" | awk '/^HTTP/{print $2}')"
WEBP_LEN="$(echo "${WEBP_META}" | awk 'tolower($1)=="content-length:"{print $2}')"

if [[ "${WEBP_CODE}" != "200" ]]; then
  echo "FAIL: hero WebP HTTP ${WEBP_CODE} (expected 200)"
  FAIL=1
else
  echo "OK: hero WebP HTTP 200 size=${WEBP_LEN:-unknown} bytes"
  if [[ -n "${WEBP_LEN}" ]] && [[ "${WEBP_LEN}" -gt 200000 ]]; then
    echo "WARN: hero WebP still large (${WEBP_LEN} bytes) — expected ~68206"
    FAIL=1
  fi
fi

exit "${FAIL}"
