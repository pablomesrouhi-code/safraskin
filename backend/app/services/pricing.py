TIER_PRICES = {1: 219, 2: 279, 3: 319}
UPSELL_PRICE_MAD = 120

SKU_TO_SLUG = {
    "SK-CLAR-01": "clarelia",
    "SK-FEMM-02": "femmelia",
    "SK-CAPI-03": "capilys",
    "SK-LUMI-04": "luminora",
}

SLUG_TO_NAME_AR = {
    "clarelia": "كلاريليا",
    "femmelia": "فيميليا",
    "capilys": "كابيليس",
    "luminora": "لومينورا",
}


def offer_price(qty: int) -> int:
    if qty <= 0:
        return 0
    if qty == 1:
        return TIER_PRICES[1]
    if qty == 2:
        return TIER_PRICES[2]
    return TIER_PRICES[3]


class PricingError(ValueError):
    def __init__(self, message: str, code: str):
        super().__init__(message)
        self.code = code


def validate_and_price(items: list[dict], upsell_sku: str | None, upsell_price: int | None) -> dict:
    if not items:
        raise PricingError("السلة فارغة", "EMPTY_CART")

    line_items = []
    merchandise = 0
    for item in items:
        sku = (item.get("sku") or "").strip().upper()
        qty = int(item.get("qty") or 0)
        slug = SKU_TO_SLUG.get(sku)
        if not slug:
            raise PricingError(f"منتج غير معروف: {sku}", "INVALID_SKU")
        if qty < 1:
            raise PricingError("الكمية غير صالحة", "INVALID_QTY")
        line_items.append({"sku": sku, "product_slug": slug, "quantity": qty})
        merchandise += offer_price(qty)

    upsell_accepted = False
    normalized_upsell = None
    extra = 0
    if upsell_sku:
        normalized_upsell = upsell_sku.strip().upper()
        if normalized_upsell not in SKU_TO_SLUG:
            raise PricingError("منتج الإضافة غير صالح", "INVALID_UPSELL")
        if upsell_price is not None and upsell_price != UPSELL_PRICE_MAD:
            raise PricingError("سعر الإضافة غير صحيح", "PRICE_MISMATCH")
        upsell_accepted = True
        extra = UPSELL_PRICE_MAD

    return {
        "line_items": line_items,
        "grand_total_mad": merchandise + extra,
        "upsell_accepted": upsell_accepted,
        "upsell_sku": normalized_upsell,
    }