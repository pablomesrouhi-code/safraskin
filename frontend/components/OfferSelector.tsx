"use client";

import { ProductSlug, TIER_PRICES } from "@/data/products";
import { useCart } from "@/context/CartContext";
import clsx from "clsx";
import { useState } from "react";

const UNIT = TIER_PRICES[1];

const OFFERS = [
  { qty: 1 as const, price: TIER_PRICES[1], badge: null, savings: null },
  { qty: 2 as const, price: TIER_PRICES[2], badge: "وفّري", savings: 119 },
  { qty: 3 as const, price: TIER_PRICES[3], badge: "الأفضل", savings: 248 },
] as const;

export default function OfferSelector({ slug }: { slug: ProductSlug }) {
  const [selected, setSelected] = useState<1 | 2 | 3>(2);
  const { addToCart } = useCart();
  const active = OFFERS.find((o) => o.qty === selected)!;

  return (
    <div className="space-y-4">
      <p className="font-semibold text-gray-900">اختاري العرض:</p>

      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {OFFERS.map((offer) => {
          const isSelected = selected === offer.qty;
          const compareAt = UNIT * offer.qty;

          return (
            <button
              key={offer.qty}
              type="button"
              onClick={() => setSelected(offer.qty)}
              className={clsx(
                "relative flex flex-col items-center rounded-2xl border-2 p-2.5 sm:p-3 transition-all",
                isSelected
                  ? "border-sage bg-sage/8 shadow-md ring-2 ring-sage/25"
                  : "border-border bg-white hover:border-sage/35"
              )}
            >
              {offer.badge && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gold text-sage-dark text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                  {offer.badge}
                </span>
              )}

              <span className="text-[11px] sm:text-xs font-semibold text-gray-600 mt-1 mb-2">
                {offer.qty === 1 ? "قطعة" : `${offer.qty} قطع`}
              </span>

              <div
                className={clsx(
                  "w-full rounded-xl px-1 py-2.5 text-center",
                  isSelected ? "bg-sage text-white" : "bg-sage/8"
                )}
              >
                {offer.savings != null && (
                  <span
                    className={clsx(
                      "block text-[10px] line-through tabular-nums leading-none mb-1",
                      isSelected ? "text-white/65" : "text-gray-400"
                    )}
                  >
                    {compareAt}
                  </span>
                )}
                <span
                  className={clsx(
                    "block text-lg sm:text-2xl font-bold tabular-nums leading-none",
                    isSelected ? "text-white" : "text-sage"
                  )}
                >
                  {offer.price}
                </span>
                <span
                  className={clsx(
                    "block text-[10px] font-semibold mt-0.5",
                    isSelected ? "text-white/90" : "text-sage/80"
                  )}
                >
                  ر.س
                </span>
              </div>

              {offer.savings != null && (
                <span className="text-[9px] sm:text-[10px] font-bold text-scarcity mt-2">
                  -{offer.savings} ر.س
                </span>
              )}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => addToCart(slug, selected)}
        className="w-full bg-sage hover:bg-sage-dark text-white font-bold py-4 rounded-xl transition-colors text-lg"
      >
        أضيفي للسلة — {active.price} ر.س
      </button>

      <p className="text-center text-sm text-gray-500">✓ الدفع عند الاستلام · ✓ تغليف سري</p>
    </div>
  );
}
