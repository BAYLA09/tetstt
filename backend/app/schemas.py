from pydantic import BaseModel, Field, field_validator


class OrderItemIn(BaseModel):
    sku: str
    name: str | None = None
    price: float | None = None
    quantity: int = Field(default=1, ge=1, le=10)

    @field_validator("sku", mode="before")
    @classmethod
    def normalize_sku(cls, v: object) -> str:
        if isinstance(v, str):
            return v.strip()
        return str(v).strip()


class OrderCreate(BaseModel):
    customer_name: str = Field(min_length=2, max_length=120)
    phone: str
    items: list[OrderItemIn] = Field(min_length=1)
    currency: str = "AED"
    source_url: str | None = None
    landing_page: str | None = None
    event_ids: dict[str, str] = Field(default_factory=dict)
    tracking: dict[str, str] = Field(default_factory=dict)
    utm: dict[str, str] = Field(default_factory=dict)


class UpsellCreate(BaseModel):
    sku: str
    name: str | None = None
    price: float | None = None
    quantity: int = Field(default=1, ge=1, le=3)
    event_id: str | None = None

    @field_validator("sku", mode="before")
    @classmethod
    def normalize_sku(cls, v: object) -> str:
        if isinstance(v, str):
            return v.strip()
        return str(v).strip()


class OrderResponse(BaseModel):
    order_id: str
    status: str
    total: float
    currency: str = "AED"
    upsell_added: bool = False


class UpsellResponse(BaseModel):
    order_id: str
    total: float
    upsell_added: bool
