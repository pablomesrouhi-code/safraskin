import { ProductSlug, PRODUCTS } from "@/data/products";
import { isPackId } from "@/data/packs";

export function getCrossSells(cartSlugs: ProductSlug[]) {
  const inCart = new Set(cartSlugs);
  return PRODUCTS.filter((p) => !inCart.has(p.slug));
}

export function getUpsellSlug(cartSlugs: string[]): ProductSlug | null {
  if (cartSlugs.some((slug) => isPackId(slug))) return null;

  const unique = Array.from(new Set(cartSlugs)) as ProductSlug[];
  if (!unique.length) return null;

  const inCart = new Set(unique);
  const first = PRODUCTS.find((p) => inCart.has(p.slug));
  if (!first) return null;

  if (!inCart.has(first.upsellAffinity)) return first.upsellAffinity;

  const fallback = PRODUCTS.find((p) => !inCart.has(p.slug));
  return fallback?.slug ?? first.upsellAffinity;
}
