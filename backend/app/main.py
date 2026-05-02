from fastapi import BackgroundTasks, Depends, FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from app.config import get_settings
from app.database import SessionLocal, get_session
from app.integrations import sync_sheet
from app.orders import add_upsell, create_order
from app.rate_limit import enforce_order_rate_limit
from app.schemas import OrderIn, OrderOut, UpsellIn, UpsellOut

settings = get_settings()
origins = [settings.frontend_origin, "http://localhost:3000"]
if settings.cors_allow_www and settings.frontend_origin.startswith("https://layalibeauty.shop"):
    origins.append("https://www.layalibeauty.shop")
app = FastAPI(title="Layali Beauty API")
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}

@app.post("/orders", response_model=OrderOut)
async def post_order(request: Request, payload: OrderIn, background_tasks: BackgroundTasks, session: AsyncSession = Depends(get_session)) -> OrderOut:
    enforce_order_rate_limit(request)
    order = await create_order(session, payload)
    background_tasks.add_task(sync_sheet, SessionLocal, order.id)
    return OrderOut(order_id=order.public_order_id, status=order.status, total=order.total, currency=order.currency)

@app.post("/orders/{order_id}/upsell", response_model=UpsellOut)
async def post_upsell(order_id: str, payload: UpsellIn, session: AsyncSession = Depends(get_session)) -> UpsellOut:
    order = await add_upsell(session, order_id, payload)
    return UpsellOut(order_id=order.public_order_id, total=order.total, upsell_added=True)
