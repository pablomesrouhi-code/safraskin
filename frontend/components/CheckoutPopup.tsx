"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, ShieldCheck, Package, Truck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { getProductOrThrow } from "@/data/products";
import { getOfferPrice } from "@/lib/pricing";
import { isValidMaPhone } from "@/lib/phone";
import { trackEvent } from "@/lib/track";

const schema = z.object({
  name: z.string().min(2, "كتبي سميتك كاملة (حرفين على الأقل)"),
  phone: z.string().refine(isValidMaPhone, "دخّلي رقم مغربي صحيح: 06 أو 07"),
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

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/50" onClick={closeCheckout} />
      <div
        className="fixed inset-x-4 top-1/2 z-[60] max-h-[90vh] -translate-y-1/2 overflow-y-auto rounded-2xl bg-white shadow-2xl md:inset-x-auto md:left-1/2 md:w-full md:max-w-lg md:-translate-x-1/2"
        role="dialog"
        aria-labelledby="checkout-title"
      >
        <div className="sticky top-0 flex items-center justify-between rounded-t-2xl border-b border-border bg-white p-5">
          <button onClick={closeCheckout} className="p-1 text-muted" aria-label="إغلاق">
            <X size={22} />
          </button>
          <h2 id="checkout-title" className="text-lg font-bold">
            ملخص طلبك
          </h2>
        </div>

        <div className="space-y-5 p-5">
          <div className="space-y-3 rounded-xl bg-cream p-4">
            {state.items.map((item) => {
              const product = getProductOrThrow(item.slug);
              return (
                <div key={item.slug} className="flex items-center justify-between gap-3">
                  <span className="text-sm font-bold tabular-nums">{getOfferPrice(item.qty)} د.م</span>
                  <div className="min-w-0 text-right">
                    <p className="text-sm font-medium text-ink">{product.headlineAr}</p>
                    <p className="text-xs text-muted">
                      {item.qty === 1 ? "علبة واحدة" : item.qty === 2 ? "علبتين" : "3 علب"} · {product.problemTitle}
                    </p>
                  </div>
                </div>
              );
            })}
            <div className="flex items-center justify-between border-t border-border/60 pt-3">
              <span className="text-xl font-bold tabular-nums text-rose">{total} د.م</span>
              <div className="text-right">
                <p className="font-bold text-ink">المجموع</p>
                <p className="text-xs text-muted">الدفع عند الاستلام</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-white p-3 text-center text-sm text-muted">
            نساء من كازا، الرباط، مراكش وفاس كيطلبو نفس الروتين · تغليف محايد
          </div>

          <div className="rounded-xl border border-scarcity/20 bg-scarcity/5 px-3 py-2 text-center text-xs text-scarcity">
            الطلبات كتتأكد اليوم — جاوبي على التيليفون باش نوصلو ليكِ
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs text-muted">
            <div className="flex flex-col items-center gap-1 rounded-lg bg-cream p-2">
              <ShieldCheck size={18} className="text-rose" />
              <span>COD آمن</span>
            </div>
            <div className="flex flex-col items-center gap-1 rounded-lg bg-cream p-2">
              <Package size={18} className="text-rose" />
              <span>تغليف محترم</span>
            </div>
            <div className="flex flex-col items-center gap-1 rounded-lg bg-cream p-2">
              <Truck size={18} className="text-rose" />
              <span>كل المدن</span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">السمية الكاملة</label>
              <input
                {...register("name")}
                autoComplete="name"
                className="w-full rounded-xl border border-border px-4 py-3 focus:border-rose focus:outline-none"
                placeholder="مثال: سارة بنعلي"
              />
              {errors.name && <p className="mt-1 text-xs text-scarcity">{errors.name.message}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">رقم التيليفون</label>
              <input
                {...register("phone")}
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                className="w-full rounded-xl border border-border px-4 py-3 text-left focus:border-rose focus:outline-none"
                placeholder="06xxxxxxxx"
                dir="ltr"
              />
              <p className="mt-1.5 text-xs text-muted">رقم مغربي يبدا بـ 06 أو 07 — باش نقدروا نعيّطو ليكِ</p>
              {errors.phone ? (
                <p className="mt-1 text-xs text-scarcity">{errors.phone.message}</p>
              ) : phoneValue && isValidMaPhone(phoneValue) ? (
                <p className="mt-1 text-xs text-rose">✓ رقم مغربي صالح</p>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={!isValid}
              className="w-full rounded-xl bg-rose py-4 text-lg font-semibold text-white transition-colors hover:bg-rose-dark disabled:cursor-not-allowed disabled:opacity-40"
            >
              أكّدي الطلب — الدفع عند الاستلام
            </button>
            <p className="text-center text-xs text-muted">
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
      </div>
    </>
  );
}
