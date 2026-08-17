import { ProductSlug, PRODUCTS } from "@/data/products";

export function getCrossSells(cartSlugs: ProductSlug[]) {
  const inCart = new Set(cartSlugs);
  return PRODUCTS.filter((p) => !inCart.has(p.slug));
}

export function getUpsellSlug(cartSlugs: ProductSlug[]): ProductSlug | null {
  const unique = Array.from(new Set(cartSlugs));
  if (!unique.length) return null;

  const inCart = new Set(unique);
  const first = PRODUCTS.find((p) => inCart.has(p.slug));
  if (!first) return null;

  if (!inCart.has(first.upsellAffinity)) return first.upsellAffinity;

  const fallback = PRODUCTS.find((p) => !inCart.has(p.slug));
  return fallback?.slug ?? first.upsellAffinity;
}
