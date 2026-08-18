from fastapi import APIRouter

from app.services.pricing import (
    FEMMELIA_TIER_PRICES,
    SLUG_TO_NAME_AR,
    SLUG_TO_SKU,
    TIER_PRICES,
    UPSELL_PRICE_MAD,
)

router = APIRouter()


@router.get("/products")
def list_products():
    return {
        "tier_prices": TIER_PRICES,
        "femmelia_tier_prices": FEMMELIA_TIER_PRICES,
        "upsell_price_mad": UPSELL_PRICE_MAD,
        "products": [
            {"sku": sku, "slug": slug, "name_ar": SLUG_TO_NAME_AR[slug]}
            for slug, sku in SLUG_TO_SKU.items()
        ],
    }