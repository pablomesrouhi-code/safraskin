"use client";

import { ProductSlug, TIER_PRICES } from "@/data/products";
import { useCart } from "@/context/CartContext";
import clsx from "clsx";
import { useState } from "react";

const UNIT = TIER_PRICES[1];

const OFFERS = [
  { qty: 1 as const, price: TIER_PRICES[1], badge: null, savings: null },
  { qty: 2 as const, price: TIER_PRICES[2], badge: "وفّري", savings: 119 },
  { qty: 3 as const, price: TIER_PRICES[3], badge: "الأفضل قيمة", savings: 248 },
];

export default function OfferSelector({ slug }: { slug: ProductSlug }) {
  const [selected, setSelected] = useState<1 | 2 | 3>(1);
  const { addToCart } = useCart();

  const active = OFFERS.find((o) => o.qty === selected)!;

  const handleAdd = () => {
    addToCart(slug, selected);
  };

  return (
    <div className="space-y-4">
      <p className="font-semibold text-gray-900">اختاري العرض:</p>

      <div className="space-y-3">
        {OFFERS.map((offer) => {
          const isSelected = selected === offer.qty;
          const compareAt = UNIT * offer.qty;

          return (
            <button
              key={offer.qty}
              type="button"
              onClick={() => setSelected(offer.qty)}
              className={clsx(
                "w-full grid grid-cols-[auto_1fr_auto] items-center gap-3 p-4 rounded-xl border-2 transition-all text-right",
                isSelected
                  ? "border-sage bg-sage/5"
                  : "border-border bg-white hover:border-sage/40"
              )}
            >
              <span
                className={clsx(
                  "w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center",
                  isSelected ? "border-sage bg-sage" : "border-gray-300"
                )}
              >
                {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
              </span>

              <div className="min-w-0">
                <span className="font-medium block">
                  {offer.qty} {offer.qty === 1 ? "قطعة" : "قطع"}
                </span>
                {offer.savings && (
                  <span className="text-xs text-scarcity">وفّري {offer.savings} ر.س</span>
                )}
              </div>

              <div className="text-left shrink-0 flex flex-col items-end gap-1">
                {offer.badge && (
                  <span className="bg-gold-light text-sage-dark text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {offer.badge}
                  </span>
                )}
                <div
                  className={clsx(
                    "rounded-xl px-3 py-2 min-w-[5.25rem] text-center border",
                    isSelected
                      ? "bg-sage text-white border-sage shadow-sm"
                      : "bg-sage/5 border-sage/20"
                  )}
                >
                  {offer.savings != null && offer.savings > 0 && (
                    <span
                      className={clsx(
                        "block text-[11px] line-through mb-0.5 tabular-nums",
                        isSelected ? "text-white/70" : "text-gray-400"
                      )}
                    >
                      {compareAt} ر.س
                    </span>
                  )}
                  <span
                    className={clsx(
                      "block text-xl font-bold leading-none tabular-nums",
                      isSelected ? "text-white" : "text-sage"
                    )}
                  >
                    {offer.price}
                    <span className="text-xs font-semibold mr-0.5">ر.س</span>
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleAdd}
        className="w-full bg-sage hover:bg-sage-dark text-white font-semibold py-4 rounded-xl transition-colors text-lg"
      >
        أضيفي للسلة — {active.price} ر.س
      </button>

      <p className="text-center text-sm text-gray-500">✓ الدفع عند الاستلام · ✓ تغليف سري</p>
    </div>
  );
}
