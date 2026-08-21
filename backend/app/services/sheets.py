import json
from datetime import datetime, timezone, timedelta
from urllib.parse import quote

import httpx

from app.core.config import settings
from app.services.phone import to_local_ma
from app.services.pricing import PACK_PRODUCT_SLUGS, SHEET_SKUS, SLUG_TO_NAME_AR, SLUG_TO_SKU


CASABLANCA = timezone(timedelta(hours=1))


def build_sheets_payload(
    order_id: str,
    name: str,
    phone_e164: str,
    line_items: list[dict],
    total: int,
    upsell_accepted: bool,
    upsell_sku: str | None,
    address: str = "",
) -> dict:
    lines = list(line_items)
    if upsell_accepted and upsell_sku:
        from app.services.pricing import SKU_TO_SLUG
        slug = SKU_TO_SLUG.get(upsell_sku)
        if slug:
            lines.append({"sku": upsell_sku, "product_slug": slug, "quantity": 1})

    now = datetime.now(CASABLANCA)
    sheet_lines: list[dict] = []
    for line in lines:
        slug = line["product_slug"]
        slugs = PACK_PRODUCT_SLUGS.get(slug, [slug])
        for product_slug in slugs:
            sheet_lines.append(
                {
                    "sku": SHEET_SKUS.get(product_slug) or SLUG_TO_SKU.get(product_slug, line["sku"]),
                    "qte": line["quantity"],
                    "note": SLUG_TO_NAME_AR.get(product_slug, product_slug),
                }
            )
    return {
        "date_order": now.strftime("%d/%m/%Y"),
        "full_name": name.strip(),
        "phone": to_local_ma(phone_e164),
        "address": (address or "").strip(),
        "sku": "/".join(l["sku"] for l in sheet_lines),
        "qte": "/".join(str(l["qte"]) for l in sheet_lines),
        "price": total,
        "note": " / ".join(l["note"] for l in sheet_lines),
        "delivery_note": "الدفع عند الاستلام",
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