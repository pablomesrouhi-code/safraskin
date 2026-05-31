"use client";

import ProductImage from "@/components/ProductImage";
import { Product, TIER_PRICES } from "@/data/products";
import { ProductSlug } from "@/data/products";

type Props = {
  products: Product[];
  onAdd: (slug: ProductSlug) => void;
  title?: string;
  subtitle?: string;
};

export default function CrossSellCards({
  products,
  onAdd,
  title = "قد يعجبك أيضاً",
  subtitle,
}: Props) {
  if (products.length === 0) return null;

  return (
    <div>
      <h2 className="font-bold text-lg mb-1">{title}</h2>
      {subtitle && <p className="text-sm text-gray-500 mb-4">{subtitle}</p>}
      {!subtitle && <div className="mb-4" />}
      <div className="grid sm:grid-cols-2 gap-4">
        {products.map((p) => (
          <button
            key={p.slug}
            onClick={() => onAdd(p.slug)}
            className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-white hover:border-sage hover:shadow-md transition-all text-right w-full"
          >
            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-cream shrink-0">
              <ProductImage src={p.image} alt={p.nameAr} fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-gray-900 truncate">{p.nameAr}</p>
              <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{p.shortDescriptionAr}</p>
            </div>
            <div className="shrink-0 text-left">
              <span className="text-sage font-bold">{TIER_PRICES[1]} ر.س</span>
              <p className="text-xs text-sage mt-1">+ أضيف</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
