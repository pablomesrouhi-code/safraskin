from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.event import Event
from app.schemas.admin import EventIn
from app.services.geoip import is_bot, resolve_geo

router = APIRouter()

ALLOWED_EVENTS = {"page_view", "product_view", "add_to_cart", "checkout_start", "offer_click"}


@router.post("/events")
def post_event(body: EventIn, request: Request, db: Session = Depends(get_db)):
    event_type = (body.event_type or "").strip()
    if event_type not in ALLOWED_EVENTS:
        return {"ok": True, "ignored": True}
    ua = request.headers.get("user-agent") or ""
    if is_bot(ua):
        return {"ok": True, "ignored": True, "reason": "bot"}
    path = (body.path or "")[:240]
    if path.startswith("/admin") or path.startswith("/api"):
        return {"ok": True, "ignored": True}
    geo = resolve_geo(request, db)
    row = Event(
        event_type=event_type,
        session_id=(body.session_id or "")[:80] or None,
        path=path or None,
        product_slug=(body.product_slug or "")[:64] or None,
        referrer=(body.referrer or "")[:400] or None,
        utm_source=(body.utm_source or "")[:80] or None,
        utm_medium=(body.utm_medium or "")[:80] or None,
        utm_campaign=(body.utm_campaign or "")[:120] or None,
        ip_address=geo["ip_address"],
        ip_country=geo["ip_country"],
        is_morocco=geo["is_morocco"],
        user_agent=ua[:500] or None,
    )
    db.add(row)
    db.commit()
    return {"ok": True, "is_morocco": geo["is_morocco"]}
