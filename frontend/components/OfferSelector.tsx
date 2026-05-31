"use client";

import { ProductSlug, TIER_PRICES } from "@/data/products";
import { useCart } from "@/context/CartContext";
import clsx from "clsx";
import { useState } from "react";
import { Gift, Sparkles, Tag } from "lucide-react";

const UNIT = TIER_PRICES[1];

const OFFERS = [
  {
    qty: 1 as const,
    price: TIER_PRICES[1],
    label: "قطعة واحدة",
    badge: null,
    savings: null,
    perUnit: UNIT,
    highlight: false,
  },
  {
    qty: 2 as const,
    price: TIER_PRICES[2],
    label: "قطعتين",
    badge: "وفّري",
    savings: UNIT * 2 - TIER_PRICES[2],
    perUnit: Math.round(TIER_PRICES[2] / 2),
    highlight: true,
  },
  {
    qty: 3 as const,
    price: TIER_PRICES[3],
    label: "الطقم الكامل",
    badge: "أكبر توفير",
    savings: UNIT * 3 - TIER_PRICES[3],
    perUnit: Math.round(TIER_PRICES[3] / 3),
    highlight: false,
    best: true,
  },
];

export default function OfferSelector({ slug }: { slug: ProductSlug }) {
  const [selected, setSelected] = useState<1 | 2 | 3>(2);
  const { addToCart } = useCart();

  const active = OFFERS.find((o) => o.qty === selected)!;

  const handleAdd = () => {
    addToCart(slug, selected);
  };

  return (
    <div className="rounded-2xl border border-border bg-gradient-to-b from-white to-cream/80 p-4 sm:p-5 shadow-sm space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-bold text-gray-900 text-lg">اختاري العرض</p>
          <p className="text-xs text-gray-500 mt-0.5">كل ما زادت الكمية — وفّري أكثر</p>
        </div>
        <span className="shrink-0 inline-flex items-center gap-1 bg-gold/15 text-sage-dark text-[11px] font-bold px-2.5 py-1 rounded-full">
          <Gift size={12} className="text-gold" />
          عروض واضحة
        </span>
      </div>

      <div className="space-y-2.5">
        {OFFERS.map((offer) => {
          const isSelected = selected === offer.qty;
          const wasPrice = UNIT * offer.qty;

          return (
            <button
              key={offer.qty}
              type="button"
              onClick={() => setSelected(offer.qty)}
              className={clsx(
                "relative w-full text-right rounded-xl border-2 transition-all overflow-hidden",
                isSelected
                  ? "border-sage bg-sage/8 shadow-md shadow-sage/10"
                  : "border-border/80 bg-white hover:border-sage/35 hover:shadow-sm",
                offer.best && !isSelected && "border-gold/40 bg-gold/5"
              )}
            >
              {offer.best && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold via-sage to-gold" />
              )}

              <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 p-3.5 sm:p-4">
                <span
                  className={clsx(
                    "w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors",
                    isSelected ? "border-sage bg-sage" : "border-gray-300 bg-white"
                  )}
                >
                  {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                </span>

                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-gray-900">{offer.label}</span>
                    {offer.badge && (
                      <span
                        className={clsx(
                          "text-[10px] font-bold px-2 py-0.5 rounded-full",
                          offer.best
                            ? "bg-sage text-white"
                            : "bg-scarcity/15 text-scarcity"
                        )}
                      >
                        {offer.badge}
                      </span>
                    )}
                  </div>
                  {offer.savings ? (
                    <p className="text-xs font-semibold text-scarcity flex items-center gap-1">
                      <Tag size={12} />
                      وفّري {offer.savings} ر.س
                    </p>
                  ) : (
                    <p className="text-xs text-gray-400">جرّبي منتج واحد أولاً</p>
                  )}
                  <p className="text-[11px] text-gray-500">
                    ≈ <span className="font-semibold text-sage">{offer.perUnit} ر.س</span> / علبة
                  </p>
                </div>

                <div className="text-left shrink-0">
                  {offer.savings != null && offer.savings > 0 && (
                    <span className="block text-sm text-gray-400 line-through mb-0.5">
                      {wasPrice} ر.س
                    </span>
                  )}
                  <span className="text-2xl font-bold text-sage leading-none">{offer.price}</span>
                  <span className="text-xs text-gray-500 block mt-0.5">ر.س</span>
                </div>
              </div>

              {offer.highlight && isSelected && (
                <div className="px-4 pb-2.5 -mt-1">
                  <p className="text-[10px] text-sage font-medium text-center flex items-center justify-center gap-1">
                    <Sparkles size={11} />
                    الأكثر اختياراً بين السعوديات
                  </p>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="rounded-xl bg-sage/10 border border-sage/20 px-4 py-3 flex items-center justify-between gap-3">
        <div className="text-sm text-gray-700">
          <span className="font-bold text-sage">{active.qty}</span>
          {active.qty === 1 ? " علبة" : " علب"} · المجموع
        </div>
        <span className="text-xl font-bold text-sage">{active.price} ر.س</span>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        className="w-full bg-sage hover:bg-sage-dark text-white font-bold py-4 rounded-xl transition-all text-lg shadow-lg shadow-sage/20 hover:shadow-sage/30"
      >
        أضيفي للسلة — {active.price} ر.س
      </button>

      <p className="text-center text-xs text-gray-500 leading-relaxed">
        ✓ دفع عند الاستلام · ✓ تغليف سري · ✓ ضمان 14 يوم
      </p>
    </div>
  );
}
