#!/usr/bin/env bash
# Verify production (or staging) API deploy fingerprint.
# Usage: ./scripts/verify-backend-deploy.sh <base_url> [expected_commit_sha_prefix]
set -euo pipefail

BASE="${1:?base URL e.g. https://api.layalibeauty.shop}"
EXPECTED="${2:-}"

BASE="${BASE%/}"
URL="${BASE}/version"

echo "GET ${URL}"
JSON="$(curl -fsS "${URL}")"
echo "${JSON}" | python3 -m json.tool

COMMIT="$(echo "${JSON}" | python3 -c "import sys,json; print(json.load(sys.stdin).get('commit_sha',''))")"
BUILD="$(echo "${JSON}" | python3 -c "import sys,json; print(json.load(sys.stdin).get('build_time_utc',''))")"
CONFIGURED="$(echo "${JSON}" | python3 -c "import sys,json; print(json.load(sys.stdin).get('sheet_webhook_configured', False))")"

FAIL=0

if [[ -n "${EXPECTED}" ]] && [[ "${COMMIT}" != "${EXPECTED}"* ]] && [[ "${COMMIT}" != *"${EXPECTED}"* ]]; then
  echo "FAIL: commit_sha=${COMMIT} does not match expected prefix ${EXPECTED}"
  FAIL=1
else
  echo "OK: commit_sha=${COMMIT}"
fi

if [[ "${BUILD}" == unknown ]] || [[ "${BUILD}" == 2026-05-12T12:00:00Z ]]; then
  echo "WARN: build_time_utc looks stale (${BUILD}) — likely no real rebuild"
  FAIL=1
else
  echo "OK: build_time_utc=${BUILD}"
fi

if [[ "${CONFIGURED}" != "True" ]]; then
  echo "WARN: sheet_webhook_configured is not true"
  FAIL=1
else
  echo "OK: sheet_webhook_configured=true"
fi

exit "${FAIL}"
