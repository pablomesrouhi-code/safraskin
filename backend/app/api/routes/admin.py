from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy.orm import Session

from app.core.auth import check_login_rate, create_token, require_admin, verify_admin_credentials
from app.core.config import settings
from app.core.database import get_db
from app.core.dates import now_ma
from app.models.order import Order
from app.schemas.admin import EconomicsIn, LoginIn, OrderStatusIn
from app.services.geoip import client_ip
from app.services.metrics import dashboard_metrics, get_economics, get_order, list_orders, save_economics
from app.services.order_status import STATUS_LABELS_AR, STATUSES, is_valid_status

router = APIRouter()


@router.post("/admin/login")
def login(body: LoginIn, request: Request):
    check_login_rate(client_ip(request) or "unknown")
    if not verify_admin_credentials(body.username, body.password):
        raise HTTPException(status_code=401, detail="السمية أو كلمة السر غالطين")
    token = create_token(settings.admin_username)
    return {
        "token": token,
        "expires_hours": settings.admin_jwt_expire_hours,
        "username": settings.admin_username,
    }


@router.get("/admin/me")
def me(_user: str = Depends(require_admin)):
    return {"ok": True, "username": _user}


@router.get("/admin/metrics")
def metrics(
    date_from: str | None = Query(default=None, alias="from"),
    date_to: str | None = Query(default=None, alias="to"),
    db: Session = Depends(get_db),
    _user: str = Depends(require_admin),
):
    return dashboard_metrics(db, date_from, date_to)


@router.get("/admin/orders")
def orders(
    date_from: str | None = Query(default=None, alias="from"),
    date_to: str | None = Query(default=None, alias="to"),
    status: str | None = None,
    q: str | None = None,
    morocco_only: bool = True,
    page: int = 1,
    page_size: int = 40,
    db: Session = Depends(get_db),
    _user: str = Depends(require_admin),
):
    return list_orders(db, date_from, date_to, status, q, morocco_only, page, page_size)


@router.get("/admin/orders/{order_id}")
def order_detail(order_id: str, db: Session = Depends(get_db), _user: str = Depends(require_admin)):
    row = get_order(db, order_id)
    if not row:
        raise HTTPException(status_code=404, detail="الطلب ما كاينش")
    return row


@router.patch("/admin/orders/{order_id}")
def update_order(
    order_id: str,
    body: OrderStatusIn,
    db: Session = Depends(get_db),
    _user: str = Depends(require_admin),
):
    row = db.query(Order).filter(Order.order_id == order_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="الطلب ما كاينش")
    if body.status is not None:
        if not is_valid_status(body.status):
            raise HTTPException(status_code=400, detail="حالة غير صالحة")
        row.status = body.status
        row.status_updated_at = datetime.utcnow()
    if body.notes is not None:
        row.notes = body.notes[:4000]
    db.commit()
    db.refresh(row)
    return get_order(db, order_id)


@router.get("/admin/settings")
def read_settings(db: Session = Depends(get_db), _user: str = Depends(require_admin)):
    return {
        "economics": get_economics(db),
        "statuses": [{"id": s, "label": STATUS_LABELS_AR[s]} for s in STATUSES],
        "today": now_ma().strftime("%Y-%m-%d"),
    }


@router.put("/admin/settings")
def write_settings(body: EconomicsIn, db: Session = Depends(get_db), _user: str = Depends(require_admin)):
    return {"economics": save_economics(db, body.model_dump())}
