from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "sqlite:///./safraskin.db"
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    cors_origins: str = "https://safraskin.online,https://www.safraskin.online,http://localhost:3000"

    admin_username: str = "admin"
    admin_password: str = "change_me_strong_password"
    admin_jwt_secret: str = ""
    admin_jwt_expire_hours: int = 24

    google_sheets_webhook_url: str = ""
    order_number_prefix: str = "safra"
    upsell_price_mad: int = 120

    meta_pixel_id: str = ""
    meta_access_token: str = ""
    meta_test_event_code: str = ""
    tiktok_pixel_id: str = ""
    tiktok_access_token: str = ""
    snap_pixel_id: str = ""
    snap_access_token: str = ""

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def jwt_secret(self) -> str:
        return self.admin_jwt_secret or (self.admin_password + "-safraskin-jwt")


settings = Settings()