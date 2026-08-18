"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { getProduct } from "@/data/products";
import { getPack } from "@/data/packs";
import { isValidMaPhone } from "@/lib/phone";
import { formatPrice } from "@/lib/money";
import { trackEvent } from "@/lib/track";

const schema = z.object({
  name: z.string().min(2, "كتبي سميتك كاملة (حرفين على الأقل)"),
  phone: z.string().refine(isValidMaPhone, "دخّلي رقم صحيح: 06 أو 07"),
});

type FormData = z.infer<typeof schema>;

export default function CheckoutPopup() {
  const { state, closeCheckout, openUpsell, total } = useCart();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const phoneValue = watch("phone");

  if (!state.isCheckoutOpen) return null;

  const onSubmit = (data: FormData) => {
    trackEvent("checkout_start");
    openUpsell(data.name, data.phone);
  };

  const titles = state.items.map((item) => {
    const pack = getPack(item.slug);
    const product = !pack ? getProduct(item.slug) : undefined;
    return pack?.title || product?.headlineAr || item.slug;
  });

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/50" onClick={closeCheckout} />
      <div
        className="fixed inset-x-0 bottom-0 z-[60] max-h-[calc(100dvh-0.75rem)] overflow-y-auto rounded-t-3xl bg-white shadow-2xl md:inset-x-auto md:bottom-auto md:left-1/2 md:top-1/2 md:w-full md:max-w-md md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-2xl"
        role="dialog"
        aria-labelledby="checkout-title"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-white px-5 py-4">
          <button onClick={closeCheckout} className="rounded-full p-1.5 text-muted hover:bg-cream" aria-label="إغلاق">
            <X size={20} />
          </button>
          <h2 id="checkout-title" className="text-base font-bold">
            اطلبي دابا
          </h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
          {titles.length > 0 && (
            <p className="rounded-xl bg-cream px-3 py-2 text-center text-xs leading-6 text-muted">
              {titles.join(" · ")}
              <span className="mt-0.5 block font-bold text-rose">{formatPrice(total)} · عند الاستلام</span>
            </p>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium">السمية الكاملة</label>
            <input
              {...register("name")}
              autoComplete="name"
              className="w-full touch-manipulation rounded-xl border border-border px-4 py-3 text-[16px] leading-6 focus:border-rose focus:outline-none"
              placeholder="مثال: سارة بنعلي"
            />
            {errors.name && <p className="mt-1 text-xs text-scarcity">{errors.name.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">رقم التيليفون</label>
            <input
              {...register("phone")}
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              className="w-full touch-manipulation rounded-xl border border-border px-4 py-3 text-left text-[16px] leading-6 focus:border-rose focus:outline-none"
              placeholder="06xxxxxxxx"
              dir="ltr"
            />
            {errors.phone ? (
              <p className="mt-1 text-xs text-scarcity">{errors.phone.message}</p>
            ) : phoneValue && isValidMaPhone(phoneValue) ? (
              <p className="mt-1 text-xs text-rose">✓ رقم صالح</p>
            ) : (
              <p className="mt-1 text-xs text-muted">06 أو 07 — باش نعيّطو ليكِ</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!isValid || state.items.length === 0}
            className="w-full rounded-xl bg-rose py-3 text-base font-extrabold text-white hover:bg-rose-dark disabled:cursor-not-allowed disabled:opacity-40"
          >
            أكّدي الطلب
          </button>
          <p className="text-center text-[11px] text-muted">
            بالضغط، كتقبلي{" "}
            <a href="/legal/terms" className="text-rose underline">
              الشروط
            </a>{" "}
            و{" "}
            <a href="/legal/privacy" className="text-rose underline">
              الخصوصية
            </a>
          </p>
        </form>
      </div>
    </>
  );
}
