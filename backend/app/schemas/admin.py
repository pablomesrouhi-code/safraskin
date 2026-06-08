from datetime import date, datetime

from pydantic import BaseModel, Field


class AdminLoginRequest(BaseModel):
    username: str
    password: str


class AdminLoginResponse(BaseModel):
    token: str
    username: str


class LeadFunnelOut(BaseModel):
    leads_total: int
    leads_valid: int
    checkout_starts: int
    pending_confirmation: int
    confirmed: int
    shipped: int
    delivered: int
    cancelled: int
    refunded: int
    returned: int


class OrderCountsOut(BaseModel):
    delivered_revenue_sar: int
    delivered_count: int
    confirmed_count: int
    warehouse_count: int
    return_count: int


class MetricsResponse(BaseModel):
    date_from: date
    date_to: date
    page_views: int
    product_views: int
    add_to_cart: int
    checkout_starts: int
    orders: int
    valid_orders: int
    revenue_sar: int
    conversion_rate: float
    aov_sar: float
    invalid_traffic_pct: float
    funnel: LeadFunnelOut
    order_counts: OrderCountsOut
    by_day: list[dict]
    by_product: list[dict]
    by_utm_source: list[dict]


class OrderItemOut(BaseModel):
    product_slug: str
    sku: str
    quantity: int
    name_ar: str


class OrderListItem(BaseModel):
    id: str
    order_number: str
    customer_name: str
    customer_phone_display: str
    grand_total_sar: int
    status: str
    is_valid_traffic: bool
    sheets_synced: bool
    created_at: datetime
    item_count: int


class OrderDetailOut(BaseModel):
    id: str
    order_number: str
    customer_name: str
    customer_phone: str
    customer_phone_display: str
    tier_count: int
    tier_total_sar: int
    upsell_accepted: bool
    upsell_sku: str | None
    upsell_price_sar: int | None
    grand_total_sar: int
    payment_method: str
    status: str
    sheets_synced: bool
    client_ip: str | None
    country_code: str | None
    country_name: str | None
    is_vpn: bool
    is_proxy: bool
    is_hosting: bool
    is_valid_traffic: bool
    utm_source: str | None
    utm_medium: str | None
    utm_campaign: str | None
    admin_notes: str | None
    created_at: datetime
    items: list[OrderItemOut]


class OrderStatusUpdate(BaseModel):
    status: str = Field(pattern=r"^(pending_confirmation|confirmed|shipped|delivered|cancelled|refunded)$")
    admin_notes: str | None = None


class OrdersListResponse(BaseModel):
    items: list[OrderListItem]
    total: int
    page: int
    page_size: int
