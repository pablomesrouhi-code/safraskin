from contextlib import asynccontextmanager
import time

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.routes.health import router as health_router
from app.api.routes.orders import router as orders_router
from app.api.routes.products import router as products_router
from app.core.config import settings
from app.core.database import Base, engine
from app.models import order as _order_model  # noqa: F401
from app.services.pricing import PricingError


@asynccontextmanager
async def lifespan(_app: FastAPI):
    if settings.database_url_valid:
        for _ in range(20):
            try:
                Base.metadata.create_all(bind=engine)
                break
            except Exception:
                time.sleep(2)
    yield


app = FastAPI(title="Safraskin API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(PricingError)
async def pricing_handler(_request: Request, exc: PricingError):
    return JSONResponse(status_code=400, content={"detail": str(exc), "code": exc.code})


app.include_router(health_router, prefix="/api/v1")
app.include_router(orders_router, prefix="/api/v1")
app.include_router(products_router, prefix="/api/v1")


@app.get("/")
def root():
    return {"service": "safraskin-api", "ok": True}


@app.get("/health")
def easypanel_health():
    """Always 200 so EasyPanel keeps the container in rotation."""
    return {
        "ok": True,
        "status": "ok" if settings.database_url_valid else "degraded",
        "service": "safraskin-api",
        "app": "safraskin-morocco",
        "database": settings.database_url_valid,
        "sheets_webhook_configured": bool(settings.google_sheets_webhook_url.strip()),
        "sheets_webhook_hint": None
        if settings.google_sheets_webhook_url.strip()
        else "Set GOOGLE_SHEETS_WEBHOOK_URL",
        "order_number_prefix": settings.order_number_prefix,
    }


@app.get("/ready")
def ready():
    return {
        "ok": settings.database_url_valid,
        "database_url_valid": settings.database_url_valid,
    }