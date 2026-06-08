from pydantic import BaseModel, Field


class TrackEventRequest(BaseModel):
    event_type: str = Field(pattern=r"^(page_view|product_view|add_to_cart|checkout_start|offer_click)$")
    session_id: str = Field(min_length=8, max_length=64)
    path: str | None = Field(default=None, max_length=500)
    product_slug: str | None = Field(default=None, max_length=50)
    utm_source: str | None = None
    utm_medium: str | None = None
    utm_campaign: str | None = None
    referrer: str | None = Field(default=None, max_length=500)
