from pydantic import BaseModel, Field


class EventIn(BaseModel):
    event_type: str
    session_id: str | None = None
    path: str | None = None
    product_slug: str | None = None
    referrer: str | None = None
    utm_source: str | None = None
    utm_medium: str | None = None
    utm_campaign: str | None = None


class LoginIn(BaseModel):
    username: str
    password: str


class OrderStatusIn(BaseModel):
    status: str | None = None
    notes: str | None = None


class EconomicsIn(BaseModel):
    product_cost_mad: float = Field(default=0, ge=0)
    packaging_mad: float = Field(default=0, ge=0)
    delivery_cost_mad: float = Field(default=0, ge=0)
    return_cost_mad: float = Field(default=0, ge=0)
    cod_fee_pct: float = Field(default=0, ge=0, le=100)
    selling_price_mad: float = Field(default=0, ge=0)
    ad_spend_mad: float = Field(default=0, ge=0)
    assumed_confirmation_rate: float = Field(default=0, ge=0, le=100)
    assumed_delivery_rate: float = Field(default=0, ge=0, le=100)
