import { Product } from "@/data/products";
import ProductImage from "@/components/ProductImage";
import { Star, Shield, Truck, RotateCcw, Leaf, Moon, Smile, Sparkles } from "lucide-react";
import OfferSelector from "@/components/OfferSelector";
import TrustBadges from "@/components/TrustBadges";

const PRODUCT_TRUST: Record<
  Product["slug"],
  { icon: typeof Shield; label: string }[]
> = {
  cyclecalm: [
    { icon: Moon, label: "دعم الدورة" },
    { icon: Leaf, label: "Sugar-free" },
    { icon: RotateCcw, label: "ضمان 14 يوم" },
  ],
  oralflora: [
    { icon: Smile, label: "بروبيوتيك فموي" },
    { icon: Shield, label: "Halal" },
    { icon: RotateCcw, label: "ضمان 14 يوم" },
  ],
  clearbalance: [
    { icon: Sparkles, label: "بلا تبييض" },
    { icon: Leaf, label: "Vegan gummy" },
    { icon: RotateCcw, label: "ضمان 14 يوم" },
  ],
};

export default function ProductHero({ product }: { product: Product }) {
  const trustItems = PRODUCT_TRUST[product.slug];

  return (
    <>
      <section className="relative bg-cream hero-glow border-b border-border">
        <div className="max-w-container mx-auto px-4 py-10 md:py-14">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <div id="hero-image" className="pb-6 scroll-mt-header">
              <div
                className={`relative aspect-square rounded-3xl overflow-hidden bg-white border-2 shadow-xl ${
                  product.slug === "cyclecalm"
                    ? "border-scarcity/30 shadow-scarcity/15"
                    : product.slug === "oralflora"
                      ? "border-sage/30 shadow-sage/15"
                      : "border-violet-200 shadow-violet-100"
                }`}
              >
                <ProductImage
                  src={product.heroImage ?? product.image}
                  alt={product.nameAr}
                  fill
                  priority
                  quality={92}
                  className="object-cover object-center"
                />
              </div>
              <p className="text-center text-sm text-gray-500 mt-4">
                ⭐ {product.rating} · {product.reviewCount}+ تقييم
              </p>
            </div>

            <div>
              <p className="inline-block bg-sage/10 text-sage text-sm font-semibold px-3 py-1 rounded-full mb-3">
                مكمل غذائي · gummies · {product.problemTag}
              </p>

              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={
                      i < Math.floor(product.rating) ? "fill-gold text-gold" : "text-gray-200"
                    }
                  />
                ))}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 leading-tight">
                {product.nameAr}
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-4">{product.taglineAr}</p>

              <blockquote className="bg-white border-r-4 border-gold pr-4 py-3 rounded-l-lg text-gray-700 mb-5 leading-relaxed">
                &ldquo;{product.heroQuote}&rdquo;
              </blockquote>

              <p className="text-gray-500 text-sm mb-5">{product.shortDescriptionAr}</p>

              <div className="grid grid-cols-3 gap-2 mb-5">
                {trustItems.map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-1 bg-white border border-border rounded-xl p-2.5 text-center"
                  >
                    <Icon size={18} className="text-sage" />
                    <span className="text-[11px] text-gray-600 font-medium leading-tight">{label}</span>
                  </div>
                ))}
              </div>

              <OfferSelector slug={product.slug} />

              <div className="flex items-center gap-4 text-sm text-gray-500 mt-5">
                <span className="flex items-center gap-1">
                  <Truck size={16} className="text-sage" />
                  توصيل 2–4 أيام
                </span>
                <span className="flex items-center gap-1">
                  <Shield size={16} className="text-sage" />
                  COD
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TrustBadges className="py-4 bg-white border-b border-border" />
    </>
  );
}

export function GuaranteeBanner() {
  return (
    <section className="py-12 bg-sage/5 border-y border-sage/15">
      <div className="max-w-container mx-auto px-4 text-center max-w-2xl">
        <p className="text-sage font-bold text-lg mb-2">ضمان 14 يوم</p>
        <p className="text-gray-600 text-sm leading-relaxed">
          مكمل غذائي — إذا ما ناسبكِ، نسترد المبلغ. منتجاتنا لا تعالج أمراضاً؛ استشيري طبيبكِ
          عند الحمل أو الأدوية المزمنة.
        </p>
      </div>
    </section>
  );
}
