from pydantic import BaseModel, Field


class OrderItemIn(BaseModel):
    sku: str
    qty: int = Field(ge=1)


class CreateOrderIn(BaseModel):
    customer_name: str = Field(min_length=2)
    customer_phone: str
    items: list[OrderItemIn]
    upsell_sku: str | None = None
    upsell_price_mad: int | None = None
    upsell_price_sar: int | None = None
    utm_source: str | None = None
    utm_medium: str | None = None
    utm_campaign: str | None = None
    session_id: str | None = None