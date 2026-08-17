import json
import random
import string

from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.order import Order
from app.services.phone import is_valid_ma_phone, to_e164
from app.services.pricing import PricingError, validate_and_price
from app.services.sheets import build_sheets_payload, sync_order_to_sheets


def generate_order_id() -> str:
    prefix = settings.order_number_prefix or "nama"
    suffix = "".join(random.choice(string.ascii_lowercase + string.digits) for _ in range(8))
    return f"{prefix}{suffix}"


def create_order(db: Session, body) -> dict:
    name = (body.customer_name or "").strip()
    if len(name) < 2:
        raise PricingError("السمية مطلوبة", "VALIDATION_ERROR")
    if not is_valid_ma_phone(body.customer_phone):
        raise PricingError("رقم التيليفون المغربي غير صالح", "INVALID_PHONE")

    priced = validate_and_price(
        [{"sku": i.sku, "qty": i.qty} for i in body.items],
        body.upsell_sku,
        body.upsell_price_mad if body.upsell_price_mad is not None else body.upsell_price_sar,
    )
    order_id = generate_order_id()
    phone = to_e164(body.customer_phone)

    row = Order(
        order_id=order_id,
        customer_name=name,
        customer_phone=phone,
        items_json=json.dumps(priced["line_items"], ensure_ascii=False),
        grand_total_mad=priced["grand_total_mad"],
        upsell_accepted=priced["upsell_accepted"],
        upsell_sku=priced["upsell_sku"],
        utm_source=body.utm_source,
        utm_medium=body.utm_medium,
        utm_campaign=body.utm_campaign,
        session_id=body.session_id,
        sheets_synced=False,
    )
    db.add(row)
    db.commit()

    synced, sync_error = False, None
    if settings.google_sheets_webhook_url.strip():
        payload = build_sheets_payload(
            order_id,
            name,
            phone,
            priced["line_items"],
            priced["grand_total_mad"],
            priced["upsell_accepted"],
            priced["upsell_sku"],
        )
        synced, sync_error = sync_order_to_sheets(payload)
        if synced:
            row.sheets_synced = True
            db.commit()
        else:
            raise PricingError("ما قدرناش نسجلو الطلب. عاودي من بعد.", "SHEETS_SYNC_FAILED")

    return {
        "order_id": order_id,
        "grand_total_mad": priced["grand_total_mad"],
        "grand_total_sar": priced["grand_total_mad"],
        "upsell_total_mad": 120 if priced["upsell_accepted"] else 0,
        "status": "pending_confirmation",
        "thank_you_path": f"/thank-you/{order_id}",
        "sheets_synced": bool(synced),
        "sheets_sync_error": sync_error,
    }
