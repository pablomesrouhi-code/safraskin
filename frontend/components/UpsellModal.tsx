"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import ProductImage from "@/components/ProductImage";
import { useCart } from "@/context/CartContext";
import { getProductOrThrow, UPSELL_PRICE_SAR } from "@/data/products";
import { getUpsellSlug } from "@/lib/upsell";
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

      const params = new URLSearchParams();
      if (withUpsell && upsellProduct) {
        params.set("upsell", upsellProduct.slug);
        params.set("upsellPrice", String(UPSELL_PRICE_SAR));
      }
      params.set("total", String(withUpsell && upsellProduct ? total + UPSELL_PRICE_SAR : total));

      const qs = params.toString();
      router.push(`/thank-you/${encodeURIComponent(orderId)}${qs ? `?${qs}` : ""}`);
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

  // No upsell — submit once when checkout opens upsell step
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

  // Upsell timer
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

  // Loading / no-upsell path
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

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-[70]" />
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-sm bg-white rounded-2xl z-[70] shadow-2xl overflow-hidden">
        <div className="bg-sage text-white text-center py-3 text-sm font-medium">
          ⏳ عرض خاص — {seconds} ثانية
        </div>
        <div className="p-6 text-center space-y-4">
          {error && (
            <p className="text-scarcity text-sm bg-scarcity/10 rounded-lg p-3">{error}</p>
          )}
          <div className="relative w-32 h-32 mx-auto rounded-xl overflow-hidden bg-cream">
            <ProductImage src={upsellProduct.image} alt={upsellProduct.nameAr} fill className="object-cover object-center" />
          </div>
          <div>
            <p className="text-scarcity font-bold text-lg">عرض لمرة واحدة — الخصم الوحيد!</p>
            <h3 className="font-semibold mt-1">{upsellProduct.nameAr}</h3>
            <p className="text-sm text-gray-500 mt-1">{upsellProduct.taglineAr}</p>
          </div>
          <div className="flex items-center justify-center gap-3">
            <span className="text-gray-400 line-through text-lg">199 ر.س</span>
            <span className="text-3xl font-bold text-sage">{UPSELL_PRICE_SAR} ر.س</span>
          </div>
          <button
            type="button"
            disabled={submitting}
            onClick={() => placeOrder(true)}
            className="w-full bg-gold hover:bg-gold/90 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-colors"
          >
            نعم! أضيفي بـ {UPSELL_PRICE_SAR} ر.س
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
