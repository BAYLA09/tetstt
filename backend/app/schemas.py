from decimal import Decimal
from pydantic import BaseModel, Field, field_validator
from app.phone import InvalidPhone, normalize_uae_phone

class ItemIn(BaseModel):
    sku: str
    name: str = ""
    price: Decimal | None = None
    quantity: int = Field(ge=1, le=20)

class OrderIn(BaseModel):
    customer_name: str = Field(min_length=2, max_length=120)
    phone: str
    items: list[ItemIn] = Field(min_length=1)
    currency: str = "AED"
    source_url: str | None = None
    landing_page: str | None = None
    event_ids: dict = Field(default_factory=dict)
    tracking: dict = Field(default_factory=dict)
    utm: dict = Field(default_factory=dict)

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, value: str) -> str:
        try:
            return normalize_uae_phone(value)
        except InvalidPhone as exc:
            raise ValueError(str(exc)) from exc

    @field_validator("currency")
    @classmethod
    def validate_currency(cls, value: str) -> str:
        if value != "AED":
            raise ValueError("Only AED is supported")
        return value

class OrderOut(BaseModel):
    order_id: str
    status: str
    total: Decimal
    currency: str

class UpsellIn(BaseModel):
    sku: str
    name: str = ""
    price: Decimal | None = None
    quantity: int = Field(default=1, ge=1, le=1)
    event_id: str | None = None

class UpsellOut(BaseModel):
    order_id: str
    total: Decimal
    upsell_added: bool
