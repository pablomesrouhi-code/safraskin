from datetime import date, datetime, time, timezone

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.order import Order
from app.models.tracking import TrackingEvent
from app.schemas.admin import LeadFunnelOut, MetricsResponse, OrderCountsOut
from app.services.admin_profit import get_lead_funnel, get_order_counts
from app.services.pricing import SLUG_TO_NAME_AR


def _day_bounds(d_from: date, d_to: date) -> tuple[datetime, datetime]:
    start = datetime.combine(d_from, time.min, tzinfo=timezone.utc)
    end = datetime.combine(d_to, time.max.replace(microsecond=0), tzinfo=timezone.utc)
    return start, end


def get_metrics(db: Session, date_from: date, date_to: date) -> MetricsResponse:
    start, end = _day_bounds(date_from, date_to)

    def count_events(event_type: str, valid_only: bool = True) -> int:
        q = select(func.count()).select_from(TrackingEvent).where(
            TrackingEvent.event_type == event_type,
            TrackingEvent.created_at >= start,
            TrackingEvent.created_at <= end,
        )
        if valid_only:
            q = q.where(TrackingEvent.is_valid_traffic.is_(True))
        return db.scalar(q) or 0

    page_views = count_events("page_view")
    product_views = count_events("product_view")
    add_to_cart = count_events("add_to_cart")
    checkout_starts = count_events("checkout_start")

    orders_q = select(func.count()).select_from(Order).where(
        Order.created_at >= start, Order.created_at <= end
    )
    total_orders = db.scalar(orders_q) or 0

    valid_orders_q = orders_q.where(Order.is_valid_traffic.is_(True))
    valid_orders = db.scalar(valid_orders_q) or 0

    revenue_q = select(func.coalesce(func.sum(Order.grand_total_sar), 0)).where(
        Order.created_at >= start,
        Order.created_at <= end,
        Order.is_valid_traffic.is_(True),
        Order.status != "cancelled",
    )
    revenue = int(db.scalar(revenue_q) or 0)

    conversion = (valid_orders / page_views * 100) if page_views else 0.0
    aov = (revenue / valid_orders) if valid_orders else 0.0

    all_events = db.scalar(
        select(func.count()).select_from(TrackingEvent).where(
            TrackingEvent.created_at >= start, TrackingEvent.created_at <= end
        )
    ) or 0
    valid_events = db.scalar(
        select(func.count()).select_from(TrackingEvent).where(
            TrackingEvent.created_at >= start,
            TrackingEvent.created_at <= end,
            TrackingEvent.is_valid_traffic.is_(True),
        )
    ) or 0
    invalid_pct = ((all_events - valid_events) / all_events * 100) if all_events else 0.0

    by_day_rows = db.execute(
        select(
            func.date(TrackingEvent.created_at).label("day"),
            func.count().filter(TrackingEvent.event_type == "page_view").label("views"),
            func.count().filter(TrackingEvent.event_type == "add_to_cart").label("carts"),
        )
        .where(
            TrackingEvent.created_at >= start,
            TrackingEvent.created_at <= end,
            TrackingEvent.is_valid_traffic.is_(True),
        )
        .group_by(func.date(TrackingEvent.created_at))
        .order_by(func.date(TrackingEvent.created_at))
    ).all()

    orders_by_day = {
        str(r.day): r.cnt
        for r in db.execute(
            select(func.date(Order.created_at).label("day"), func.count().label("cnt"))
            .where(
                Order.created_at >= start,
                Order.created_at <= end,
                Order.is_valid_traffic.is_(True),
            )
            .group_by(func.date(Order.created_at))
        ).all()
    }

    by_day = [
        {
            "date": str(row.day),
            "page_views": row.views,
            "add_to_cart": row.carts,
            "orders": orders_by_day.get(str(row.day), 0),
        }
        for row in by_day_rows
    ]

    by_product_rows = db.execute(
        select(TrackingEvent.product_slug, func.count().label("cnt"))
        .where(
            TrackingEvent.event_type == "product_view",
            TrackingEvent.created_at >= start,
            TrackingEvent.created_at <= end,
            TrackingEvent.is_valid_traffic.is_(True),
            TrackingEvent.product_slug.isnot(None),
        )
        .group_by(TrackingEvent.product_slug)
        .order_by(func.count().desc())
    ).all()

    by_product = [
        {
            "slug": row.product_slug,
            "name_ar": SLUG_TO_NAME_AR.get(row.product_slug, row.product_slug),
            "views": row.cnt,
        }
        for row in by_product_rows
    ]

    by_utm_rows = db.execute(
        select(Order.utm_source, func.count().label("cnt"), func.sum(Order.grand_total_sar))
        .where(
            Order.created_at >= start,
            Order.created_at <= end,
            Order.is_valid_traffic.is_(True),
            Order.utm_source.isnot(None),
        )
        .group_by(Order.utm_source)
        .order_by(func.count().desc())
    ).all()

    by_utm = [
        {"source": row.utm_source or "direct", "orders": row.cnt, "revenue_sar": int(row[2] or 0)}
        for row in by_utm_rows
    ]

    funnel = get_lead_funnel(db, start, end)
    counts = get_order_counts(db, start, end)

    return MetricsResponse(
        date_from=date_from,
        date_to=date_to,
        page_views=page_views,
        product_views=product_views,
        add_to_cart=add_to_cart,
        checkout_starts=checkout_starts,
        orders=total_orders,
        valid_orders=valid_orders,
        revenue_sar=revenue,
        conversion_rate=round(conversion, 2),
        aov_sar=round(aov, 2),
        invalid_traffic_pct=round(invalid_pct, 1),
        funnel=LeadFunnelOut(
            leads_total=funnel.leads_total,
            leads_valid=funnel.leads_valid,
            checkout_starts=checkout_starts,
            pending_confirmation=funnel.pending_confirmation,
            confirmed=funnel.confirmed,
            shipped=funnel.shipped,
            delivered=funnel.delivered,
            cancelled=funnel.cancelled,
            refunded=funnel.refunded,
            returned=funnel.returned,
        ),
        order_counts=OrderCountsOut(
            delivered_revenue_sar=counts.delivered_revenue_sar,
            delivered_count=counts.delivered_count,
            confirmed_count=counts.confirmed_count,
            warehouse_count=counts.warehouse_count,
            return_count=counts.return_count,
        ),
        by_day=by_day,
        by_product=by_product,
        by_utm_source=by_utm,
    )
