import hashlib
import hmac
import json
import secrets
import time
from base64 import urlsafe_b64decode, urlsafe_b64encode

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.config import settings

_bearer = HTTPBearer(auto_error=False)


def _b64_encode(data: bytes) -> str:
    return urlsafe_b64encode(data).decode().rstrip("=")


def _b64_decode(data: str) -> bytes:
    pad = "=" * (-len(data) % 4)
    return urlsafe_b64decode(data + pad)


def create_admin_token(username: str) -> str:
    payload = {
        "sub": username,
        "exp": int(time.time()) + settings.ADMIN_JWT_EXPIRE_HOURS * 3600,
        "nonce": secrets.token_hex(8),
    }
    body = _b64_encode(json.dumps(payload, separators=(",", ":")).encode())
    sig = hmac.new(
        settings.admin_jwt_secret.encode(),
        body.encode(),
        hashlib.sha256,
    ).hexdigest()
    return f"{body}.{sig}"


def verify_admin_token(token: str) -> str | None:
    try:
        body, sig = token.rsplit(".", 1)
        expected = hmac.new(
            settings.admin_jwt_secret.encode(),
            body.encode(),
            hashlib.sha256,
        ).hexdigest()
        if not hmac.compare_digest(sig, expected):
            return None
        payload = json.loads(_b64_decode(body))
        if payload.get("exp", 0) < time.time():
            return None
        return payload.get("sub")
    except Exception:
        return None


def verify_admin_credentials(username: str, password: str) -> bool:
    if not settings.admin_enabled:
        return False
    return (
        secrets.compare_digest(username, settings.ADMIN_USERNAME)
        and secrets.compare_digest(password, settings.ADMIN_PASSWORD)
    )


def require_admin(
    creds: HTTPAuthorizationCredentials | None = Depends(_bearer),
) -> str:
    if not settings.admin_enabled:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Admin not configured",
        )
    if not creds or creds.scheme.lower() != "bearer":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
    user = verify_admin_token(creds.credentials)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    return user
