import json
from collections import defaultdict

from sqlalchemy import func, or_, true
from sqlalchemy.orm import Session

from app.core.dates import date_keys, ma_date_key, range_bounds
from app.models.event import Event
from app.models.order import Order
from app.models.settings import AdminSetting
from app.services.order_status import CANCELLED, CONFIRMED_PLUS, PENDING_CALL, SHIPPED_PLUS, STATUSES
from app.services.pricing import SLUG_TO_NAME_AR

DEFAULT_ECONOMICS = {
    "product_cost_mad": 0,
    "packaging_mad": 0,
    "delivery_cost_mad": 0,
    "return_cost_mad": 0,
    "cod_fee_pct": 0,
    "selling_price_mad": 0,
    "ad_spend_mad": 0,
    "lead_cost_mad": 2,
    "space_seller_fee_mad": 63,
    "upsell_cost_mad": 10,
    "cpl_mad": 0,
    "assumed_confirmation_rate": 50,
    "assumed_delivery_rate": 70,
}


def get_economics(db: Session) -> dict:
    row = db.get(AdminSetting, "economics")
    data = dict(DEFAULT_ECONOMICS)
    if row and row.value:
        try:
            stored = json.loads(row.value)
            if isinstance(stored, dict):
                for key in DEFAULT_ECONOMICS:
                    if key in stored and stored[key] is not None:
                        data[key] = float(stored[key])
        except (json.JSONDecodeError, TypeError, ValueError):
            pass
    return data


def save_economics(db: Session, payload: dict) -> dict:
    data = dict(DEFAULT_ECONOMICS)
    for key in DEFAULT_ECONOMICS:
        if key in payload and payload[key] is not None:
            data[key] = float(payload[key])
    row = db.get(AdminSetting, "economics")
    if row is None:
        row = AdminSetting(key="economics", value=json.dumps(data))
        db.add(row)
    else:
        row.value = json.dumps(data)
    db.commit()
    return data


def _parse_items(raw: str | None) -> list[dict]:
    try:
        items = json.loads(raw or "[]")
        return items if isinstance(items, list) else []
    except json.JSONDecodeError:
        return []


def _serialize_order(order: Order) -> dict:
    items = _parse_items(order.items_json)
    named = []
    for item in items:
        slug = item.get("product_slug") or ""
        named.append(
            {
                "sku": item.get("sku"),
                "product_slug": slug,
                "quantity": item.get("quantity") or item.get("qty") or 1,
                "name_ar": SLUG_TO_NAME_AR.get(slug, slug or item.get("sku") or ""),
            }
        )
    upsell_name = None
    if order.upsell_sku:
        from app.services.pricing import SKU_TO_SLUG

        slug = SKU_TO_SLUG.get(order.upsell_sku, "")
        upsell_name = SLUG_TO_NAME_AR.get(slug, order.upsell_sku)
    return {
        "id": order.id,
        "order_id": order.order_id,
        "customer_name": order.customer_name,
        "customer_phone": order.customer_phone,
        "items": named,
        "grand_total_mad": order.grand_total_mad,
        "upsell_accepted": order.upsell_accepted,
        "upsell_sku": order.upsell_sku,
        "upsell_name": upsell_name,
        "status": order.status,
        "notes": order.notes,
        "utm_source": order.utm_source,
        "utm_medium": order.utm_medium,
        "utm_campaign": order.utm_campaign,
        "session_id": order.session_id,
        "ip_address": order.ip_address,
        "ip_country": order.ip_country,
        "ip_city": order.ip_city,
        "is_morocco": bool(order.is_morocco),
        "sheets_synced": bool(order.sheets_synced),
        "created_at": order.created_at.isoformat() if order.created_at else None,
        "status_updated_at": order.status_updated_at.isoformat() if order.status_updated_at else None,
    }


def _ma_orders(db: Session, start, end):
    return db.query(Order).filter(
        Order.is_morocco == true(),
        Order.created_at >= start,
        Order.created_at < end,
    )


def _ma_events(db: Session, start, end):
    return db.query(Event).filter(
        Event.is_morocco == true(),
        Event.created_at >= start,
        Event.created_at < end,
    )


