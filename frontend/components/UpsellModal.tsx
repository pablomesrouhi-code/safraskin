"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles, Clock, Check } from "lucide-react";
import ProductImage from "@/components/ProductImage";
import { useCart } from "@/context/CartContext";
import { getProductOrThrow, UPSELL_PRICE_SAR } from "@/data/products";
import { getUpsellSlug } from "@/lib/upsell";
import { encodeOrderItems } from "@/lib/orderConfirmation";
import { toE164 } from "@/lib/phone";
import { submitOrder, OrderSubmitError } from "@/lib/submitOrder";

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
    const finalTotal = withUpsell && upsellProduct ? total + UPSELL_PRICE_SAR : total;
    params.set("total", String(finalTotal));
    if (withUpsell && upsellProduct) {
      params.set("upsell", upsellProduct.slug);
      params.set("upsellPrice", String(UPSELL_PRICE_SAR));
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
          ? { upsell_sku: upsellProduct.sku, upsell_price_sar: UPSELL_PRICE_SAR }
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
          : "حدث خطأ. حاولي مرة أخرى أو تواصلي معنا."
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
        <div className="fixed inset-0 bg-black/60 z-[70]" />
        <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-sm bg-white rounded-2xl z-[70] shadow-2xl p-8 text-center">
          <Loader2 className="w-10 h-10 text-sage animate-spin mx-auto mb-4" />
          <p className="font-semibold text-lg">جاري تأكيد طلبك…</p>
          <p className="text-sm text-gray-500 mt-2">لا تغلقي الصفحة</p>
          {error && (
            <div className="mt-4 space-y-3">
              <p className="text-scarcity text-sm">{error}</p>
              <button
                type="button"
                onClick={() => {
                  submittedRef.current = false;
                  autoStartedRef.current = false;
                  placeOrder(false);
                }}
                className="w-full bg-sage text-white font-semibold py-3 rounded-xl"
              >
                إعادة المحاولة
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
        <div className="fixed inset-0 bg-black/60 z-[70]" />
        <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-sm bg-white rounded-2xl z-[70] shadow-2xl p-8 text-center">
          <Loader2 className="w-10 h-10 text-sage animate-spin mx-auto mb-4" />
          <p className="font-semibold">جاري تأكيد طلبك…</p>
        </div>
      </>
    );
  }

  const savings = 199 - UPSELL_PRICE_SAR;

  return (
    <>
      <div className="fixed inset-0 bg-black/65 z-[70] backdrop-blur-[2px]" />
      <div className="fixed inset-x-3 bottom-3 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:w-full md:max-w-md bg-white rounded-3xl z-[70] shadow-2xl overflow-hidden border border-sage/10">
        {/* Header */}
        <div className="bg-gradient-to-l from-sage-dark via-sage to-sage px-5 py-4 text-white">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-gold" />
              <span className="font-bold text-sm">عرض لمرة واحدة فقط</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1 text-sm font-bold tabular-nums">
              <Clock size={14} className="text-gold" />
              {seconds} ث
            </div>
          </div>
          <p className="text-white/80 text-xs mt-2">أضيفيه الآن بسعر لا يتكرر — قبل تأكيد الطلب</p>
        </div>

        <div className="p-5 space-y-4">
          {error && (
            <p className="text-scarcity text-sm bg-scarcity/10 rounded-xl p-3">{error}</p>
          )}

          <div className="flex gap-4 items-center rounded-2xl border-2 border-sage/20 bg-sage/5 p-3">
            <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white shrink-0 border border-sage/15 shadow-sm">
              <ProductImage
                src={upsellProduct.image}
                alt={upsellProduct.nameAr}
                fill
                className="object-cover object-center"
              />
            </div>
            <div className="flex-1 min-w-0 text-right">
              <span className="inline-block text-[10px] font-bold bg-gold/20 text-sage-dark px-2 py-0.5 rounded-full mb-1">
                وفّري {savings} ر.س
              </span>
              <h3 className="font-bold text-gray-900 leading-snug">{upsellProduct.nameAr}</h3>
              <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{upsellProduct.taglineAr}</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 py-2">
            <div className="text-center">
              <span className="block text-sm text-gray-400 line-through">199 ر.س</span>
              <span className="text-[10px] text-gray-400">السعر العادي</span>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <span className="block text-3xl font-extrabold text-sage tabular-nums">
                {UPSELL_PRICE_SAR}
              </span>
              <span className="text-xs font-semibold text-sage">ريال سعودي فقط</span>
            </div>
          </div>

          <ul className="text-xs text-gray-600 space-y-1.5 bg-cream rounded-xl p-3">
            <li className="flex gap-2">
              <Check size={14} className="text-sage shrink-0 mt-0.5" />
              <span>يُضاف لنفس طلب COD — بدون شحن إضافي</span>
            </li>
            <li className="flex gap-2">
              <Check size={14} className="text-sage shrink-0 mt-0.5" />
              <span>أكملي بروتوكولك من 3 منتجات</span>
            </li>
          </ul>

          <button
            type="button"
            disabled={submitting}
            onClick={() => placeOrder(true)}
            className="w-full bg-sage hover:bg-sage-dark disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-sage/25 text-lg"
          >
            نعم! أضيفيه بـ {UPSELL_PRICE_SAR} ر.س
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={() => placeOrder(false)}
            className="w-full text-gray-500 text-sm py-2 hover:text-gray-700"
          >
            لا شكراً — أكملي طلبي ({total} ر.س)
          </button>
        </div>
      </div>
    </>
  );
}
