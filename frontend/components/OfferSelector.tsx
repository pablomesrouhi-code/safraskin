"use client";

import { ProductSlug, TIER_PRICES } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/money";
import { ShoppingBag } from "lucide-react";

export default function OfferSelector({ slug }: { slug: ProductSlug }) {
  const { addToCart, buyNow } = useCart();

  return (
    <div id="offer-selector" className="scroll-mt-header">
      <div className="rounded-2xl border border-border bg-white p-3 md:p-4">
        <p className="text-center text-sm font-bold text-ink">{formatPrice(TIER_PRICES[1])}</p>
        <p className="mt-0.5 text-center text-[11px] text-muted">علبة واحدة · الدفع عند الاستلام</p>
        <div className="mt-3 space-y-2">
          <button
            type="button"
            onClick={() => addToCart(slug, 1)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose py-2.5 text-sm font-bold text-rose hover:bg-rose/5"
          >
            <ShoppingBag size={16} aria-hidden />
            أضيفي للسلة
          </button>
          <button
            type="button"
            onClick={() => buyNow(slug, 1)}
            className="w-full rounded-xl bg-rose py-3 text-sm font-extrabold text-white shadow-md shadow-rose/25 hover:bg-rose-dark md:py-3.5 md:text-base"
          >
            اطلبي · الدفع عند الاستلام
          </button>
        </div>
      </div>
    </div>
  );
}
