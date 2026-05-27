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


class AdClickIn(BaseModel):
    fbclid: str | None = Field(default=None, max_length=512)
    ttclid: str | None = Field(default=None, max_length=512)
    sc_click_id: str | None = Field(default=None, max_length=512)
    landing_page: str | None = Field(default=None, max_length=4096)
    path: str = Field(default="/", max_length=512)

    @field_validator("fbclid", "ttclid", "sc_click_id", mode="before")
    @classmethod
    def empty_as_none(cls, v: object) -> str | None:
        if v is None:
            return None
        s = str(v).strip()
        return s or None


class AdminLoginIn(BaseModel):
    username: str = Field(min_length=1, max_length=128)
    password: str = Field(min_length=1, max_length=256)


class AdminLoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int = 86400


class SheetWebhookProbeOut(BaseModel):
    configured: bool
    host: str | None = None
    secret_configured: bool = False
    probe_orderid: str | None = None
    follow_redirects: bool = True
    without_redirect: dict | None = None
    with_redirect: dict | None = None
    verdict: str
    error: str | None = None


class AdminMetricsOut(BaseModel):
    date_from: str
    date_to: str
    clicks: int
    orders: int
    revenue_aed: float
    conversion_rate_percent: float | None
    average_order_value_aed: float | None
    orders_by_status: dict[str, int] = Field(default_factory=dict)
    pending_sheet_sync_count: int = 0
    orders_with_upsell: int = 0
    upsell_attach_rate_percent: float | None = None


class OrderItemAdminOut(BaseModel):
    sku: str
    name: str
    unit_price: float
    quantity: int
    line_total: float
    is_upsell: bool


class OrderAdminSummaryOut(BaseModel):
    public_order_id: str | None
    created_at: str
    customer_name: str
    phone_display: str
    total: float
    currency: str
    status: str
    utm_source: str | None
    items_preview: str


class AdminOrdersListOut(BaseModel):
    total: int
    limit: int
    offset: int
    orders: list[OrderAdminSummaryOut]


class OrderAdminDetailOut(BaseModel):
    public_order_id: str | None
    internal_id: str
    created_at: str
    updated_at: str
    customer_name: str
    phone_e164: str
    currency: str
    subtotal: float
    upsell_total: float
    total: float
    status: str
    source_url: str | None
    landing_page: str | None
    utm: dict[str, str | None]
    tracking_keys: list[str]
    event_ids: dict[str, str]
    sheet_sync_status: str
    sheet_sync_error: str | None
    items: list[OrderItemAdminOut]
