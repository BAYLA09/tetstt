from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    app_env: str = "development"
    database_url: str = "sqlite+aiosqlite:///./local.db"
    frontend_origin: str = "http://localhost:3000"
    cors_allow_www: bool = True
    sheet_webhook_url: str = ""
    sheet_webhook_secret: str = ""
    meta_pixel_id: str = ""
    meta_access_token: str = ""
    tiktok_pixel_id: str = ""
    tiktok_access_token: str = ""
    snap_pixel_id: str = ""
    snap_access_token: str = ""
    order_rate_limit_per_minute: int = 10
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

@lru_cache
def get_settings() -> Settings:
    return Settings()
