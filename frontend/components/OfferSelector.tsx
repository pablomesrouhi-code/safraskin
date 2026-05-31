"use client";

import { ProductSlug, TIER_PRICES } from "@/data/products";
import { useCart } from "@/context/CartContext";
import clsx from "clsx";
import { useState } from "react";
import { ShoppingBag } from "lucide-react";

const OFFERS = [
  {
    qty: 1 as const,
    price: TIER_PRICES[1],
    label: "قطعة واحدة",
    tag: null,
    savings: null,
  },
  {
    qty: 2 as const,
    price: TIER_PRICES[2],
    label: "قطعتين",
    tag: "اختيار ذكي",
    savings: 119,
  },
  {
    qty: 3 as const,
    price: TIER_PRICES[3],
    label: "3 قطع",
    tag: "الأكثر توفيراً",
    savings: 248,
  },
] as const;

export default function OfferSelector({ slug }: { slug: ProductSlug }) {
  const [selected, setSelected] = useState<1 | 2 | 3>(2);
  const { addToCart } = useCart();
  const active = OFFERS.find((o) => o.qty === selected)!;

  return (
    <div id="offer-selector" className="scroll-mt-header">
      <div className="rounded-2xl border border-sage/15 bg-gradient-to-b from-white to-cream/80 shadow-lg shadow-sage/8 overflow-hidden">
        <div className="px-4 pt-4 pb-3 border-b border-border/60 bg-white/70">
          <p className="font-bold text-gray-900">اختاري العرض</p>
          <p className="text-xs text-gray-500 mt-0.5">كلما زادت الكمية، وفّرتِ أكثر · COD</p>
        </div>

        <div className="p-4 space-y-3" role="radiogroup" aria-label="اختيار العرض">
          {OFFERS.map((offer) => {
            const isSelected = selected === offer.qty;

            return (
              <button
                key={offer.qty}
                type="button"
                role="radio"
                aria-checked={isSelected}
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
                  <span className="font-semibold text-gray-900 block">{offer.label}</span>
                  {offer.tag && (
                    <span className="text-xs text-sage font-medium mt-0.5 block">{offer.tag}</span>
                  )}
                  {offer.savings != null && (
                    <span className="text-xs text-scarcity font-medium mt-0.5 block">
                      وفّر {offer.savings} ريال سعودي مقارنة بالوحدة
                    </span>
                  )}
                </div>

                <div className="text-left shrink-0">
                  <span className="text-xl font-bold text-sage tabular-nums leading-tight">
                    {offer.price}
                  </span>
                  <span className="block text-xs font-semibold text-gray-500 mt-0.5">
                    ريال سعودي
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="p-4 pt-0 space-y-3">
          <button
            type="button"
            onClick={() => addToCart(slug, selected)}
            className="w-full flex items-center justify-center gap-2 bg-sage hover:bg-sage-dark text-white font-bold py-3.5 rounded-xl transition-all text-base shadow-md shadow-sage/20 active:scale-[0.99]"
          >
            <ShoppingBag size={18} aria-hidden />
            أضيفي للسلة — {active.price} ريال سعودي
          </button>

          <p className="text-center text-xs text-gray-500">
            ✓ الدفع عند الاستلام · ✓ شحن سري · ✓ تغليف سري
          </p>
        </div>
      </div>
    </div>
  );
}
