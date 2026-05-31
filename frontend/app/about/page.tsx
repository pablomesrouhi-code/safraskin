import Link from "next/link";
import { AUTHORITY_PILLARS, BRAND_NAME_AR } from "@/data/brand";

export default function AboutPage() {
  return (
    <div className="max-w-container mx-auto px-4 py-12 md:py-16">
      <div className="max-w-3xl mx-auto">
        <p className="text-sage font-semibold text-sm mb-3 tracking-wide">من نحن</p>
        <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
          {BRAND_NAME_AR} — مكملات · مو متجر عام
        </h1>

        <div className="space-y-6 text-gray-700 leading-relaxed text-lg">
          <p>
            سفرا جلد وُلدت من مشاكل تُعاش بصمت: أيام الدورة المرهقة · قلق الفم في المجلس ·
            بشرة تتأثر بالتوتر. مشاعر تؤثر على ثقتكِ — ونادراً ما تُناقش بكرامة.
          </p>
          <p>
            قرّرنا نكون علامة متخصصة في <strong>gummies</strong> فقط: ثلاث تركيبات، مكونات
            مُعلنة، جرعة واضحة (2 حبات يومياً)، وصوت يفهمكِ — بدون تبييض · بدون وعود طبية.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 pt-6">كيف نتواصل معكِ</h2>
          <ul className="space-y-3 text-base">
            <li>نبدأ بمشاعركِ — لأن الثقة تنكسر قبل الجسم أحياناً.</li>
            <li>ندعم كل رسالة بمكونات واضحة — B6 · بروبيوتيك فموي · Zinc · وغيرها.</li>
            <li>نحترم كرامتكِ — مكمل غذائي · ليس دواءً · استشيري طبيبكِ عند الحمل.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 pt-6">منتجاتنا الثلاثة</h2>
          <ul className="space-y-3">
            <li className="bg-cream rounded-xl p-5 border border-border">
              <strong className="text-sage">هدوء الدورة</strong> — B6 + Magnesium + Vitex ·
              دعم أيام الدورة
            </li>
            <li className="bg-cream rounded-xl p-5 border border-border">
              <strong className="text-sage">فلورا الفم</strong> — بروبيوتيك فموي K12 · ثقة
              الكلام
            </li>
            <li className="bg-cream rounded-xl p-5 border border-border">
              <strong className="text-sage">توازن البشرة</strong> — Zinc + Probiotic + DHA ·
              بشرة تحت الضغط · بلا تبييض
            </li>
          </ul>

          <div className="grid sm:grid-cols-2 gap-4 pt-4">
            {AUTHORITY_PILLARS.map((p) => (
              <div key={p.title} className="bg-white border border-border rounded-xl p-4 text-sm">
                <span className="text-xl">{p.icon}</span>
                <p className="font-semibold text-gray-900 mt-2">{p.title}</p>
                <p className="text-gray-500 mt-1">{p.body}</p>
              </div>
            ))}
          </div>

          <blockquote className="border-r-4 border-sage pr-5 py-2 text-xl text-gray-800 font-medium">
            اتزانكِ يبدأ من الداخل — 2 gummies · كل يوم.
          </blockquote>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/collection"
            className="inline-flex justify-center bg-sage hover:bg-sage-dark text-white font-semibold px-8 py-3.5 rounded-xl transition-colors"
          >
            اكتشفي المجموعة
          </Link>
          <Link
            href="/contact"
            className="inline-flex justify-center border-2 border-sage/25 text-sage hover:border-sage font-semibold px-8 py-3.5 rounded-xl transition-colors"
          >
            تواصل معنا
          </Link>
        </div>
      </div>
    </div>
  );
}
