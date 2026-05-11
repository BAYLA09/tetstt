from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_env: str = "development"
    app_name: str = "Layali Beauty API"
    api_base_url: str | None = None
    database_url: str = "sqlite+aiosqlite:///./layali_dev.db"
    frontend_origin: str = "http://localhost:3000"
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
    enable_ip_fraud_check: bool = False
    # With order_allowed_country=AE, +971 phones skip MaxMind (UAE COD).
    trust_uae_e164_without_geo: bool = True
    # If True, block on VPN/proxy/hosting traits and high IP risk when MaxMind runs.
    enable_maxmind_vpn_trait_block: bool = False
    order_allowed_country: str = "AE"
    whitelisted_phones: str = ""
    log_level: str = "INFO"
    cors_allow_www: bool = True

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

        origins = [
            self.effective_frontend_origin,
            "http://localhost:3000",
            "http://127.0.0.1:3000",
        ]
        if self.cors_allow_www:
            origins.append("https://www.layalibeauty.shop")
        return origins

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
