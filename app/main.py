from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.db import init_db
from app.routers import health, orders

app = FastAPI(title="Layali Beauty API", version="0.1.0")

origins = [settings.frontend_origin, "http://localhost:3000", "http://127.0.0.1:3000"]
if settings.cors_allow_www:
    origins.append("https://www.layalibeauty.shop")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def on_startup() -> None:
    await init_db()


app.include_router(health.router)
app.include_router(orders.router)
