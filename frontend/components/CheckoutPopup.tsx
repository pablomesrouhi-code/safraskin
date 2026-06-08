"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, ShieldCheck, Package, Truck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { getProductOrThrow } from "@/data/products";
import { isValidKsaPhone } from "@/lib/phone";
import { trackEvent } from "@/lib/track";

const schema = z.object({
  name: z.string().min(2, "الاسم مطلوب (حرفين على الأقل)"),
  phone: z.string().refine(isValidKsaPhone, "أدخلي رقم سعودي يبدأ بـ 05"),
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
      <div className="fixed inset-0 bg-black/50 z-[60]" onClick={closeCheckout} />
      <div
        className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-lg bg-white rounded-2xl z-[60] shadow-2xl max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-labelledby="checkout-title"
      >
        <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-white rounded-t-2xl">
          <button onClick={closeCheckout} className="p-1 text-gray-500" aria-label="إغلاق">
            <X size={22} />
          </button>
          <h2 id="checkout-title" className="font-bold text-lg">📋 ملخص طلبك</h2>
        </div>

        <div className="p-5 space-y-5">
          <div className="bg-cream rounded-xl p-4 space-y-3">
            {state.items.map((item) => {
              const product = getProductOrThrow(item.slug);
              return (
                <div key={item.slug} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0 text-right">
                    <p className="font-medium text-sm text-gray-900">{product.nameAr}</p>
                    <p className="text-xs text-gray-500">{item.qty} {item.qty === 1 ? "قطعة" : "قطع"}</p>
                  </div>
                </div>
              );
            })}
            <div className="border-t border-border/60 pt-3 flex justify-between items-center">
              <span className="text-xl font-bold text-sage tabular-nums">{total} ر.س</span>
              <div className="text-right">
                <p className="font-bold text-gray-900">المجموع</p>
                <p className="text-xs text-gray-500">الدفع عند الاستلام</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-border rounded-xl p-3 text-sm text-center text-gray-600">
            ✓ علامة سعودية متخصصة · ✓ COD · ✓ تغليف سري · ⏳ شحن 2–4 أيام
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs text-center text-gray-600">
            <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-cream">
              <ShieldCheck size={18} className="text-sage" />
              <span>COD آمن</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-cream">
              <Package size={18} className="text-sage" />
              <span>تغليف سري</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-cream">
              <Truck size={18} className="text-sage" />
              <span>توصيل KSA</span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">الاسم الكامل</label>
              <input
                {...register("name")}
                autoComplete="name"
                className="w-full border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-sage"
                placeholder="مثال: فاطمة العتيبي"
              />
              {errors.name && (
                <p className="text-scarcity text-xs mt-1">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">رقم الجوال</label>
              <input
                {...register("phone")}
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                className="w-full border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-sage text-left"
                placeholder="05xxxxxxxx"
                dir="ltr"
              />
              <p className="text-gray-400 text-xs mt-1.5">مثال: 0501234567</p>
              {errors.phone ? (
                <p className="text-scarcity text-xs mt-1">{errors.phone.message}</p>
              ) : phoneValue && isValidKsaPhone(phoneValue) ? (
                <p className="text-sage text-xs mt-1">✓ رقم سعودي صالح</p>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={!isValid}
              className="w-full bg-sage hover:bg-sage-dark disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-colors text-lg"
            >
              تأكيد طلبي — الدفع عند الاستلام
            </button>
            <p className="text-xs text-gray-500 text-center">
              بالضغط على تأكيد، توافقين على{" "}
              <a href="/legal/terms" className="text-sage underline">الشروط</a>
              {" "}و{" "}
              <a href="/legal/privacy" className="text-sage underline">الخصوصية</a>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
