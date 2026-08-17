import { TIER_PRICES, type OfferQty } from "@/data/products";

export function getOfferPrice(qty: number): number {
  if (qty <= 0) return 0;
  if (qty === 1) return TIER_PRICES[1];
  if (qty === 2) return TIER_PRICES[2];
  return TIER_PRICES[3];
}

export function getLineSavings(qty: number): number {
  if (qty <= 1) return 0;
  return qty * TIER_PRICES[1] - getOfferPrice(qty);
}

export function getCartTotal(items: { qty: number }[]): number {
  return items.reduce((sum, item) => sum + getOfferPrice(item.qty), 0);
}

export function asOfferQty(qty: number): OfferQty {
  if (qty <= 1) return 1;
  if (qty === 2) return 2;
  return 3;
}
