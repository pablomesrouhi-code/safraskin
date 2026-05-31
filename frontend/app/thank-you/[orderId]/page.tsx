import Link from "next/link";
import { CheckCircle2, Phone, Package, Truck } from "lucide-react";
import { getProduct } from "@/data/products";
import ThankYouCrossSells from "@/components/ThankYouCrossSells";

type Props = {
  params: { orderId: string };
  searchParams: { upsell?: string; upsellPrice?: string; total?: string };
};

const STEPS = [
  { icon: CheckCircle2, title: "تأكيد الطلب", body: "فريقنا يراجع طلبك خلال ساعات العمل" },
  { icon: Package, title: "التجهيز", body: "تغليف سري — لا أحد يعرف محتوى الطرد" },
  { icon: Truck, title: "التوصيل", body: "الدفع عند الاستلام فقط — بدون أي مبلغ مقدم" },
];

export default function ThankYouPage({ params, searchParams }: Props) {
  const upsellProduct = searchParams.upsell ? getProduct(searchParams.upsell) : null;
  const upsellPrice = searchParams.upsellPrice ? Number(searchParams.upsellPrice) : null;
  const total = searchParams.total ? Number(searchParams.total) : null;

  return (
    <div className="max-w-container mx-auto px-4 py-12 pb-20">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-sage" />
          </div>
          <h1 className="text-3xl font-bold mb-3">تم استلام طلبك بنجاح</h1>
          <p className="text-gray-500 mb-1">
            رقم الطلب:{" "}
            <span className="font-mono font-semibold text-sage">{params.orderId}</span>
          </p>
          <p className="text-gray-600">الدفع عند الاستلام · لا حاجة لبطاقة بنكية</p>
        </div>

        {(total !== null || upsellProduct) && (
          <div className="bg-white rounded-2xl border border-border p-6 mb-8 space-y-3">
            <h2 className="font-bold text-lg">ملخص الطلب</h2>
            {upsellProduct && upsellPrice && (
              <div className="flex justify-between text-sm border-b border-border pb-3">
                <span className="text-sage font-medium">+ {upsellProduct.nameAr} (عرض خاص)</span>
                <span className="font-semibold">{upsellPrice} ر.س</span>
              </div>
            )}
            {total !== null && (
              <div className="flex justify-between font-bold text-lg">
                <span className="text-sage">{total} ر.س</span>
                <span>المجموع · COD</span>
              </div>
            )}
          </div>
        )}

        <div className="bg-gold-light/30 border border-gold/20 rounded-2xl p-5 mb-8 flex gap-4 items-start">
          <Phone size={24} className="text-sage shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-gray-900 mb-1">تأكدي أن هاتفك متاح</p>
            <p className="text-sm text-gray-600 leading-relaxed">
              قد نتواصل معك لتأكيد العنوان وموعد التوصيل. تأكدي أن رقمك صحيح والهاتف مفتوح.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-border p-6 mb-8">
          <h2 className="font-bold text-lg mb-5">ماذا يحدث الآن؟</h2>
          <div className="space-y-5">
            {STEPS.map((step, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-sage/10 flex items-center justify-center shrink-0">
                  <step.icon size={20} className="text-sage" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{i + 1}. {step.title}</p>
                  <p className="text-sm text-gray-600 mt-0.5">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-cream rounded-2xl p-6 mb-10">
          <ThankYouCrossSells />
        </div>

        <div className="text-center space-y-3">
          <Link
            href="/collection"
            className="inline-block bg-sage hover:bg-sage-dark text-white font-semibold px-8 py-3 rounded-xl transition-colors"
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
  );
}
