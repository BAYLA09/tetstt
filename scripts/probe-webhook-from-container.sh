#!/usr/bin/env bash
# Run inside the API container: confirm GOOGLE_SHEETS_WEBHOOK_URL is set and POST succeeds.
# Usage: ./scripts/probe-webhook-from-container.sh <container_name_or_id>
set -euo pipefail

CID="${1:?container name or id}"

docker exec "${CID}" python - <<'PY'
import os
import httpx

url = (os.environ.get("GOOGLE_SHEETS_WEBHOOK_URL") or os.environ.get("SHEET_WEBHOOK_URL") or "").strip()
print("GOOGLE_SHEETS_WEBHOOK_URL set:", bool(url))
if not url:
    raise SystemExit("No webhook URL in container env — fix EasyPanel runtime env and recreate container")

host = url.split("/")[2] if "/" in url else "?"
print("host:", host)

body = {
    "date": "01/01/2026",
    "orderid": "layali-container-probe",
    "country": "UAE",
    "name": "Container probe",
    "phone": "+971500000000",
    "product": "PROBE",
    "url": "https://layalibeauty.shop",
    "sku": "PROBE",
    "quantity": "1",
    "totalprice": 0,
    "currency": "AED",
    "status": "probe",
}
secret = (os.environ.get("SHEETS_WEBHOOK_SECRET") or os.environ.get("SHEET_WEBHOOK_SECRET") or "").strip()
if secret:
    body["secret"] = secret

with httpx.Client(timeout=20, follow_redirects=True) as client:
    r = client.post(url, json=body)
    print("HTTP", r.status_code)
    print("body_head:", (r.text or "")[:300])
PY
