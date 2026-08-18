import { getTierPrices, type OfferQty, type ProductSlug } from "@/data/products";
import { getPack, isPackId } from "@/data/packs";

export function getOfferPrice(slug: ProductSlug, qty: number): number {
  const prices = getTierPrices(slug);
  if (qty <= 0) return 0;
  if (qty === 1) return prices[1];
  if (qty === 2) return prices[2];
  return prices[3];
}

export function getLinePrice(item: { slug: string; qty: number }): number {
  const pack = getPack(item.slug);
  if (pack) return pack.price;
  return getOfferPrice(item.slug as ProductSlug, item.qty);
}

export function getCartTotal(items: { slug: string; qty: number }[]): number {
  return items.reduce((sum, item) => sum + getLinePrice(item), 0);
}

export function asOfferQty(qty: number): OfferQty {
  if (qty <= 1) return 1;
  if (qty === 2) return 2;
  return 3;
}

export function cartHasPack(items: { slug: string }[]): boolean {
  return items.some((item) => isPackId(item.slug));
}
