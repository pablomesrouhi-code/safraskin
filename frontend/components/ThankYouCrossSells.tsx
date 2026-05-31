"use client";

import { PRODUCTS, ProductSlug } from "@/data/products";
import CrossSellCards from "@/components/CrossSellCards";
import { useCart } from "@/context/CartContext";

type Props = {
  excludeSlugs?: ProductSlug[];
  upsellSlug?: ProductSlug;
};

export default function ThankYouCrossSells({ excludeSlugs = [], upsellSlug }: Props) {
  const { addSlug, openDrawer } = useCart();

  const excluded = new Set<ProductSlug>([
    ...excludeSlugs,
    ...(upsellSlug ? [upsellSlug] : []),
  ]);

  const suggestions = PRODUCTS.filter((p) => !excluded.has(p.slug));

  if (suggestions.length === 0) return null;

  const handleAdd = (slug: ProductSlug) => {
    addSlug(slug);
    openDrawer();
  };

  return (
    <CrossSellCards
      products={suggestions}
      onAdd={handleAdd}
      title="أكملي بروتوكولك — طلب جديد"
      subtitle="أضيفي منتجاً آخر بـ 199 ر.س — COD · نفس سهولة الطلب"
    />
  );
}
