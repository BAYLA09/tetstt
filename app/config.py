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

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()
