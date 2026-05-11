#!/usr/bin/env sh
set -e
# EasyPanel / Railway / etc. inject PORT; always bind all interfaces in production.
HOST="${HOST:-0.0.0.0}"
PORT="${PORT:-8000}"
echo "Layali API: starting uvicorn on ${HOST}:${PORT}"
exec uvicorn app.main:app --host "$HOST" --port "$PORT"
