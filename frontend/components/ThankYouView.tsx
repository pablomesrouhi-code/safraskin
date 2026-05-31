"use client";

import Link from "next/link";
import {
  CheckCircle2,
  Phone,
  PhoneCall,
  Package,
  Truck,
  Sparkles,
  Star,
  Shield,
} from "lucide-react";
import { getProduct, Product, ProductSlug } from "@/data/products";
import { formatPhoneDisplay } from "@/lib/phone";
import { CallWindow, OrderLine } from "@/lib/orderConfirmation";
import ThankYouCrossSells from "@/components/ThankYouCrossSells";
import ProductImage from "@/components/ProductImage";

type Props = {
  orderId: string;
  customerName?: string;
  customerPhone?: string;
  orderLines: OrderLine[];
  subtotal: number | null;
  total: number | null;
  upsellProduct: Product | null;
  upsellPrice: number | null;
  callWindow: CallWindow;
};

const MINI_REVIEWS = [
  { name: "نورة", city: "الرياض", text: "ردّوا عليّ بسرعة ووصل الطلب بسرعة — COD سهل." },
  { name: "سارة", city: "جدة", text: "المكالمة كانت واضحة — أكّدوا العنوان ووصل خلال 3 أيام." },
];

export default function ThankYouView({
  orderId,
  customerName,
  customerPhone,
  orderLines,
  subtotal,
  total,
  upsellProduct,
  upsellPrice,
  callWindow,
}: Props) {
  const firstName = customerName?.trim().split(/\s+/)[0];
  const phoneDisplay = customerPhone ? formatPhoneDisplay(customerPhone) : null;
  const purchasedSlugs = orderLines.map((l) => l.slug as ProductSlug);

  return (
    <div className="pb-24">
      {/* Sticky confirmation banner */}
      {phoneDisplay && (
        <div className="sticky top-16 z-30 bg-sage text-white border-b border-sage-dark/30 shadow-md">
          <div className="max-w-container mx-auto px-4 py-2.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-sm">
            <PhoneCall size={16} className="text-gold shrink-0 animate-pulse" />
            <span className="font-bold">{callWindow.headline}</span>
            <span className="text-white/80">·</span>
            <span dir="ltr" className="font-mono font-semibold tracking-wide">
              {phoneDisplay}
            </span>
          </div>
        </div>
      )}

      <div className="max-w-container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-5 ring-4 ring-sage/10">
              <CheckCircle2 size={36} className="text-sage" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {firstName ? `شكراً ${firstName}!` : "تم استلام طلبك بنجاح"}
            </h1>
            <p className="text-gray-500 text-sm">
              رقم الطلب ·{" "}
              <span className="font-mono font-semibold text-sage">{orderId}</span>
            </p>
            <p className="text-sage font-semibold mt-2">الدفع عند الاستلام — لا دفع مسبق</p>
          </div>

          {/* Call confirmation — core COD card */}
          <div className="rounded-2xl border-2 border-sage/25 bg-gradient-to-b from-sage/8 to-white p-5 md:p-6 mb-6 shadow-sm">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-sage flex items-center justify-center shrink-0">
                <Phone size={22} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="inline-block text-[10px] font-bold bg-sage text-white px-2.5 py-0.5 rounded-full mb-2">
                  {callWindow.badge}
                </span>
                <h2 className="font-bold text-lg text-gray-900 leading-snug">{callWindow.headline}</h2>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">{callWindow.subline}</p>
              </div>
            </div>

            {(customerName || phoneDisplay) && (
              <div className="rounded-xl bg-white border border-sage/15 p-4 space-y-3">
                {customerName && (
                  <div className="flex justify-between gap-4 text-sm">
                    <span className="text-gray-500 shrink-0">الاسم</span>
                    <span className="font-semibold text-gray-900 text-right">{customerName}</span>
                  </div>
                )}
                {phoneDisplay && (
                  <div className="flex justify-between gap-4 text-sm items-center">
                    <span className="text-gray-500 shrink-0">رقم المكالمة</span>
                    <span
                      dir="ltr"
                      className="font-mono font-bold text-lg text-sage tracking-wide"
                    >
                      {phoneDisplay}
                    </span>
                  </div>
                )}
              </div>
            )}

            <ul className="mt-4 space-y-2 text-sm text-gray-700">
              <li className="flex gap-2">
                <span className="text-sage font-bold">✓</span>
                <span>قد يظهر رقم غير محفوظ — <strong>أجيبي</strong> لتأكيد العنوان</span>
              </li>
              <li className="flex gap-2">
                <span className="text-sage font-bold">✓</span>
                <span>المكالمة قصيرة (دقيقتان) — تأكيد عنوان + موعد التوصيل</span>
              </li>
              <li className="flex gap-2">
                <span className="text-sage font-bold">✓</span>
                <span>ساعات التأكيد: 9 صباحاً — 9 مساءً · توصيل 2–4 أيام</span>
              </li>
            </ul>
          </div>

          {/* Order summary — clean rows */}
          {(orderLines.length > 0 || total !== null) && (
            <div className="rounded-2xl border border-border bg-white overflow-hidden mb-6">
              <div className="px-5 py-3.5 border-b border-border bg-cream/50">
                <h2 className="font-bold text-gray-900">ملخص الطلب</h2>
              </div>
              <div className="px-5 py-4 space-y-3">
                {orderLines.map((line) => {
                  const product = getProduct(line.slug);
                  if (!product) return null;
                  return (
                    <div key={line.slug} className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-cream shrink-0 border border-border">
                        <ProductImage
                          src={product.image}
                          alt={product.nameAr}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-gray-900">{product.nameAr}</p>
                        <p className="text-xs text-gray-500">{line.qty} {line.qty === 1 ? "قطعة" : "قطع"}</p>
                      </div>
                    </div>
                  );
                })}

                {upsellProduct && upsellPrice && (
                  <div className="flex items-center gap-3 pt-2 border-t border-dashed border-border">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-cream shrink-0 border border-gold/30">
                      <ProductImage
                        src={upsellProduct.image}
                        alt={upsellProduct.nameAr}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-sage">{upsellProduct.nameAr}</p>
                      <p className="text-xs text-gold font-medium">عرض لمرة واحدة</p>
                    </div>
                    <span className="font-bold text-sage tabular-nums shrink-0">
                      {upsellPrice} ر.س
                    </span>
                  </div>
                )}
              </div>

              {(subtotal !== null || total !== null) && (
                <div className="px-5 py-4 bg-sage/5 border-t border-border space-y-2">
                  {subtotal !== null && upsellPrice && total !== null && subtotal !== total && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>المجموع الفرعي</span>
                      <span className="tabular-nums">{subtotal} ر.س</span>
                    </div>
                  )}
                  {total !== null && (
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-900">المبلغ عند الاستلام</span>
                      <span className="text-2xl font-bold text-sage tabular-nums">{total} ر.س</span>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Shield size={12} className="text-sage" />
                    COD — تدفعين فقط عند استلام الطرد
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Timeline */}
          <div className="rounded-2xl border border-border bg-white p-5 md:p-6 mb-6">
            <h2 className="font-bold text-lg mb-4">رحلتكِ من الآن</h2>
            <div className="space-y-4">
              {[
                {
                  icon: PhoneCall,
                  title: "مكالمة التأكيد",
                  body: callWindow.isOpen
                    ? "خلال 10 دقائق — نؤكد العنوان وموعد التوصيل"
                    : "صباحاً — أول مكالمة من 9 ص",
                  active: true,
                },
                {
                  icon: Package,
                  title: "التجهيز",
                  body: "تغليف سري — لا أحد يعرف محتوى الطرد",
                  active: false,
                },
                {
                  icon: Truck,
                  title: "التوصيل",
                  body: "2–4 أيام · تدفعين عند الباب فقط",
                  active: false,
                },
                {
                  icon: Sparkles,
                  title: "النتائج",
                  body: "2 gummies يومياً · 60 يوم = شهر كامل — الالتزام يفرق",
                  active: false,
                },
              ].map((step, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                      step.active ? "bg-sage text-white" : "bg-sage/10 text-sage"
                    }`}
                  >
                    <step.icon size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{step.title}</p>
                    <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Excitement + social proof */}
          <div className="rounded-2xl bg-sage-dark text-white p-5 md:p-6 mb-6">
            <h2 className="font-bold text-lg mb-2">متحمسين لرحلتكِ معنا</h2>
            <p className="text-white/75 text-sm leading-relaxed mb-4">
              آلاف السعوديات يبدأن بروتوكول واحد — ثم يكملن المجموعة. gummies سهلة · مكونات
              واضحة · بدون وعود فارغة.
            </p>
            <div className="space-y-3">
              {MINI_REVIEWS.map((r) => (
                <div key={r.name} className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <div className="flex gap-0.5 mb-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={11} className="fill-gold text-gold" />
                    ))}
                  </div>
                  <p className="text-sm text-white/90 leading-relaxed">&ldquo;{r.text}&rdquo;</p>
                  <p className="text-xs text-white/50 mt-1">
                    {r.name} · {r.city}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Cross-sells */}
          <div className="rounded-2xl border border-border bg-cream p-5 md:p-6 mb-8">
            <ThankYouCrossSells excludeSlugs={purchasedSlugs} upsellSlug={upsellProduct?.slug} />
          </div>

          {/* Missed call FAQ */}
          <details className="rounded-xl border border-border bg-white p-4 mb-8 group">
            <summary className="font-semibold text-sm cursor-pointer list-none flex justify-between items-center">
              ماذا لو فاتتني المكالمة؟
              <span className="text-sage group-open:rotate-180 transition-transform text-xs">▼</span>
            </summary>
            <p className="mt-3 text-sm text-gray-600 leading-relaxed">
              سنحاول مرة أخرى خلال ساعات العمل. يمكنكِ أيضاً التواصل معنا عبر صفحة{" "}
              <Link href="/contact" className="text-sage font-medium underline">
                تواصل
              </Link>{" "}
              مع رقم طلبكِ.
            </p>
          </details>

          <div className="text-center space-y-3">
            <Link
              href="/collection"
              className="inline-block bg-sage hover:bg-sage-dark text-white font-semibold px-8 py-3.5 rounded-xl transition-colors"
            >
              تصفّح المجموعة
            </Link>
            <p>
              <Link href="/" className="text-sage hover:underline text-sm">
                ← العودة للرئيسية
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
