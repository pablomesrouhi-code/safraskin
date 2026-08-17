from fastapi import APIRouter

from app.services.pricing import SKU_TO_SLUG, SLUG_TO_NAME_AR, TIER_PRICES, UPSELL_PRICE_MAD

router = APIRouter()


@router.get("/products")
def list_products():
    return {
        "tier_prices": TIER_PRICES,
        "upsell_price_mad": UPSELL_PRICE_MAD,
        "products": [
            {"sku": sku, "slug": slug, "name_ar": SLUG_TO_NAME_AR[slug]}
            for sku, slug in SKU_TO_SLUG.items()
        ],
    }