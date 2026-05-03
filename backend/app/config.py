from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_env: str = "development"
    database_url: str = "sqlite+aiosqlite:///./layali_dev.db"
    frontend_origin: str = "http://localhost:3000"
    sheet_webhook_url: str | None = None
    sheet_webhook_secret: str | None = None
    meta_pixel_id: str | None = None
    meta_access_token: str | None = None
    tiktok_pixel_id: str | None = None
    tiktok_access_token: str | None = None
    snap_pixel_id: str | None = None
    snap_access_token: str | None = None
    cors_allow_www: bool = True

    @staticmethod
    def _normalize_postgres_url(url: str, *, async_driver: bool) -> str:
        if not async_driver and url.startswith("sqlite+aiosqlite://"):
            return url.replace("sqlite+aiosqlite://", "sqlite://", 1)
        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql://", 1)
        if url.startswith("postgresql+"):
            base = url.split("://", 1)[1]
            return f"postgresql+{'asyncpg' if async_driver else 'psycopg'}://{base}"
        if url.startswith("postgresql://"):
            return url.replace("postgresql://", f"postgresql+{'asyncpg' if async_driver else 'psycopg'}://", 1)
        return url

    @property
    def async_database_url(self) -> str:
        return self._normalize_postgres_url(self.database_url, async_driver=True)

    @property
    def sync_database_url(self) -> str:
        return self._normalize_postgres_url(self.database_url, async_driver=False)

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()
