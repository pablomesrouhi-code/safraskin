import json
from datetime import datetime, timezone, timedelta
from urllib.parse import quote

import httpx

from app.core.config import settings
from app.services.pricing import SLUG_TO_NAME_AR


CASABLANCA = timezone(timedelta(hours=1))


def build_sheets_payload(order_id: str, name: str, phone_e164: str, line_items: list[dict], total: int, upsell_accepted: bool, upsell_sku: str | None) -> dict:
    lines = list(line_items)
    if upsell_accepted and upsell_sku:
        slug = None
        from app.services.pricing import SKU_TO_SLUG
        slug = SKU_TO_SLUG.get(upsell_sku)
        if slug:
            lines.append({"sku": upsell_sku, "product_slug": slug, "quantity": 1})

    now = datetime.now(CASABLANCA)
    return {
        "date": now.strftime("%d/%m/%Y"),
        "orderid": order_id,
        "country": "MA",
        "name": name.strip(),
        "phone": phone_e164.replace("+", ""),
        "product": "/".join(SLUG_TO_NAME_AR.get(l["product_slug"], l["product_slug"]) for l in lines),
        "sku": "/".join(l["sku"] for l in lines),
        "quantity": "/".join(str(l["quantity"]) for l in lines),
        "total_price": total,
        "currency": "MAD",
        "status": "",
    }


def _parse_response(text: str) -> tuple[bool, str | None]:
    trimmed = (text or "").strip()
    if not trimmed:
        return False, "Empty response from Google Apps Script"
    if trimmed.startswith("<"):
        return False, "Got HTML — redeploy Apps Script (Anyone) and use /exec URL"
    try:
        result = json.loads(trimmed)
        if not result.get("success"):
            return False, str(result.get("error") or result)
        return True, None
    except json.JSONDecodeError:
        return False, f"Invalid JSON: {trimmed[:200]}"


def sync_order_to_sheets(payload: dict) -> tuple[bool, str | None]:
    url = (settings.google_sheets_webhook_url or "").strip()
    if not url:
        return False, "GOOGLE_SHEETS_WEBHOOK_URL not set"
    if "docs.google.com/spreadsheets" in url:
        return False, "Wrong URL: use Apps Script /exec URL, not the Sheet link"
    if "script.google.com/macros" not in url:
        return False, "Wrong URL: must be script.google.com/macros/s/.../exec"
    exec_url = url.replace("/dev", "/exec") if url.rstrip("/").endswith("/dev") else url
    body = json.dumps(payload)
    last_error = "Unknown error"
    try:
        get_url = f"{exec_url}?payload={quote(body)}"
        with httpx.Client(follow_redirects=True, timeout=20) as client:
            res = client.get(get_url)
        ok, err = _parse_response(res.text)
        if ok:
            return True, None
        last_error = f"GET: {err}"
    except Exception as e:
        last_error = f"GET: {e}"
    try:
        with httpx.Client(follow_redirects=True, timeout=20) as client:
            res = client.post(exec_url, data={"payload": body})
        ok, err = _parse_response(res.text)
        if ok:
            return True, None
        last_error = f"POST: {err}"
    except Exception as e:
        last_error = f"POST: {e}"
    return False, last_error