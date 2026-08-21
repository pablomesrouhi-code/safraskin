"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, Flame, Loader2 } from "lucide-react";
import ProductImage from "@/components/ProductImage";
import { useCart } from "@/context/CartContext";
import { getProductOrThrow, getTierPrices, UPSELL_PRICE_MAD } from "@/data/products";
import { getUpsellSlug } from "@/lib/upsell";
import { encodeOrderItems } from "@/lib/orderConfirmation";
import { toE164 } from "@/lib/phone";
import { submitOrder, OrderSubmitError } from "@/lib/submitOrder";
import { formatPrice } from "@/lib/money";

const TIMER = 5;

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
        customer_address: state.checkoutData.address,
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

  return (
    <>
      <div className="fixed inset-0 z-[70] bg-black/65" />
      <div className="fixed inset-x-3 bottom-3 z-[70] overflow-hidden rounded-3xl bg-white shadow-2xl md:inset-x-auto md:bottom-auto md:left-1/2 md:top-1/2 md:w-full md:max-w-sm md:-translate-x-1/2 md:-translate-y-1/2">
        <div className="flex items-center justify-between bg-rose px-4 py-3 text-white">
          <span className="flex items-center gap-1.5 text-sm font-bold">
            <Flame size={17} className="fill-saffron text-saffron" aria-hidden />
            عرض فاير · غير دابا
          </span>
          <div className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-sm font-bold tabular-nums">
            <Clock size={14} aria-hidden />
            {seconds} ث
          </div>
        </div>

        <div className="p-4">
          {error && <p className="rounded-xl bg-scarcity/10 p-3 text-sm text-scarcity">{error}</p>}

          <div className="flex items-center gap-3">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-border bg-cream">
              <ProductImage
                src={upsellProduct.image}
                alt={upsellProduct.headlineAr}
                fill
                emptyLabel={upsellProduct.headlineAr}
              />
            </div>
            <div className="min-w-0 flex-1 text-right">
              <h3 className="font-bold leading-snug text-ink">{upsellProduct.feelingTitle}</h3>
              <p className="mt-1 flex items-baseline gap-2">
                <span className="text-sm text-muted line-through">
                  {formatPrice(getTierPrices(upsellProduct.slug)[1])}
                </span>
                <span className="text-xl font-extrabold text-rose">{formatPrice(UPSELL_PRICE_MAD)}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={submitting}
            onClick={() => placeOrder(true)}
            className="mt-4 w-full rounded-2xl bg-rose py-4 text-base font-extrabold text-white hover:bg-rose-dark disabled:opacity-50"
          >
            زيديه بـ {formatPrice(UPSELL_PRICE_MAD)}
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={() => placeOrder(false)}
            className="mt-1 w-full py-2.5 text-sm text-muted hover:text-ink"
          >
            كمّلي الطلب بلا إضافة
          </button>
        </div>
      </div>
    </>
  );
}
