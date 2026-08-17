"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Phone } from "lucide-react";
import { getCallWindow, parseOrderItems } from "@/lib/orderConfirmation";
import { getProduct, UPSELL_PRICE_MAD } from "@/data/products";
import { getPack } from "@/data/packs";
import { formatPhoneDisplay } from "@/lib/phone";
import { formatPrice } from "@/lib/money";
import BrandLogo from "@/components/BrandLogo";

export default function ThankYouView({ orderId }: { orderId: string }) {
  const searchParams = useSearchParams();
  const windowInfo = useMemo(() => getCallWindow(), []);
  const name = searchParams.get("name") || "";
  const phone = searchParams.get("phone") || "";
  const total = searchParams.get("total") || "";
  const upsell = searchParams.get("upsell");
  const items = parseOrderItems(searchParams.get("items") || undefined);

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <div className="mb-8 flex justify-center">
        <BrandLogo />
      </div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-saffron-dark">
        {windowInfo.badge}
      </p>
      <h1 className="mt-3 text-3xl font-bold leading-snug">شكراً. الطلب تسجّل.</h1>
      <p className="mt-3 text-lg font-semibold text-rose">{windowInfo.headline}</p>
      <p className="mt-2 leading-8 text-muted">{windowInfo.subline}</p>

      <div className="mt-8 rounded-2xl border border-border bg-white p-5">
        <p className="text-sm text-muted">رقم الطلب</p>
        <p className="mt-1 font-english text-lg font-semibold">{orderId}</p>
        {name && <p className="mt-4 text-sm">لـ {name}</p>}
        {phone && (
          <p className="mt-1 font-english text-sm text-muted" dir="ltr">
            {formatPhoneDisplay(phone)}
          </p>
        )}
        {total && (
          <p className="mt-4 text-xl font-bold text-rose">
            {formatPrice(Number(total))} · الدفع عند الاستلام
          </p>
        )}
        {items.length > 0 && (
          <ul className="mt-4 space-y-1 text-sm text-muted">
            {items.map((item) => {
              const product = getProduct(item.slug);
              const pack = getPack(item.slug);
              return (
                <li key={item.slug}>
                  {pack?.title || product?.headlineAr || item.slug} × {item.qty}
                </li>
              );
            })}
            {upsell && (
              <li>
                إضافة: {getProduct(upsell)?.headlineAr || upsell} · {formatPrice(UPSELL_PRICE_MAD)}
              </li>
            )}
          </ul>
        )}
      </div>

      <div className="mt-6 flex gap-3 rounded-2xl bg-rose/10 p-5 text-rose-dark">
        <Phone className="mt-0.5 shrink-0" size={20} />
        <div>
          <p className="font-bold">جاوبي على التيليفون</p>
          <p className="mt-1 text-sm leading-7">
            إلا ما جاوبتيش، ما نقدروش نأكدو العنوان، والطلب كيتأخّر أو كيتلغى. هاد المكالمة هي اللي كتخلي الطلبيّة توصّل.
          </p>
        </div>
      </div>
    </div>
  );
}
