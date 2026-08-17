"use client";

import { ProductSlug, TIER_PRICES } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { asOfferQty, getOfferPrice } from "@/lib/pricing";
import { formatPrice } from "@/lib/money";
import { useState } from "react";
import QtyStepper from "@/components/QtyStepper";

const UNIT = TIER_PRICES[1];

export default function OfferSelector({ slug }: { slug: ProductSlug }) {
  const [qty, setQty] = useState<1 | 2 | 3>(1);
  const { addToCart } = useCart();
  const price = getOfferPrice(qty);
  const save = qty > 1 ? UNIT * qty - price : 0;

  return (
    <div id="offer-selector" className="scroll-mt-header">
      <div className="rounded-2xl border border-border bg-white p-4 shadow-lg shadow-rose/5">
        <QtyStepper
          qty={qty}
          onDecrease={() => setQty((current) => asOfferQty(current - 1))}
          onIncrease={() => setQty((current) => asOfferQty(current + 1))}
        />
        {save > 0 ? (
          <p className="mt-2 text-center text-xs font-bold text-rose">وفرتي {save} درهم</p>
        ) : (
          <p className="mt-2 text-center text-xs text-muted">الكمية · تبداي بعلبة واحدة</p>
        )}

        <button
          type="button"
          onClick={() => addToCart(slug, qty)}
          className="mt-4 w-full rounded-2xl bg-rose py-5 text-xl font-extrabold text-white shadow-lg shadow-rose/35 transition hover:bg-rose-dark"
        >
          للطلب
        </button>
        <p className="mt-2 text-center text-sm font-semibold text-ink">{formatPrice(price)}</p>
        <p className="mt-0.5 text-center text-xs text-muted">الدفع عند الاستلام</p>
      </div>
    </div>
  );
}
