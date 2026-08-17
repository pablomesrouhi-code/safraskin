from fastapi import APIRouter

from app.core.config import settings

router = APIRouter()


@router.get("/health")
def health():
    scheme = (settings.database_url.split("://")[0] if "://" in settings.database_url else "unknown")
    hint = None
    if not settings.database_url_valid:
        hint = "DATABASE_URL must be postgres://user:pass@safraskin_database:5432/database — not the pgweb https link"
    return {
        "ok": True,
        "database_url_valid": settings.database_url_valid,
        "sheets_configured": bool(settings.google_sheets_webhook_url.strip()),
        "db": scheme,
        "hint": hint,
    }
