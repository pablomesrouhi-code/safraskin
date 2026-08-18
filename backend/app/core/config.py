from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore", populate_by_name=True)

    database_url: str = Field(
        default="sqlite:///./safraskin.db",
        validation_alias=AliasChoices("DATABASE_URL", "database_url"),
    )
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    frontend_url: str = Field(default="https://safraskin.online", validation_alias=AliasChoices("FRONTEND_URL", "frontend_url"))
    cors_origins: str = Field(
        default="",
        validation_alias=AliasChoices("CORS_ORIGINS", "cors_origins"),
    )

    admin_username: str = Field(default="admin", validation_alias=AliasChoices("ADMIN_USERNAME", "admin_username"))
    admin_password: str = Field(
        default="change_me_strong_password",
        validation_alias=AliasChoices("ADMIN_PASSWORD", "admin_password"),
    )
    admin_jwt_secret: str = Field(default="", validation_alias=AliasChoices("ADMIN_JWT_SECRET", "admin_jwt_secret"))
    admin_jwt_expire_hours: int = Field(default=24, validation_alias=AliasChoices("ADMIN_JWT_EXPIRE_HOURS", "admin_jwt_expire_hours"))
    geoip_treat_private_as_ma: bool = Field(
        default=False,
        validation_alias=AliasChoices("GEOIP_TREAT_PRIVATE_AS_MA", "geoip_treat_private_as_ma"),
    )

    google_sheets_webhook_url: str = Field(
        default="",
        validation_alias=AliasChoices(
            "GOOGLE_SHEETS_WEBHOOK_URL",
            "GOOGLE_SHEET_WEBHOOK_URL",
            "google_sheets_webhook_url",
        ),
    )
    order_number_prefix: str = "nama"
    upsell_price_mad: int = 150

    meta_pixel_id: str = ""
    meta_access_token: str = Field(
        default="",
        validation_alias=AliasChoices("META_ACCESS_TOKEN", "META_CAPI_ACCESS_TOKEN", "meta_access_token"),
    )
    meta_test_event_code: str = ""
    tiktok_pixel_id: str = Field(
        default="",
        validation_alias=AliasChoices("TIKTOK_PIXEL_ID", "TIKTOK_PIXEL_CODE", "tiktok_pixel_id"),
    )
    tiktok_access_token: str = ""
    snap_pixel_id: str = ""
    snap_access_token: str = ""

    @property
    def sqlalchemy_url(self) -> str:
        url = (self.database_url or "").strip()
        if url.startswith("postgres://"):
            return url.replace("postgres://", "postgresql://", 1)
        return url

    @property
    def database_url_valid(self) -> bool:
        url = self.sqlalchemy_url.lower()
        return url.startswith("sqlite:") or url.startswith("postgresql:")

    @property
    def cors_origin_list(self) -> list[str]:
        raw = (self.cors_origins or "").strip()
        origins = [o.strip() for o in raw.split(",") if o.strip()] if raw else []
        defaults = [
            self.frontend_url.rstrip("/"),
            "https://safraskin.online",
            "https://www.safraskin.online",
            "http://localhost:3000",
        ]
        for origin in defaults:
            if origin and origin not in origins:
                origins.append(origin)
        return origins

    @property
    def jwt_secret(self) -> str:
        return self.admin_jwt_secret or (self.admin_password + "-safraskin-jwt")


settings = Settings()
