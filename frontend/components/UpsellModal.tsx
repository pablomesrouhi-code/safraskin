"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles, Clock, Check } from "lucide-react";
import ProductImage from "@/components/ProductImage";
import { useCart } from "@/context/CartContext";
import { getProductOrThrow, TIER_PRICES, UPSELL_PRICE_MAD } from "@/data/products";
import { getUpsellSlug } from "@/lib/upsell";
import { encodeOrderItems } from "@/lib/orderConfirmation";
import { toE164 } from "@/lib/phone";
import { submitOrder, OrderSubmitError } from "@/lib/submitOrder";
import { formatPrice } from "@/lib/money";

const TIMER = Number(process.env.NEXT_PUBLIC_UPSELL_TIMER_SECONDS) || 12;

export default function UpsellModal() {
  const router = useRouter();
  const { state, closeAll, clearCart, cartSlugs, total } = useCart();
  const [seconds, setSeconds] = useState(TIMER);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submittedRef = useRef(false);
  const autoStartedRef = useRef(false);

  const upsellSlug = getUpsellSlug(cartSlugs);
  const upsellProduct = upsellSlug ? getProductOrThrow(upsellSlug) : null;

  const buildThankYouUrl = (orderId: string, withUpsell: boolean) => {
    const params = new URLSearchParams();
    if (state.checkoutData) {
      params.set("name", state.checkoutData.name);
      params.set("phone", state.checkoutData.phone);
    }
    if (state.items.length > 0) {
      params.set("items", encodeOrderItems(state.items));
    }
    params.set("subtotal", String(total));
    const finalTotal = withUpsell && upsellProduct ? total + UPSELL_PRICE_MAD : total;
    params.set("total", String(finalTotal));
    if (withUpsell && upsellProduct) {
      params.set("upsell", upsellProduct.slug);
      params.set("upsellPrice", String(UPSELL_PRICE_MAD));
    }
    const qs = params.toString();
    return `/thank-you/${encodeURIComponent(orderId)}${qs ? `?${qs}` : ""}`;
  };

  const placeOrder = async (withUpsell: boolean) => {
    if (!state.checkoutData || submittedRef.current) return;
    submittedRef.current = true;
    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        customer_name: state.checkoutData.name,
        customer_phone: toE164(state.checkoutData.phone),
        items: state.items.map((i) => ({ sku: i.sku, qty: i.qty })),
        ...(withUpsell && upsellProduct
          ? { upsell_sku: upsellProduct.sku, upsell_price_mad: UPSELL_PRICE_MAD }
          : {}),
      };

      const orderId = await submitOrder(payload);
      clearCart();
      closeAll();
      router.push(buildThankYouUrl(orderId, withUpsell));
    } catch (err) {
      submittedRef.current = false;
      setSubmitting(false);
      setError(
        err instanceof OrderSubmitError
          ? err.message
          : "وقع خطأ. عاودي المحاولة أو تواصلي معنا."
      );
    }
  };

  useEffect(() => {
    if (!state.isUpsellOpen || upsellProduct) {
      autoStartedRef.current = false;
      return;
    }
    if (autoStartedRef.current) return;
    autoStartedRef.current = true;
    placeOrder(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isUpsellOpen, upsellProduct]);

  useEffect(() => {
    if (!state.isUpsellOpen || !upsellProduct) return;

    setSeconds(TIMER);
    submittedRef.current = false;
    setError(null);

    const interval = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(interval);
          placeOrder(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isUpsellOpen, upsellProduct?.slug]);

  useEffect(() => {
    if (!state.isUpsellOpen) {
      submittedRef.current = false;
      autoStartedRef.current = false;
      setError(null);
      setSubmitting(false);
    }
  }, [state.isUpsellOpen]);

  if (!state.isUpsellOpen) return null;

  if (!upsellProduct) {
    return (
      <>
        <div className="fixed inset-0 z-[70] bg-black/60" />
        <div className="fixed inset-x-4 top-1/2 z-[70] -translate-y-1/2 rounded-2xl bg-white p-8 text-center shadow-2xl md:left-1/2 md:w-full md:max-w-sm md:-translate-x-1/2">
          <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-rose" />
          <p className="text-lg font-semibold">كنأكدو طلبكِ…</p>
          <p className="mt-2 text-sm text-muted">ما تسدّيش الصفحة</p>
          {error && (
            <div className="mt-4 space-y-3">
              <p className="text-sm text-scarcity">{error}</p>
              <button
                type="button"
                onClick={() => {
                  submittedRef.current = false;
                  autoStartedRef.current = false;
                  placeOrder(false);
                }}
                className="w-full rounded-xl bg-rose py-3 font-semibold text-white"
              >
                عاودي المحاولة
              </button>
            </div>
          )}
        </div>
      </>
    );
  }

  if (submitting) {
    return (
      <>
        <div className="fixed inset-0 z-[70] bg-black/60" />
        <div className="fixed inset-x-4 top-1/2 z-[70] -translate-y-1/2 rounded-2xl bg-white p-8 text-center shadow-2xl md:left-1/2 md:w-full md:max-w-sm md:-translate-x-1/2">
          <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-rose" />
          <p className="font-semibold">كنأكدو طلبكِ…</p>
        </div>
      </>
    );
  }

  const savings = TIER_PRICES[1] - UPSELL_PRICE_MAD;

  return (
    <>
      <div className="fixed inset-0 z-[70] bg-black/65 backdrop-blur-[2px]" />
      <div className="fixed inset-x-3 bottom-3 z-[70] overflow-hidden rounded-3xl border border-rose/10 bg-white shadow-2xl md:inset-x-auto md:bottom-auto md:left-1/2 md:top-1/2 md:w-full md:max-w-md md:-translate-x-1/2 md:-translate-y-1/2">
        <div className="bg-rose px-5 py-4 text-white">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-gold-light" />
              <span className="text-sm font-bold">عرض مرة واحدة — هنا غير</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-sm font-bold tabular-nums">
              <Clock size={14} className="text-gold-light" />
              {seconds} ث
            </div>
          </div>
          <p className="mt-2 text-xs text-white/80">زيديه دابا بثمن ما كيتكرّرش — قبل تأكيد الطلب</p>
        </div>

        <div className="space-y-4 p-5">
          {error && <p className="rounded-xl bg-scarcity/10 p-3 text-sm text-scarcity">{error}</p>}

          <div className="flex items-center gap-4 rounded-2xl border-2 border-rose/20 bg-rose/5 p-3">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-rose/15 bg-white">
              <ProductImage
                src={upsellProduct.image}
                alt={upsellProduct.headlineAr}
                fill
                emptyLabel={upsellProduct.headlineAr}
              />
            </div>
            <div className="min-w-0 flex-1 text-right">
              <span className="mb-1 inline-block rounded-full bg-saffron/20 px-2 py-0.5 text-[10px] font-bold text-saffron-dark">
                هنا غير: {formatPrice(savings)} أقل من الثمن العادي
              </span>
              <h3 className="font-bold leading-snug text-ink">{upsellProduct.headlineAr}</h3>
              <p className="mt-0.5 line-clamp-2 text-xs text-muted">{upsellProduct.formulaLine}</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 py-2">
            <div className="text-center">
              <span className="block text-sm text-gray-400 line-through">{formatPrice(TIER_PRICES[1])}</span>
              <span className="text-[10px] text-gray-400">الثمن العادي</span>
            </div>
            <div className="h-10 w-px bg-border" />
            <div className="text-center">
              <span className="block text-3xl font-extrabold tabular-nums text-rose">
                {UPSELL_PRICE_MAD}
              </span>
              <span className="text-xs font-semibold text-rose">درهم مغربي</span>
            </div>
          </div>

          <ul className="space-y-1.5 rounded-xl bg-cream p-3 text-xs text-muted">
            <li className="flex gap-2">
              <Check size={14} className="mt-0.5 shrink-0 text-rose" />
              <span>كيتزاد لنفس طلب COD — بلا توصيل زايد</span>
            </li>
            <li className="flex gap-2">
              <Check size={14} className="mt-0.5 shrink-0 text-rose" />
              <span>منتج مكمل للطلب ديالك — هاد الثمن ما كيبانش فصفحة المنتج</span>
            </li>
          </ul>

          <button
            type="button"
            disabled={submitting}
            onClick={() => placeOrder(true)}
            className="w-full rounded-2xl bg-rose py-4 text-lg font-bold text-white shadow-lg shadow-rose/25 hover:bg-rose-dark disabled:opacity-50"
          >
            إييه، زيديه بـ {formatPrice(UPSELL_PRICE_MAD)}
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={() => placeOrder(false)}
            className="w-full py-2 text-sm text-muted hover:text-ink"
          >
            لا شكراً — كمّلي طلبي ({formatPrice(total)})
          </button>
        </div>
      </div>
    </>
  );
}
