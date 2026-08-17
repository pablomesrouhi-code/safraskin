"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Phone } from "lucide-react";
import { firstNameFrom, getCallWindow, parseOrderItems } from "@/lib/orderConfirmation";
import { getProduct, PRODUCTS, UPSELL_PRICE_MAD, type ProductSlug } from "@/data/products";
import { getPack } from "@/data/packs";
import { getLinePrice } from "@/lib/pricing";
import { formatPhoneDisplay } from "@/lib/phone";
import { formatPrice } from "@/lib/money";
import BrandLogo from "@/components/BrandLogo";
import ProductImage from "@/components/ProductImage";

function qtyLabel(qty: number) {
  if (qty === 1) return "علبة واحدة";
  if (qty === 2) return "علبتين";
  return `${qty} علب`;
}

export default function ThankYouView({ orderId }: { orderId: string }) {
  const searchParams = useSearchParams();
  const windowInfo = useMemo(() => getCallWindow(), []);
  const name = searchParams.get("name") || "";
  const phone = searchParams.get("phone") || "";
  const total = searchParams.get("total") || "";
  const upsell = searchParams.get("upsell");
  const items = parseOrderItems(searchParams.get("items") || undefined);
  const firstName = firstNameFrom(name);
  const displayPhone = phone ? formatPhoneDisplay(phone) : "";
  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const extras = PRODUCTS.filter((product) => !items.some((item) => item.slug === product.slug) && product.slug !== upsell).slice(
    0,
    3
  );

  return (
    <div className="mx-auto max-w-lg px-4 py-6 md:py-10">
      <div className="mb-5 flex justify-center md:mb-6">
        <BrandLogo />
      </div>

      <div className={`rounded-2xl px-4 py-4 text-white md:px-5 md:py-5 ${windowInfo.isOpen ? "bg-rose" : "bg-ink"}`}>
        <p className="text-[10px] font-bold tracking-[0.16em] text-white/75">{windowInfo.badge}</p>
        <h1 className="mt-1 text-xl font-extrabold leading-snug md:text-2xl">{windowInfo.headline}</h1>
        <p className="mt-2 text-sm leading-6 text-white/90">
          {firstName ? `${firstName}، ` : ""}
          {windowInfo.subline}
        </p>
        {displayPhone ? (
          <p className="mt-3 rounded-xl bg-white/12 px-3 py-2 font-english text-lg font-bold" dir="ltr">
            {displayPhone}
          </p>
        ) : null}
        <p className="mt-3 flex items-start gap-2 text-xs leading-6 text-white/90">
          <Phone className="mt-0.5 shrink-0" size={16} />
          الرقم جديد. جاوبي باش نأكدو العنوان — وإلا الطلب كيتأخّر أو كيتلغى.
        </p>
      </div>

      <section className="mt-4 rounded-2xl border border-border bg-white p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="text-right">
            {name ? <p className="text-sm font-bold text-ink">{name}</p> : null}
            <p className="mt-0.5 font-english text-xs text-muted">{orderId}</p>
          </div>
          {total ? <p className="text-left text-base font-extrabold tabular-nums text-rose">{formatPrice(Number(total))}</p> : null}
        </div>
        <ul className="mt-3 space-y-2 border-t border-border pt-3">
          {items.map((item) => {
            const product = getProduct(item.slug);
            const pack = getPack(item.slug);
            const title = pack?.title || product?.headlineAr || item.slug;
            return (
              <li key={item.slug} className="flex items-start justify-between gap-3 text-sm">
                <span className="min-w-0 text-right leading-6 text-ink">
                  {title}
                  <span className="mt-0.5 block text-xs text-muted">{qtyLabel(item.qty)}</span>
                </span>
                <span className="shrink-0 text-left text-xs font-bold tabular-nums text-ink">
                  {formatPrice(getLinePrice(item))}
                </span>
              </li>
            );
          })}
          {upsell ? (
            <li className="flex items-start justify-between gap-3 text-sm">
              <span className="min-w-0 text-right leading-6 text-ink">
                {getProduct(upsell)?.headlineAr || upsell}
                <span className="mt-0.5 block text-xs text-muted">إضافة</span>
              </span>
              <span className="shrink-0 text-left text-xs font-bold tabular-nums text-ink">
                {formatPrice(UPSELL_PRICE_MAD)}
              </span>
            </li>
          ) : null}
        </ul>
        <p className="mt-3 text-center text-[11px] text-muted">الدفع عند الاستلام · تغليف محايد</p>
      </section>

      {extras.length > 0 && (
        <section className="mt-4">
          <p className="text-sm font-bold text-ink">زيديه فالمكالمة لنفس التوصيل</p>
          <div className="mt-2 space-y-2">
            {extras.map((product) => (
              <div key={product.slug} className="flex items-center gap-2 rounded-xl border border-border bg-white p-2">
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-cream">
                  <ProductImage src={product.image} alt={product.headlineAr} fill emptyLabel={product.headlineAr} />
                </div>
                <p className="min-w-0 flex-1 text-right text-xs font-semibold leading-5 text-ink">{product.headlineAr}</p>
                <Link
                  href={`/products/${product.slug as ProductSlug}`}
                  className="shrink-0 rounded-lg bg-rose px-2.5 py-1.5 text-[11px] font-bold text-white"
                >
                  شوفي
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {wa ? (
        <a
          href={`https://wa.me/${wa.replace(/\D/g, "")}`}
          className="mt-4 flex w-full items-center justify-center rounded-xl border border-rose py-2.5 text-sm font-bold text-rose"
        >
          واتساب
        </a>
      ) : (
        <Link
          href="/contact"
          className="mt-4 flex w-full items-center justify-center rounded-xl border border-rose py-2.5 text-sm font-bold text-rose"
        >
          تواصلي معنا
        </Link>
      )}
      <Link href="/collection" className="mt-2 flex w-full items-center justify-center py-2 text-xs text-muted">
        رجعي للمجموعة
      </Link>
    </div>
  );
}
