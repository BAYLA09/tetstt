from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

from pydantic import AliasChoices, Field, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Self

from app.env_bool import env_bool


class Settings(BaseSettings):
    app_env: str = "development"
    app_name: str = "Layali Beauty API"
    # HTTP server bind (EasyPanel sets PORT; use HOST if you need to override)
    bind_host: str = Field(
        default="0.0.0.0",
        validation_alias=AliasChoices("HOST", "BIND_HOST", "UVICORN_HOST"),
    )
    bind_port: int = Field(
        default=8000,
        validation_alias=AliasChoices("PORT", "UVICORN_PORT"),
    )
    api_base_url: str | None = None
    database_url: str = "sqlite+aiosqlite:///./layali_dev.db"
    frontend_origin: str = "https://layalibeauty.shop"
    frontend_url: str | None = None
    cors_origins: str | None = None
    sheet_webhook_url: str | None = None
    google_sheets_webhook_url: str | None = None
    sheet_webhook_secret: str | None = None
    sheets_webhook_secret: str | None = None
    meta_pixel_id: str | None = None
    meta_access_token: str | None = None
    meta_api_version: str = "v20.0"
    tiktok_pixel_id: str | None = None
    tiktok_pixel_code: str | None = None
    tiktok_access_token: str | None = None
    tiktok_api_version: str = "v1.3"
    snap_pixel_id: str | None = None
    snap_access_token: str | None = None
    enable_capt: bool = True
    enable_meta_capt: bool = True
    enable_tiktok_capt: bool = True
    enable_snap_capt: bool = True
    maxmind_api_url: str = "https://geoip.maxmind.com/geoip/v2.1/insights"
    maxmind_account_id: str | None = None
    maxmind_license_key: str | None = None
    maxmind_max_ip_risk: int = 75
    enable_ip_fraud_check: bool = False
    trust_uae_e164_without_geo: bool = True
    disable_order_security_checks: bool = False
    enable_maxmind_vpn_trait_block: bool = False
    order_allowed_country: str = "AE"
    whitelisted_phones: str = ""
    log_level: str = "INFO"
    cors_allow_www: bool = True
    # Emergency only: CORS_ALLOW_ALL=true → allow any Origin (diagnose "failed fetch"). Turn off after fixing.
    cors_allow_all: bool = False

    @model_validator(mode="after")
    def apply_strict_bool_env(self) -> Self:
        object.__setattr__(self, "enable_ip_fraud_check", env_bool("ENABLE_IP_FRAUD_CHECK", self.enable_ip_fraud_check))
        object.__setattr__(
            self, "trust_uae_e164_without_geo", env_bool("TRUST_UAE_E164_WITHOUT_GEO", self.trust_uae_e164_without_geo)
        )
        object.__setattr__(
            self,
            "disable_order_security_checks",
            env_bool("DISABLE_ORDER_SECURITY_CHECKS", self.disable_order_security_checks),
        )
        object.__setattr__(self, "enable_capt", env_bool("ENABLE_CAPT", self.enable_capt))
        object.__setattr__(self, "enable_meta_capt", env_bool("ENABLE_META_CAPT", self.enable_meta_capt))
        object.__setattr__(self, "enable_tiktok_capt", env_bool("ENABLE_TIKTOK_CAPT", self.enable_tiktok_capt))
        object.__setattr__(self, "enable_snap_capt", env_bool("ENABLE_SNAP_CAPT", self.enable_snap_capt))
        object.__setattr__(self, "cors_allow_www", env_bool("CORS_ALLOW_WWW", self.cors_allow_www))
        object.__setattr__(self, "cors_allow_all", env_bool("CORS_ALLOW_ALL", self.cors_allow_all))
        object.__setattr__(
            self, "enable_maxmind_vpn_trait_block", env_bool("ENABLE_MAXMIND_VPN_TRAIT_BLOCK", self.enable_maxmind_vpn_trait_block)
        )
        return self

    @staticmethod
    def _normalize_postgres_url(url: str, *, async_driver: bool) -> str:
        if not async_driver and url.startswith("sqlite+aiosqlite://"):
            return url.replace("sqlite+aiosqlite://", "sqlite://", 1)
        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql://", 1)
        if url.startswith("postgresql+"):
            base = url.split("://", 1)[1]
            url = f"postgresql+{'asyncpg' if async_driver else 'psycopg'}://{base}"
        if url.startswith("postgresql://"):
            url = url.replace("postgresql://", f"postgresql+{'asyncpg' if async_driver else 'psycopg'}://", 1)
        if url.startswith("postgresql+asyncpg://"):
            # EasyPanel/Postgres URLs often include sslmode=disable, but asyncpg
            # does not accept that libpq-style parameter.
            parts = urlsplit(url)
            query = [(key, value) for key, value in parse_qsl(parts.query) if key != "sslmode"]
            return urlunsplit((parts.scheme, parts.netloc, parts.path, urlencode(query), parts.fragment))
        return url

    @property
    def async_database_url(self) -> str:
        return self._normalize_postgres_url(self.database_url, async_driver=True)

    @property
    def sync_database_url(self) -> str:
        return self._normalize_postgres_url(self.database_url, async_driver=False)

    @property
    def effective_frontend_origin(self) -> str:
        return self.frontend_url or self.frontend_origin

    @property
    def allowed_origins(self) -> list[str]:
        if self.cors_origins:
            return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

        production = [
            "https://layalibeauty.shop",
            "https://api.layalibeauty.shop",
        ]
        if self.cors_allow_www:
            production.append("https://www.layalibeauty.shop")
        raw = [
            self.effective_frontend_origin,
            *production,
            "http://localhost:3000",
            "http://127.0.0.1:3000",
        ]
        seen: set[str] = set()
        out: list[str] = []
        for origin in raw:
            if origin and origin not in seen:
                seen.add(origin)
                out.append(origin)
        return out

    @property
    def effective_sheet_webhook_url(self) -> str | None:
        return self.google_sheets_webhook_url or self.sheet_webhook_url

    @property
    def effective_sheet_webhook_secret(self) -> str | None:
        return self.sheets_webhook_secret or self.sheet_webhook_secret

    @property
    def effective_tiktok_pixel_id(self) -> str | None:
        return self.tiktok_pixel_code or self.tiktok_pixel_id

    @property
    def whitelisted_phone_values(self) -> set[str]:
        return {phone.strip() for phone in self.whitelisted_phones.split(",") if phone.strip()}

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()
