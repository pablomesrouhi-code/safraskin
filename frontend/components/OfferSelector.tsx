"use client";

import { ProductSlug, TIER_PRICES } from "@/data/products";
import { useCart } from "@/context/CartContext";
import clsx from "clsx";
import { useState } from "react";
import { ShoppingBag } from "lucide-react";

const UNIT = TIER_PRICES[1];

const OFFERS = [
  {
    qty: 1 as const,
    price: TIER_PRICES[1],
    label: "علبة واحدة",
    hint: "شهر للبداية",
    save: 0,
  },
  {
    qty: 2 as const,
    price: TIER_PRICES[2],
    label: "علبتين",
    hint: "روتين شهرين",
    save: UNIT * 2 - TIER_PRICES[2],
  },
  {
    qty: 3 as const,
    price: TIER_PRICES[3],
    label: "3 علب",
    hint: "وقت كافي للنتيجة",
    save: UNIT * 3 - TIER_PRICES[3],
  },
] as const;

export default function OfferSelector({ slug }: { slug: ProductSlug }) {
  const [selected, setSelected] = useState<1 | 2 | 3>(1);
  const { addToCart, buyNow } = useCart();
  const active = OFFERS.find((offer) => offer.qty === selected)!;

  return (
    <div id="offer-selector" className="scroll-mt-header">
      <div className="overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-white to-cream shadow-lg shadow-rose/5">
        <div className="border-b border-border/60 bg-white/70 px-4 pb-3 pt-4">
          <p className="font-bold text-ink">اختاري العرض</p>
          <p className="mt-0.5 text-xs text-muted">الثمن واضح · الدفع عند الاستلام</p>
        </div>

        <div className="grid gap-2 p-3 sm:grid-cols-3 sm:gap-3 sm:p-4" role="radiogroup" aria-label="اختيار العرض">
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
                  "flex min-h-[4.75rem] w-full items-center gap-3 rounded-xl border-2 p-3 text-right transition-all sm:min-h-[9rem] sm:flex-col sm:items-stretch sm:justify-between sm:p-4",
                  isSelected
                    ? "border-rose bg-rose/10 shadow-sm"
                    : "border-border bg-white hover:border-rose/40"
                )}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span
                    className={clsx(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                      isSelected ? "border-rose bg-rose" : "border-gray-300"
                    )}
                  >
                    {isSelected && <span className="h-2 w-2 rounded-full bg-white" />}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold text-ink">{offer.label}</span>
                    <span className="block text-xs text-muted">{offer.hint}</span>
                  </span>
                </span>
                <span className="mr-auto shrink-0 text-left sm:mr-0 sm:text-right">
                  {offer.save > 0 && (
                    <span className="block text-xs text-muted line-through tabular-nums">{fullPrice}</span>
                  )}
                  <span className="text-xl font-bold leading-tight tabular-nums text-rose">
                    {offer.price}
                  </span>
                  <span className="mt-0.5 block text-[11px] font-semibold text-muted">درهم مغربي</span>
                  {offer.save > 0 && (
                    <span className="mt-1 block text-[11px] font-bold text-rose">وفرتي {offer.save} درهم</span>
                  )}
                </span>
              </button>
            );
          })}
        </div>

        <div className="space-y-2 p-4 pt-0">
          <button
            type="button"
            onClick={() => addToCart(slug, selected)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-rose bg-white px-5 py-3.5 font-bold text-rose transition hover:bg-rose/5"
          >
            <ShoppingBag size={18} aria-hidden />
            أضيفي للسلة
          </button>
          <button
            type="button"
            onClick={() => buyNow(slug, selected)}
            className="w-full rounded-2xl bg-rose px-5 py-4 text-lg font-extrabold text-white shadow-lg shadow-rose/30 transition hover:bg-rose-dark"
          >
            اطلبي · الدفع عند الاستلام
          </button>
          <p className="text-center text-xs text-muted">
            {active.label} · {active.price} درهم مغربي
          </p>
        </div>
      </div>
    </div>
  );
}

