"use client";

import { ProductSlug, TIER_PRICES } from "@/data/products";
import { useCart } from "@/context/CartContext";
import clsx from "clsx";
import { useState } from "react";

const UNIT = TIER_PRICES[1];

const OFFERS = [
  {
    qty: 1 as const,
    price: TIER_PRICES[1],
    label: "علبة واحدة",
    hint: "شهر للبداية",
    save: 0,
    limited: false,
  },
  {
    qty: 2 as const,
    price: TIER_PRICES[2],
    label: "علبتين",
    hint: "روتين شهرين",
    save: UNIT * 2 - TIER_PRICES[2],
    limited: true,
  },
  {
    qty: 3 as const,
    price: TIER_PRICES[3],
    label: "3 علب",
    hint: "وقت كافي للنتيجة",
    save: UNIT * 3 - TIER_PRICES[3],
    limited: true,
  },
] as const;

export default function OfferSelector({ slug }: { slug: ProductSlug }) {
  const [selected, setSelected] = useState<1 | 2 | 3>(1);
  const { addToCart } = useCart();

  return (
    <div id="offer-selector" className="scroll-mt-header">
      <div className="overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-white to-cream shadow-lg shadow-rose/5">
        <div className="border-b border-border/60 bg-white/70 px-4 pb-3 pt-4">
          <p className="font-bold text-ink">اختاري العرض</p>
          <p className="mt-0.5 text-xs text-muted">الثمن واضح · الدفع عند الاستلام</p>
        </div>

        <div className="space-y-3 p-4" role="radiogroup" aria-label="اختيار العرض">
          {OFFERS.map((offer) => {
            const isSelected = selected === offer.qty;
            const fullPrice = UNIT * offer.qty;
            return (
              <button
                key={offer.qty}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setSelected(offer.qty)}
                className={clsx(
                  "grid w-full grid-cols-[auto_1fr_auto] items-center gap-3 rounded-xl border-2 p-4 text-right transition-all",
                  isSelected ? "border-rose bg-rose/5" : "border-border bg-white hover:border-rose/40"
                )}
              >
                <span
                  className={clsx(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                    isSelected ? "border-rose bg-rose" : "border-gray-300"
                  )}
                >
                  {isSelected && <span className="h-2 w-2 rounded-full bg-white" />}
                </span>
                <div className="min-w-0">
                  <span className="block font-semibold text-ink">{offer.label}</span>
                  <span className="mt-0.5 block text-xs text-muted">{offer.hint}</span>
                  {offer.save > 0 && (
                    <span className="mt-1 block text-xs font-bold text-rose">وفرتي {offer.save} درهم</span>
                  )}
                </div>
                <div className="shrink-0 text-left">
                  {offer.limited && (
                    <span className="mb-1 block rounded-full bg-saffron/20 px-2 py-0.5 text-[10px] font-bold text-saffron-dark">
                      عرض محدود
                    </span>
                  )}
                  {offer.save > 0 && (
                    <span className="block text-xs text-muted line-through tabular-nums">{fullPrice}</span>
                  )}
                  <span className="text-xl font-bold leading-tight tabular-nums text-rose">
                    {offer.price}
                  </span>
                  <span className="mt-0.5 block text-[11px] font-semibold text-muted">درهم مغربي</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="p-4 pt-0">
          <button
            type="button"
            onClick={() => addToCart(slug, selected)}
            className="flex w-full items-center justify-center rounded-xl bg-rose py-3.5 text-base font-bold text-white shadow-md shadow-rose/25 hover:bg-rose-dark"
          >
            للطلب
          </button>
          <p className="mt-3 text-center text-xs text-muted">خلّصي ملي توصّل · مكالمة تأكيد</p>
        </div>
      </div>
    </div>
  );
}
