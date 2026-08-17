TIER_PRICES = {1: 219, 2: 279, 3: 319}
UPSELL_PRICE_MAD = 120

SKU_TO_SLUG = {
    "SK482917CL": "clarelia",
    "SK739405FM": "femmelia",
    "SK156820CP": "capilys",
    "SK904371LM": "luminora",
    "SK618204P4": "pack-4",
    "SK275839P3": "pack-3",
    "SK-CLAR-01": "clarelia",
    "SK-FEMM-02": "femmelia",
    "SK-CAPI-03": "capilys",
    "SK-LUMI-04": "luminora",
    "SK-PACK-04": "pack-4",
    "SK-PACK-03": "pack-3",
}

SLUG_TO_SKU = {
    "clarelia": "SK482917CL",
    "femmelia": "SK739405FM",
    "capilys": "SK156820CP",
    "luminora": "SK904371LM",
    "pack-4": "SK618204P4",
    "pack-3": "SK275839P3",
}

SLUG_TO_NAME_AR = {
    "clarelia": "كريم تفتيح الوجه",
    "femmelia": "زيادة المناطق الأنثوية · 60 كبسولة",
    "capilys": "زيت تساقط الشعر · 60 مل",
    "luminora": "كولاجين بحري · 30 كبسولة",
    "pack-4": "الروتين الكامل",
    "pack-3": "روتين الوجه والشعر",
}

PACK_PRICES = {
    "SK618204P4": 699,
    "SK275839P3": 549,
    "SK-PACK-04": 699,
    "SK-PACK-03": 549,
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
        canonical = SLUG_TO_SKU[slug]
        line_items.append({"sku": canonical, "product_slug": slug, "quantity": qty})
        merchandise += PACK_PRICES.get(sku) or offer_price(qty)

    upsell_accepted = False
    normalized_upsell = None
    extra = 0
    if upsell_sku:
        incoming = upsell_sku.strip().upper()
        slug = SKU_TO_SLUG.get(incoming)
        if not slug or slug.startswith("pack-"):
            raise PricingError("منتج الإضافة غير صالح", "INVALID_UPSELL")
        if upsell_price is not None and upsell_price != UPSELL_PRICE_MAD:
            raise PricingError("سعر الإضافة غير صحيح", "PRICE_MISMATCH")
        upsell_accepted = True
        extra = UPSELL_PRICE_MAD
        normalized_upsell = SLUG_TO_SKU[slug]

    return {
        "line_items": line_items,
        "grand_total_mad": merchandise + extra,
        "upsell_accepted": upsell_accepted,
        "upsell_sku": normalized_upsell,
    }
