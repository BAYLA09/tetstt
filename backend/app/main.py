from __future__ import annotations

import asyncio
import logging

from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse

from app.config import settings
from app.db import init_db
from app.routers import orders

log = logging.getLogger(__name__)

# Avoid 307 trailing-slash redirects — many health probes treat non-200 as failure.
app = FastAPI(title=settings.app_name, version="0.1.0", redirect_slashes=False)

if settings.cors_allow_all:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    origins = settings.allowed_origins
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


@app.get("/", response_class=PlainTextResponse)
async def root() -> str:
    return "ok"


@app.head("/")
async def root_head() -> Response:
    return Response(status_code=200)


@app.get("/ping", response_class=PlainTextResponse)
async def ping() -> str:
    return "ok"


@app.head("/ping")
async def ping_head() -> Response:
    return Response(status_code=200)


@app.get("/health")
@app.get("/health/")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.head("/health")
@app.head("/health/")
async def health_head() -> Response:
    return Response(status_code=200)


@app.get("/live")
async def live() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/ready")
async def ready() -> dict[str, str]:
    return {"status": "ok"}


@app.head("/live")
async def live_head() -> Response:
    return Response(status_code=200)


@app.head("/ready")
async def ready_head() -> Response:
    return Response(status_code=200)


async def _init_db_retry_background() -> None:
    """Postgres may start after the API; Easypanel health checks time out if startup blocks too long."""
    last_exc: BaseException | None = None
    for attempt in range(36):
        try:
            await init_db()
            log.info("init_db succeeded on attempt %s", attempt + 1)
            return
        except BaseException as exc:
            last_exc = exc
            log.warning("init_db attempt %s failed: %s", attempt + 1, exc)
            await asyncio.sleep(min(2 ** min(attempt, 5), 20))
    log.error("init_db exhausted retries; API is up but DB schema may be missing: %s", last_exc)


@app.on_event("startup")
async def on_startup() -> None:
    asyncio.create_task(_init_db_retry_background())


app.include_router(orders.router)
