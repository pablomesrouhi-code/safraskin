import Link from "next/link";
import { ArrowLeft, Shield, FlaskConical, Heart, Users } from "lucide-react";
import { PRODUCTS, FAQ_ITEMS, REVIEWS, WELLNESS_ZONES } from "@/data/products";
import { AUTHORITY_PILLARS, SCIENCE_POINTS, BRAND_NAME_AR, BRAND_NAME_EN } from "@/data/brand";
import ProductCard from "@/components/ProductCard";
import TrustBadges from "@/components/TrustBadges";
import ReviewCard from "@/components/ReviewCard";
import HeroImageShowcase from "@/components/HeroImageShowcase";
import HeroCertificationBadges from "@/components/HeroCertificationBadges";
import AnimatedGuaranteeBanner from "@/components/AnimatedGuaranteeBanner";

const HERO_TRUST = [
  { icon: FlaskConical, label: "مكونات مُعلنة" },
  { icon: Shield, label: "Halal · Vegan" },
  { icon: Heart, label: "Gummies يومية" },
  { icon: Users, label: "ثقة سعوديات" },
];


export default function HomePage() {
  return (
    <>
      <AnimatedGuaranteeBanner />

      {/* ── HERO ── */}
      <section className="relative bg-cream hero-glow">
        <div className="max-w-container mx-auto px-4 py-10 md:py-16 w-full">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 xl:gap-24 items-center">
            <div className="order-1 lg:order-2">
              <HeroImageShowcase />
            </div>

            <div className="order-2 lg:order-1 lg:pr-4">
              <p className="text-sage text-sm font-semibold tracking-wide mb-4">
                {BRAND_NAME_AR} · {BRAND_NAME_EN}
              </p>

              <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-gray-900 leading-[1.15] mb-5">
                ثقتكِ تبدأ
                <br />
                <span className="text-sage">من الداخل.</span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 mb-4 leading-relaxed">
                دورة تُرهقكِ · فم يقلقكِ في المجلس · بشرة تتأثر بالتوتر — مشاعر حقيقية.
                نردّ بـ gummies مدروسة: مكونات مُعلنة · 2 حبات يومياً · COD.
              </p>

              <p className="text-base text-gray-500 mb-8 leading-relaxed">
                مو متجر مكملات عام · ثلاث مشاكل · ثلاث تركيبات — بلا تبييض · بلا وعود
                طبية.
              </p>

              <div className="grid grid-cols-2 gap-2 mb-6">
                {HERO_TRUST.map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-gradient-to-b from-white to-slate-50/80 px-3 py-2.5 shadow-sm"
                  >
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-sage/8 border border-sage/10 flex items-center justify-center">
                      <Icon size={15} className="text-sage" />
                    </div>
                    <span className="text-xs text-gray-700 font-semibold leading-tight">{label}</span>
                  </div>
                ))}
              </div>

              <HeroCertificationBadges />

              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <Link
                  href="/collection"
                  className="inline-flex items-center justify-center bg-sage hover:bg-sage-dark text-white font-bold px-8 py-4 rounded-2xl transition-all text-lg"
                >
                  اكتشفي المجموعة
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center border-2 border-sage/25 text-sage hover:border-sage font-semibold px-8 py-4 rounded-2xl transition-all"
                >
                  من نحن
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRODUCTS (أولاً بعد الهيرو) ── */}
      <section className="py-12 md:py-16 bg-white border-b border-border">
        <div className="max-w-container mx-auto px-4">
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <p className="text-sage text-sm font-bold tracking-widest mb-3">مجموعة مختارة</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">ثلاثة gummies — مشكلة واحدة لكل علبة</h2>
            <p className="text-gray-500 leading-relaxed">
              هدوء الدورة · فلورا الفم · توازن البشرة
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {PRODUCTS.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      <TrustBadges className="py-6 bg-white border-y border-border" />

      {/* ── EMPATHY + LOGIC ── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <p className="text-sage text-sm font-bold tracking-widest mb-3">نفهمكِ</p>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
              المشاعر حقيقية — والحل مدروس
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed">
              نخاطب ما تخجلين من قوله — ثم نشرح لكِ لماذا هذا البروتوكول منطقي لمشكلتكِ.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {WELLNESS_ZONES.map((item) => (
              <Link
                key={item.id}
                href={`/products/${item.slug}`}
                className="group bg-cream border border-border rounded-2xl p-8 hover:border-sage/40 hover:shadow-lg transition-all"
              >
                <p className="text-scarcity/90 text-sm font-semibold mb-3">ما تشعرين به</p>
                <p className="text-gray-800 font-medium leading-relaxed mb-6 min-h-[3.5rem]">
                  {item.feeling}
                </p>
                <p className="text-sage text-sm font-semibold mb-2">التركيبة</p>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">{item.mechanism}</p>
                <span className="text-sage font-semibold text-sm group-hover:underline inline-flex items-center gap-1">
                  {item.name}
                  <ArrowLeft size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── SCIENCE ── */}
      <section className="py-16 md:py-20 bg-cream border-y border-border">
        <div className="max-w-container mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-sage text-sm font-bold tracking-widest mb-3">منطق · مكونات · خبرة</p>
            <h2 className="text-3xl md:text-4xl font-bold">لماذا نثق في ما نقدّمه</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {SCIENCE_POINTS.map((point) => (
              <div key={point.title} className="bg-white rounded-2xl border border-border p-8">
                <h3 className="font-bold text-gray-900 text-lg mb-3">{point.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{point.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AUTHORITY ── */}
      <section className="py-16 md:py-20 bg-sage-dark text-white">
        <div className="max-w-container mx-auto px-4">
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <p className="text-gold-light text-sm font-bold tracking-widest mb-3">ثقة · أمان · تخصص</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">علامة تستحقين أن تثقيها</h2>
            <p className="text-white/70 leading-relaxed">
              الجمال يبدأ بالشعور بالأمان — نجمع بين التعاطف والدليل في كل خطوة.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {AUTHORITY_PILLARS.map((pillar) => (
              <div
                key={pillar.title}
                className="bg-white/5 border border-white/10 rounded-2xl p-7 text-center"
              >
                <span className="text-3xl mb-4 block">{pillar.icon}</span>
                <h3 className="font-bold mb-2">{pillar.title}</h3>
                <p className="text-sm text-white/65 leading-relaxed">{pillar.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-container mx-auto px-4">
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <p className="text-sage text-sm font-bold tracking-widest mb-3">إثبات اجتماعي</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">سعوديات يتكلمن بصراحة</h2>
            <p className="text-gray-500">
              تجارب من مدن مختلفة — عن المشاعر والنتائج والثقة في العلامة، مو عن «عروض».
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {REVIEWS.map((r) => (
              <ReviewCard key={r.name} review={r} />
            ))}
          </div>
        </div>
      </section>

      {/* ── MANIFESTO ── */}
      <section className="py-16 md:py-20 bg-cream border-y border-border">
        <div className="max-w-container mx-auto px-4 text-center max-w-3xl">
          <p className="text-sage text-sm font-bold tracking-widest mb-6">فلسفتنا</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight text-gray-900">
            اتزانكِ — مش وعود فارغة
          </h2>
          <p className="text-gray-600 text-lg md:text-xl leading-relaxed mb-6">
            سفرا جلد وُلدت لمشاكل ما كثير العلامات تتكلم عنها بصدق: الدورة · الفم · بشرة
            التوتر. مكملات غذائية — نشرح المكونات · نحترم كرامتكِ.
          </p>
          <p className="text-gray-500 leading-relaxed mb-10">
            جمال وعناية ذاتية من الداخل — للمرأة السعودية · دفع عند الاستلام.
          </p>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-sage font-semibold hover:underline"
          >
            اقرئي قصتنا
            <ArrowLeft size={16} />
          </Link>
        </div>
      </section>

      {/* ── BUNDLE ── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-sage/5 border border-sage/15 rounded-2xl p-8 md:p-12 text-center">
            <p className="text-sage text-sm font-bold mb-3">النظام الكامل</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">طقم الاتزان — الثلاثة معاً</h2>
            <p className="text-gray-600 mb-2">هدوء الدورة + فلورا الفم + توازن البشرة</p>
            <p className="text-4xl font-bold text-sage my-6">349 ر.س</p>
            <p className="text-gray-500 text-sm mb-8">وفر مقارنة بشراء 3 علب منفصلة</p>
            <Link
              href="/collection"
              className="inline-block bg-sage hover:bg-sage-dark text-white font-bold px-10 py-4 rounded-2xl transition-all"
            >
              اكتشفي الطقم الكامل
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 md:py-20 bg-cream">
        <div className="max-w-container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">أسئلة تهمكِ</h2>
            <p className="text-gray-500">شفافية قبل الشراء — كما تستحقين</p>
          </div>
          <div className="max-w-2xl mx-auto space-y-3">
            {FAQ_ITEMS.map((item) => (
              <details key={item.q} className="bg-white border border-border rounded-2xl p-5 group">
                <summary className="font-semibold cursor-pointer list-none flex justify-between items-center gap-4">
                  {item.q}
                  <span className="text-sage shrink-0 group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-14 md:py-16 bg-sage text-white text-center">
        <div className="max-w-container mx-auto px-4 max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">ابدئي بالمنتج اللي يناسبكِ</h2>
          <p className="text-white/75 mb-8 leading-relaxed">
            خطوة واحدة نحو ثقة أهدأ — مكونات واضحة · دعم سعودي · دفع عند الاستلام
          </p>
          <Link
            href="/collection"
            className="inline-block bg-white text-sage hover:bg-cream font-bold px-12 py-4 rounded-2xl transition-all"
          >
            اكتشفي البروتوكولات
          </Link>
        </div>
      </section>
    </>
  );
}
