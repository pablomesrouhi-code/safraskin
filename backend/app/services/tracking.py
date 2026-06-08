from sqlalchemy.orm import Session

from app.models.tracking import TrackingEvent
from app.schemas.tracking import TrackEventRequest
from app.services.fraud import analyze_ip


def record_event(
    db: Session,
    payload: TrackEventRequest,
    *,
    client_ip: str | None,
    user_agent: str | None,
) -> TrackingEvent:
    fraud = analyze_ip(client_ip)
    event = TrackingEvent(
        event_type=payload.event_type,
        session_id=payload.session_id,
        path=payload.path,
        product_slug=payload.product_slug,
        client_ip=client_ip,
        country_code=fraud["country_code"],
        country_name=fraud["country_name"],
        is_vpn=fraud["is_vpn"],
        is_proxy=fraud["is_proxy"],
        is_hosting=fraud["is_hosting"],
        is_valid_traffic=fraud["is_valid_traffic"],
        utm_source=payload.utm_source,
        utm_medium=payload.utm_medium,
        utm_campaign=payload.utm_campaign,
        referrer=payload.referrer,
        user_agent=(user_agent or "")[:500] or None,
    )
    db.add(event)
    db.commit()
    db.refresh(event)
    return event
