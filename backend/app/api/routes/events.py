from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.request_ip import client_ip_from_request
from app.schemas.tracking import TrackEventRequest
from app.services.tracking import record_event

router = APIRouter(prefix="/api/v1", tags=["events"])


@router.post("/events")
def track_event(
    payload: TrackEventRequest,
    request: Request,
    db: Session = Depends(get_db),
) -> dict:
    client_ip = client_ip_from_request(request)
    user_agent = request.headers.get("user-agent")
    event = record_event(db, payload, client_ip=client_ip, user_agent=user_agent)
    return {"ok": True, "valid": event.is_valid_traffic}
