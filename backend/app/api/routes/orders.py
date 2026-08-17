from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.order import CreateOrderIn
from app.services.orders import create_order
from app.services.pricing import PricingError

router = APIRouter()


@router.post("/orders")
def post_order(body: CreateOrderIn, db: Session = Depends(get_db)):
    try:
        return create_order(db, body)
    except PricingError as e:
        status = 502 if e.code == "SHEETS_SYNC_FAILED" else 400
        return JSONResponse(status_code=status, content={"detail": str(e), "code": e.code})