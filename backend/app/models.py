import uuid
from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, JSON, Numeric, String, Text, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

class Base(DeclarativeBase):
    pass

class Order(Base):
    __tablename__ = "orders"
    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    public_order_id: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    customer_name: Mapped[str] = mapped_column(String, nullable=False)
    phone_e164: Mapped[str] = mapped_column(String, nullable=False)
    phone_hash: Mapped[str] = mapped_column(String, index=True, nullable=False)
    currency: Mapped[str] = mapped_column(String, nullable=False, default="AED")
    subtotal: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    upsell_total: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False, default=0)
    total: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    status: Mapped[str] = mapped_column(String, nullable=False, default="received")
    source_url: Mapped[str | None] = mapped_column(Text)
    landing_page: Mapped[str | None] = mapped_column(Text)
    utm_source: Mapped[str | None] = mapped_column(String)
    utm_medium: Mapped[str | None] = mapped_column(String)
    utm_campaign: Mapped[str | None] = mapped_column(String)
    utm_content: Mapped[str | None] = mapped_column(String)
    utm_term: Mapped[str | None] = mapped_column(String)
    tracking_payload: Mapped[dict | None] = mapped_column(JSON)
    event_ids: Mapped[dict | None] = mapped_column(JSON)
    sheet_sync_status: Mapped[str] = mapped_column(String, nullable=False, default="pending")
    sheet_sync_error: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[object] = mapped_column(DateTime(timezone=True), server_default=func.now(), index=True)
    updated_at: Mapped[object] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    items: Mapped[list["OrderItem"]] = relationship(back_populates="order", cascade="all, delete-orphan")

class OrderItem(Base):
    __tablename__ = "order_items"
    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    order_id: Mapped[str] = mapped_column(ForeignKey("orders.id"), index=True, nullable=False)
    sku: Mapped[str] = mapped_column(String, nullable=False)
    name: Mapped[str] = mapped_column(String, nullable=False)
    unit_price: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    line_total: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    is_upsell: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    created_at: Mapped[object] = mapped_column(DateTime(timezone=True), server_default=func.now())
    order: Mapped[Order] = relationship(back_populates="items")

class TrackingEvent(Base):
    __tablename__ = "tracking_events"
    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    order_id: Mapped[str | None] = mapped_column(ForeignKey("orders.id"))
    provider: Mapped[str] = mapped_column(String, nullable=False)
    event_name: Mapped[str] = mapped_column(String, nullable=False)
    event_id: Mapped[str | None] = mapped_column(String, index=True)
    status: Mapped[str] = mapped_column(String, nullable=False)
    request_payload_redacted: Mapped[dict | None] = mapped_column(JSON)
    response_payload: Mapped[dict | None] = mapped_column(JSON)
    error: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[object] = mapped_column(DateTime(timezone=True), server_default=func.now())
