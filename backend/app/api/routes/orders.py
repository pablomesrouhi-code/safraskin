from fastapi import APIRouter, Depends, Request
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.order import CreateOrderIn
from app.services.geoip import resolve_geo
from app.services.orders import create_order
from app.services.pricing import PricingError

router = APIRouter()


@router.post("/orders")
def post_order(body: CreateOrderIn, request: Request, db: Session = Depends(get_db)):
    try:
        geo = resolve_geo(request, db)
        return create_order(db, body, geo=geo)
    except PricingError as e:
        status = 502 if e.code == "SHEETS_SYNC_FAILED" else 400
        return JSONResponse(status_code=status, content={"detail": str(e), "code": e.code})