def _pct(num: float, den: float) -> float:
    if den <= 0:
        return 0.0
    return round(100.0 * num / den, 2)


def _rate(num: float, den: float) -> float:
    if den <= 0:
        return 0.0
    return num / den


def dashboard_metrics(db: Session, date_from: str | None, date_to: str | None) -> dict:
    start, end = range_bounds(date_from, date_to)
    days = date_keys(start, end)

    clicks = (
        _ma_events(db, start, end)
        .filter(Event.event_type == "page_view")
        .with_entities(func.count(func.distinct(Event.session_id)))
        .scalar()
    ) or 0
    page_views = _ma_events(db, start, end).filter(Event.event_type == "page_view").count()
    product_views = _ma_events(db, start, end).filter(Event.event_type == "product_view").count()
    add_to_carts = _ma_events(db, start, end).filter(Event.event_type == "add_to_cart").count()
    checkouts = _ma_events(db, start, end).filter(Event.event_type == "checkout_start").count()
    offer_clicks = _ma_events(db, start, end).filter(Event.event_type == "offer_click").count()

    unique_by_type = {}
    for etype in ("page_view", "product_view", "add_to_cart", "checkout_start", "offer_click"):
        unique_by_type[etype] = (
            _ma_events(db, start, end)
            .filter(Event.event_type == etype)
            .with_entities(func.count(func.distinct(Event.session_id)))
            .scalar()
        ) or 0

    orders = _ma_orders(db, start, end).all()
    status_counts = {s: 0 for s in STATUSES}
    daily_orders: dict[str, int] = defaultdict(int)
    daily_revenue: dict[str, int] = defaultdict(int)
    daily_clicks: dict[str, int] = defaultdict(int)
    sources: dict[str, dict] = defaultdict(lambda: {"orders": 0, "revenue": 0})
    products: dict[str, dict] = defaultdict(lambda: {"qty": 0, "orders": 0, "revenue": 0, "name_ar": ""})
    phones: dict[str, int] = defaultdict(int)

    gross = 0
    confirmed_count = 0
    confirmed_value = 0
    delivered_count = 0
    delivered_value = 0
    returned_count = 0
    shipped_count = 0
    pending_count = 0
    cancelled_count = 0
    upsell_count = 0
    crosssell_count = 0
    units = 0

    for order in orders:
        status_counts[order.status] = status_counts.get(order.status, 0) + 1
        gross += order.grand_total_mad or 0
        day = ma_date_key(order.created_at)
        daily_orders[day] += 1
        daily_revenue[day] += order.grand_total_mad or 0
        src = (order.utm_source or "direct").strip() or "direct"
        sources[src]["orders"] += 1
        sources[src]["revenue"] += order.grand_total_mad or 0
        phones[order.customer_phone] += 1
        if order.upsell_accepted:
            upsell_count += 1
        items = _parse_items(order.items_json)
        unique_slugs = { (item.get("product_slug") or item.get("sku") or "") for item in items }
        unique_slugs.discard("")
        if len(unique_slugs) > 1:
            crosssell_count += 1
        if order.status in CONFIRMED_PLUS:
            confirmed_count += 1
            confirmed_value += order.grand_total_mad or 0
        if order.status in SHIPPED_PLUS:
            shipped_count += 1
        if order.status == "delivered":
            delivered_count += 1
            delivered_value += order.grand_total_mad or 0
        if order.status == "returned":
            returned_count += 1
        if order.status in PENDING_CALL:
            pending_count += 1
        if order.status in CANCELLED:
            cancelled_count += 1
        seen_slugs = set()
        for item in items:
            slug = item.get("product_slug") or item.get("sku") or "unknown"
            qty = int(item.get("quantity") or item.get("qty") or 1)
            units += qty
            products[slug]["qty"] += qty
            products[slug]["revenue"] += order.grand_total_mad or 0
            products[slug]["name_ar"] = SLUG_TO_NAME_AR.get(slug, slug)
            if slug not in seen_slugs:
                products[slug]["orders"] += 1
                seen_slugs.add(slug)

    click_rows = (
        _ma_events(db, start, end)
        .filter(Event.event_type == "page_view")
        .with_entities(Event.session_id, Event.created_at)
        .all()
    )
    seen_sessions: dict[str, set] = defaultdict(set)
    for session_id, created in click_rows:
        day = ma_date_key(created)
        key = session_id or f"anon-{id(created)}"
        if key not in seen_sessions[day]:
            seen_sessions[day].add(key)
            daily_clicks[day] += 1

    total_orders = len(orders)
    decided = confirmed_count + cancelled_count
    aov = round(gross / total_orders, 2) if total_orders else 0
    cvr = _pct(total_orders, clicks)
    confirmation_rate = _pct(confirmed_count, total_orders)
    confirmation_among_decided = _pct(confirmed_count, decided)
    delivery_rate = _pct(delivered_count, shipped_count)
    return_rate = _pct(returned_count, shipped_count)
    cancel_rate = _pct(cancelled_count, total_orders)
    upsell_rate = _pct(upsell_count, total_orders)
    crosssell_rate = _pct(crosssell_count, total_orders)
    repeat_customers = sum(1 for n in phones.values() if n > 1)

    economics = get_economics(db)
    assumed_conf = economics["assumed_confirmation_rate"] / 100.0
    assumed_deliv = economics["assumed_delivery_rate"] / 100.0
    conf_for_pl = _rate(confirmed_count, total_orders) if total_orders else assumed_conf
    deliv_for_pl = _rate(delivered_count, shipped_count) if shipped_count else assumed_deliv
    selling = economics["selling_price_mad"] or aov
    cogs = economics["product_cost_mad"]
    pack = economics["packaging_mad"]
    delivery_cost = economics["delivery_cost_mad"]
    return_cost = economics["return_cost_mad"]
    fee_pct = economics["cod_fee_pct"] / 100.0
    ads = economics["ad_spend_mad"]
    lead_cost = economics["lead_cost_mad"]
    space_fee = economics["space_seller_fee_mad"]
    upsell_fee = economics["upsell_cost_mad"]
    upsell_frac = _rate(upsell_count, total_orders)
    delivered_est = delivered_count if delivered_count else round(total_orders * conf_for_pl * deliv_for_pl, 2)
    lead_spend = total_orders * lead_cost + ads
    space_spend = delivered_est * space_fee
    upsell_spend = upsell_count * upsell_fee
    product_spend = delivered_est * (cogs + pack + delivery_cost)
    return_spend = returned_count * return_cost
    revenue = delivered_value or delivered_est * selling
    fee_spend = revenue * fee_pct
    profit = round(revenue - lead_spend - space_spend - upsell_spend - product_spend - return_spend - fee_spend, 2)

    net_per_delivered = selling - cogs - pack - delivery_cost - space_fee - (upsell_fee * upsell_frac) - (selling * fee_pct)
    expected_per_lead = (conf_for_pl * deliv_for_pl * net_per_delivered) - (
        conf_for_pl * (1 - deliv_for_pl) * return_cost
    )
    cvr_frac = _rate(total_orders, clicks)
    be_cpa = round(expected_per_lead, 2)
    be_cpc = round(expected_per_lead * cvr_frac, 2) if clicks else 0
    current_cpa = round(lead_cost or (ads / total_orders if total_orders and ads else 0), 2)
    current_cpc = round(lead_spend / clicks, 2) if clicks and lead_spend else 0
    margin_per_order = round(profit / delivered_est, 2) if delivered_est else None
    cost_per_delivered = (
        round((lead_spend + space_spend + upsell_spend + product_spend + return_spend + fee_spend) / delivered_est, 2)
        if delivered_est
        else 0
    )

    if selling > 0:
        if lead_cost <= be_cpa:
            verdict = "ok"
            verdict_ar = (
                f"راك OK دابا. أقصى Lead entered مسموح {be_cpa:.2f} درهم. "
                f"دابا كتخلّص {lead_cost:.2f} درهم."
            )
        else:
            verdict = "losing"
            verdict_ar = (
                f"ماشي OK دابا. Lead entered {lead_cost:.2f} فوق الـ break-even {be_cpa:.2f} درهم."
            )
    else:
        verdict = "fill_costs"
        verdict_ar = "حط سعر البيع والتأكيد والتسليم باش نحسبو شحال OK دابا."

    return {
        "range": {"from": days[0] if days else None, "to": days[-1] if days else None},
        "scope": "morocco_ip_only",
        "kpis": {
            "clicks": clicks,
            "page_views": page_views,
            "orders": total_orders,
            "cvr": cvr,
            "aov": aov,
            "gross_value": gross,
            "confirmed": confirmed_count,
            "confirmed_value": confirmed_value,
            "delivered": delivered_count,
            "delivered_value": delivered_value,
            "pending": pending_count,
            "cancelled": cancelled_count,
            "returned": returned_count,
            "confirmation_rate": confirmation_rate,
            "confirmation_among_decided": confirmation_among_decided,
            "delivery_rate": delivery_rate,
            "return_rate": return_rate,
            "cancel_rate": cancel_rate,
            "upsell_rate": upsell_rate,
            "upsell_count": upsell_count,
            "crosssell_count": crosssell_count,
            "crosssell_rate": crosssell_rate,
            "repeat_customers": repeat_customers,
            "units": units,
        },
        "funnel": {
            "clicks": unique_by_type["page_view"],
            "product_views": unique_by_type["product_view"],
            "offer_clicks": unique_by_type["offer_click"] or offer_clicks,
            "add_to_cart": unique_by_type["add_to_cart"] or add_to_carts,
            "checkout": unique_by_type["checkout_start"] or checkouts,
            "orders": total_orders,
        },
        "status_counts": status_counts,
        "daily": [
            {
                "date": day,
                "clicks": daily_clicks.get(day, 0),
                "orders": daily_orders.get(day, 0),
                "revenue": daily_revenue.get(day, 0),
            }
            for day in days
        ],
        "sources": sorted(
            [{"source": k, **v} for k, v in sources.items()],
            key=lambda x: x["orders"],
            reverse=True,
        )[:12],
        "products": sorted(
            [{"slug": k, **v} for k, v in products.items()],
            key=lambda x: x["qty"],
            reverse=True,
        ),
        "economics": {
            **economics,
            "selling_used": selling,
            "confirmation_used": round(conf_for_pl * 100, 2),
            "delivery_used": round(deliv_for_pl * 100, 2),
            "net_per_delivered": round(net_per_delivered, 2),
            "expected_per_lead": be_cpa,
            "break_even_cpa": be_cpa,
            "break_even_cpc": be_cpc,
            "current_cpa": current_cpa,
            "current_cpc": current_cpc,
            "profit": profit,
            "margin_per_order": margin_per_order,
            "lead_spend": round(lead_spend, 2),
            "space_spend": round(space_spend, 2),
            "upsell_spend": round(upsell_spend, 2),
            "product_spend": round(product_spend, 2),
            "revenue": round(revenue, 2),
            "cost_per_delivered": cost_per_delivered,
            "break_even_lead_cost": be_cpa,
            "delivered_est": delivered_est,
            "verdict": verdict,
            "verdict_ar": verdict_ar,
        },
    }


def list_orders(
    db: Session,
    date_from: str | None,
    date_to: str | None,
    status: str | None,
    q: str | None,
    morocco_only: bool,
    page: int,
    page_size: int,
) -> dict:
    start, end = range_bounds(date_from, date_to)
    query = db.query(Order).filter(Order.created_at >= start, Order.created_at < end)
    if morocco_only:
        query = query.filter(Order.is_morocco == true())
    if status:
        query = query.filter(Order.status == status)
    if q:
        term = f"%{q.strip().lower()}%"
        query = query.filter(
            or_(
                func.lower(Order.order_id).like(term),
                func.lower(Order.customer_name).like(term),
                func.lower(Order.customer_phone).like(term),
            )
        )
    total = query.count()
    page = max(1, page)
    page_size = min(100, max(10, page_size))
    rows = query.order_by(Order.created_at.desc()).offset((page - 1) * page_size).limit(page_size).all()
    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "orders": [_serialize_order(o) for o in rows],
    }


def get_order(db: Session, order_id: str) -> dict | None:
    row = db.query(Order).filter(Order.order_id == order_id).first()
    if not row:
        return None
    return _serialize_order(row)
