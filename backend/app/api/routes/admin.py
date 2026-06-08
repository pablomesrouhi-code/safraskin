from datetime import date, timedelta

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, select
from sqlalchemy.orm import Session, joinedload

from app.core.admin_auth import create_admin_token, require_admin, verify_admin_credentials
from app.core.config import settings
from app.core.database import get_db
from app.models.order import Order
from app.schemas.admin import (
    AdminLoginRequest,
    AdminLoginResponse,
    MetricsResponse,
    OrderDetailOut,
    OrderItemOut,
    OrderListItem,
    OrdersListResponse,
    OrderStatusUpdate,
)
from app.services.admin_metrics import get_metrics
from app.services.pricing import SLUG_TO_NAME_AR

router = APIRouter(prefix="/api/v1/admin", tags=["admin"])


@router.post("/login", response_model=AdminLoginResponse)
def admin_login(payload: AdminLoginRequest) -> AdminLoginResponse:
    if not settings.admin_enabled:
        raise HTTPException(status_code=503, detail="Admin not configured on server")
    if not verify_admin_credentials(payload.username, payload.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return AdminLoginResponse(
        token=create_admin_token(payload.username),
        username=payload.username,
    )


@router.get("/metrics", response_model=MetricsResponse)
def admin_metrics(
    date_from: date | None = Query(default=None),
    date_to: date | None = Query(default=None),
    _admin: str = Depends(require_admin),
    db: Session = Depends(get_db),
) -> MetricsResponse:
    today = date.today()
    d_from = date_from or (today - timedelta(days=30))
    d_to = date_to or today
    if d_from > d_to:
        raise HTTPException(status_code=400, detail="date_from must be <= date_to")
    return get_metrics(db, d_from, d_to)


@router.get("/orders", response_model=OrdersListResponse)
def admin_list_orders(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    status: str | None = None,
    date_from: date | None = None,
    date_to: date | None = None,
    valid_only: bool | None = None,
    search: str | None = None,
    _admin: str = Depends(require_admin),
    db: Session = Depends(get_db),
) -> OrdersListResponse:
    q = select(Order).options(joinedload(Order.items))
    count_q = select(func.count()).select_from(Order)

    if search:
        pattern = f"%{search.strip()}%"
        filt = (
            Order.order_number.ilike(pattern)
            | Order.customer_name.ilike(pattern)
            | Order.customer_phone.ilike(pattern)
        )
        q = q.where(filt)
        count_q = count_q.where(filt)

    if status:
        q = q.where(Order.status == status)
        count_q = count_q.where(Order.status == status)
    if date_from:
        q = q.where(func.date(Order.created_at) >= date_from)
        count_q = count_q.where(func.date(Order.created_at) >= date_from)
    if date_to:
        q = q.where(func.date(Order.created_at) <= date_to)
        count_q = count_q.where(func.date(Order.created_at) <= date_to)
    if valid_only is True:
        q = q.where(Order.is_valid_traffic.is_(True))
        count_q = count_q.where(Order.is_valid_traffic.is_(True))

    total = db.scalar(count_q) or 0
    orders = (
        db.scalars(
            q.order_by(Order.created_at.desc())
            .offset((page - 1) * page_size)
            .limit(page_size)
        )
        .unique()
        .all()
    )

    items = [
        OrderListItem(
            id=o.id,
            order_number=o.order_number,
            customer_name=o.customer_name,
            customer_phone_display=o.customer_phone_display,
            grand_total_sar=o.grand_total_sar,
            status=o.status,
            is_valid_traffic=o.is_valid_traffic,
            sheets_synced=o.sheets_synced,
            created_at=o.created_at,
            item_count=len(o.items),
        )
        for o in orders
    ]
    return OrdersListResponse(items=items, total=total, page=page, page_size=page_size)


@router.get("/orders/{order_id}", response_model=OrderDetailOut)
def admin_order_detail(
    order_id: str,
    _admin: str = Depends(require_admin),
    db: Session = Depends(get_db),
) -> OrderDetailOut:
    order = db.scalars(
        select(Order).options(joinedload(Order.items)).where(
            (Order.id == order_id) | (Order.order_number == order_id)
        )
    ).unique().first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    return OrderDetailOut(
        id=order.id,
        order_number=order.order_number,
        customer_name=order.customer_name,
        customer_phone=order.customer_phone,
        customer_phone_display=order.customer_phone_display,
        tier_count=order.tier_count,
        tier_total_sar=order.tier_total_sar,
        upsell_accepted=order.upsell_accepted,
        upsell_sku=order.upsell_sku,
        upsell_price_sar=order.upsell_price_sar,
        grand_total_sar=order.grand_total_sar,
        payment_method=order.payment_method,
        status=order.status,
        sheets_synced=order.sheets_synced,
        client_ip=order.client_ip,
        country_code=order.country_code,
        country_name=order.country_name,
        is_vpn=order.is_vpn,
        is_proxy=order.is_proxy,
        is_hosting=order.is_hosting,
        is_valid_traffic=order.is_valid_traffic,
        utm_source=order.utm_source,
        utm_medium=order.utm_medium,
        utm_campaign=order.utm_campaign,
        admin_notes=order.admin_notes,
        created_at=order.created_at,
        items=[
            OrderItemOut(
                product_slug=i.product_slug,
                sku=i.sku,
                quantity=i.quantity,
                name_ar=SLUG_TO_NAME_AR.get(i.product_slug, i.product_slug),
            )
            for i in order.items
        ],
    )


@router.patch("/orders/{order_id}", response_model=OrderDetailOut)
def admin_update_order(
    order_id: str,
    payload: OrderStatusUpdate,
    _admin: str = Depends(require_admin),
    db: Session = Depends(get_db),
) -> OrderDetailOut:
    order = db.scalars(
        select(Order).options(joinedload(Order.items)).where(
            (Order.id == order_id) | (Order.order_number == order_id)
        )
    ).unique().first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    order.status = payload.status
    if payload.admin_notes is not None:
        order.admin_notes = payload.admin_notes
    db.commit()
    db.refresh(order)
    return admin_order_detail(order_id, _admin=_admin, db=db)
