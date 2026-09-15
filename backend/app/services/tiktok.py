import hashlib
import time
import json
from typing import Any

import httpx

from app.core.config import settings


def sha256_hex(value: str) -> str:
    return hashlib.sha256((value or "").strip().lower().encode("utf-8")).hexdigest()


def build_purchase_payload(pixel_id: str, event_id: str, value: int, currency: str = "MAD", phone: str | None = None, items: Any = None) -> dict:
    payload = {
        "pixel_code": pixel_id,
        "event": "Purchase",
        "timestamp": int(time.time()),
        "event_id": event_id,
        "properties": {
            "value": value,
            "currency": currency,
        },
    }
    if items:
        try:
            payload["properties"]["contents"] = items
        except Exception:
            pass
    if phone:
        payload["user"] = {"phone_number": sha256_hex(phone)}
    return payload


def send_purchase_event(pixel_id: str, access_token: str, event_id: str, value: int, currency: str = "MAD", phone: str | None = None, items: Any = None) -> dict:
    if not pixel_id or not access_token:
        return {"ok": False, "reason": "missing_credentials"}

    url = "https://business-api.tiktok.com/open_api/v1.2/pixel/track/"
    payload = build_purchase_payload(pixel_id, event_id, value, currency=currency, phone=phone, items=items)
    params = {"access_token": access_token}

    try:
        resp = httpx.post(url, params=params, json=payload, timeout=10)
        try:
            data = resp.json()
        except Exception:
            data = {"status_code": resp.status_code, "text": resp.text}
        return {"ok": resp.status_code == 200, "status_code": resp.status_code, "data": data}
    except Exception as e:
        return {"ok": False, "error": str(e)}
