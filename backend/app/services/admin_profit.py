from dataclasses import dataclass

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.order import Order


@dataclass
class LeadFunnel:
    leads_total: int
    leads_valid: int
    pending_confirmation: int
    confirmed: int
    shipped: int
    delivered: int
    cancelled: int
    refunded: int
    returned: int


@dataclass
class OrderCounts:
    delivered_revenue_sar: int
    delivered_count: int
    confirmed_count: int
    warehouse_count: int
    return_count: int


def _count_orders(
    db: Session,
    start,
    end,
    statuses: tuple[str, ...],
    *,
    valid_only: bool = True,
) -> int:
    q = select(func.count()).select_from(Order).where(
        Order.created_at >= start,
        Order.created_at <= end,
        Order.status.in_(statuses),
    )
    if valid_only:
        q = q.where(Order.is_valid_traffic.is_(True))
    return db.scalar(q) or 0


def get_lead_funnel(db: Session, start, end) -> LeadFunnel:
    base = select(Order.status, func.count().label("cnt")).where(
        Order.created_at >= start,
        Order.created_at <= end,
    )

    all_rows = {
        row.status: row.cnt
        for row in db.execute(base.group_by(Order.status)).all()
    }
    valid_rows = {
        row.status: row.cnt
        for row in db.execute(
            base.where(Order.is_valid_traffic.is_(True)).group_by(Order.status)
        ).all()
    }

    leads_total = sum(all_rows.values())
    leads_valid = sum(valid_rows.values())
    pending = valid_rows.get("pending_confirmation", 0)
    confirmed = valid_rows.get("confirmed", 0)
    shipped = valid_rows.get("shipped", 0)
    delivered = valid_rows.get("delivered", 0)
    cancelled = valid_rows.get("cancelled", 0)
    refunded = valid_rows.get("refunded", 0)

    return LeadFunnel(
        leads_total=leads_total,
        leads_valid=leads_valid,
        pending_confirmation=pending,
        confirmed=confirmed,
        shipped=shipped,
        delivered=delivered,
        cancelled=cancelled,
        refunded=refunded,
        returned=cancelled + refunded,
    )


def get_order_counts(db: Session, start, end) -> OrderCounts:
    confirmed_statuses = ("confirmed", "shipped", "delivered")
    warehouse_statuses = ("shipped", "delivered")
    return_statuses = ("cancelled", "refunded")

    delivered_revenue_sar = int(
        db.scalar(
            select(func.coalesce(func.sum(Order.grand_total_sar), 0)).where(
                Order.created_at >= start,
                Order.created_at <= end,
                Order.is_valid_traffic.is_(True),
                Order.status == "delivered",
            )
        )
        or 0
    )

    return OrderCounts(
        delivered_revenue_sar=delivered_revenue_sar,
        delivered_count=_count_orders(db, start, end, ("delivered",)),
        confirmed_count=_count_orders(db, start, end, confirmed_statuses),
        warehouse_count=_count_orders(db, start, end, warehouse_statuses),
        return_count=_count_orders(db, start, end, return_statuses),
    )
