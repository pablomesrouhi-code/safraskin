from datetime import datetime, timedelta, timezone
import hmac
import time
from collections import defaultdict

from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt

from app.core.config import settings

_bearer = HTTPBearer(auto_error=False)
_login_hits: dict[str, list[float]] = defaultdict(list)


def check_login_rate(ip: str, limit: int = 12, window_s: int = 900) -> None:
    now = time.time()
    hits = [t for t in _login_hits[ip] if now - t < window_s]
    _login_hits[ip] = hits
    if len(hits) >= limit:
        raise HTTPException(status_code=429, detail="بزاف ديال المحاولات. عاود من بعد.")
    hits.append(now)


def verify_admin_credentials(username: str, password: str) -> bool:
    user_ok = hmac.compare_digest((username or "").strip(), settings.admin_username.strip())
    pass_ok = hmac.compare_digest(password or "", settings.admin_password)
    return user_ok and pass_ok


def create_token(username: str) -> str:
    exp = datetime.now(timezone.utc) + timedelta(hours=max(1, settings.admin_jwt_expire_hours))
    return jwt.encode(
        {"sub": username, "role": "admin", "exp": exp},
        settings.jwt_secret,
        algorithm="HS256",
    )


def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, settings.jwt_secret, algorithms=["HS256"])
    except JWTError as exc:
        raise HTTPException(status_code=401, detail="جلسة منتهية. سجل الدخول من جديد.") from exc


def require_admin(creds: HTTPAuthorizationCredentials | None = Depends(_bearer)) -> str:
    if creds is None or creds.scheme.lower() != "bearer" or not creds.credentials:
        raise HTTPException(status_code=401, detail="تسجيل الدخول مطلوب")
    payload = decode_token(creds.credentials)
    if payload.get("role") != "admin":
        raise HTTPException(status_code=401, detail="غير مصرح")
    return str(payload.get("sub") or settings.admin_username)
