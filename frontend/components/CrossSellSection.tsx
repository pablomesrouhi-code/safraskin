"use client";

import { useCart } from "@/context/CartContext";
import { getCrossSells } from "@/lib/upsell";
import CrossSellCards from "@/components/CrossSellCards";

export default function CrossSellSection() {
  const { cartSlugs, addSlug, openDrawer } = useCart();
  const crossSells = getCrossSells(cartSlugs);

  if (crossSells.length === 0) return null;

  return (
    <section className="py-16 bg-cream">
      <div className="max-w-container mx-auto px-4">
        <CrossSellCards
          products={crossSells}
          onAdd={(slug) => {
            addSlug(slug);
            openDrawer();
          }}
          title="أكملي بروتوكول ثقتك"
        />
        <p className="text-sm text-gray-500 text-center mt-6">
          كل منتج 199 ر.س — الباقة 279 أو 349 ر.س
        </p>
      </div>
    </section>
  );
}
