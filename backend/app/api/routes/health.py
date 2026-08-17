from fastapi import APIRouter

from app.core.config import settings

router = APIRouter()


@router.get("/health")
def health():
    return {
        "ok": True,
        "sheets_configured": bool(settings.google_sheets_webhook_url.strip()),
        "db": settings.database_url.split("://")[0],
    }