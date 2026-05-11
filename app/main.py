from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import logging

from starlette.responses import PlainTextResponse, Response

from app.config import settings
from app.db import init_db
from app.routers import health, orders

log = logging.getLogger(__name__)

# redirect_slashes=False: many health probes treat 307 redirects as failure (slash mismatch).
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


@app.get("/")
async def root() -> dict[str, str]:
    """Liveness for `/` — 200 + JSON (no DB)."""
    return {"status": "ok"}


@app.head("/")
async def root_head() -> Response:
    """Some load balancers use HEAD for liveness (no body)."""
    return Response(status_code=200)


@app.get("/ping")
async def ping() -> PlainTextResponse:
    """Minimal plaintext probe — panels that reject JSON still get HTTP 200 + ok."""
    return PlainTextResponse("ok", media_type="text/plain")


@app.get("/live")
async def live() -> dict[str, str]:
    """Some PaaS panels default to /live."""
    return {"status": "ok"}


@app.get("/ready")
async def ready() -> dict[str, str]:
    """Some PaaS panels default to /ready (liveness only; no DB gate)."""
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


app.include_router(health.router)
app.include_router(orders.router)
