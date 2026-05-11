from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import logging

from app.config import settings
from app.db import init_db
from app.routers import health, orders

log = logging.getLogger(__name__)

app = FastAPI(title=settings.app_name, version="0.1.0")

origins = settings.allowed_origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root() -> dict[str, str]:
    """Many load balancers / panels probe `/` — keep green without hitting DB."""
    return {"status": "ok", "service": settings.app_name}


@app.on_event("startup")
async def on_startup() -> None:
    # Postgres may start after the API container on first deploy — retry migrations.
    last_exc: BaseException | None = None
    for attempt in range(12):
        try:
            await init_db()
            return
        except BaseException as exc:
            last_exc = exc
            log.warning("init_db attempt %s failed: %s", attempt + 1, exc)
            await asyncio.sleep(min(2**attempt, 30))
    if last_exc is not None:
        raise last_exc
    raise RuntimeError("init_db failed with no exception captured")


app.include_router(health.router)
app.include_router(orders.router)
