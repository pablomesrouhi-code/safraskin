from datetime import datetime

from sqlalchemy import Boolean, DateTime, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Order(Base):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    order_id: Mapped[str] = mapped_column(String(32), unique=True, index=True)
    customer_name: Mapped[str] = mapped_column(String(120))
    customer_phone: Mapped[str] = mapped_column(String(32), index=True)
    items_json: Mapped[str] = mapped_column(Text)
    grand_total_mad: Mapped[int] = mapped_column(Integer)
    upsell_accepted: Mapped[bool] = mapped_column(Boolean, default=False)
    upsell_sku: Mapped[str | None] = mapped_column(String(32), nullable=True)
    status: Mapped[str] = mapped_column(String(32), default="pending_confirmation", index=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    utm_source: Mapped[str | None] = mapped_column(String(80), nullable=True)
    utm_medium: Mapped[str | None] = mapped_column(String(80), nullable=True)
    utm_campaign: Mapped[str | None] = mapped_column(String(120), nullable=True)
    session_id: Mapped[str | None] = mapped_column(String(80), nullable=True)
    ip_address: Mapped[str | None] = mapped_column(String(64), nullable=True)
    ip_country: Mapped[str | None] = mapped_column(String(8), nullable=True)
    ip_city: Mapped[str | None] = mapped_column(String(80), nullable=True)
    is_morocco: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    user_agent: Mapped[str | None] = mapped_column(String(500), nullable=True)
    sheets_synced: Mapped[bool] = mapped_column(Boolean, default=False)
    status_updated_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), index=True)
