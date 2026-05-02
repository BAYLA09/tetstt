from collections import defaultdict, deque
from time import time
from fastapi import HTTPException, Request
from app.config import get_settings

_hits: dict[str, deque[float]] = defaultdict(deque)

def enforce_order_rate_limit(request: Request) -> None:
    limit = get_settings().order_rate_limit_per_minute
    if limit <= 0:
        return
    ip = request.client.host if request.client else "unknown"
    now = time()
    window = _hits[ip]
    while window and now - window[0] > 60:
        window.popleft()
    if len(window) >= limit:
        raise HTTPException(status_code=429, detail="Too many order attempts")
    window.append(now)
