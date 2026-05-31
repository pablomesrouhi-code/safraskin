import ProductImage from "@/components/ProductImage";
import { Product } from "@/data/products";
import IngredientsList from "@/components/IngredientsList";
import ProductFAQ from "@/components/ProductFAQ";
import ProductReviews from "@/components/ProductReviews";
import ProductPageCrossSells from "@/components/ProductPageCrossSells";
import ScrollToOrderCTA from "@/components/ScrollToOrderCTA";
import ProductHero, { GuaranteeBanner } from "@/components/ProductHero";

export default function ProductLanding({ product }: { product: Product }) {
  return (
    <>
      <ProductHero product={product} />

      {/* Problem hook */}
      <section className="py-20 bg-white relative">
        <div className="max-w-container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm font-semibold text-gold uppercase tracking-widest mb-4">تعرفين هذا الشعور؟</p>
            <h2 className="text-2xl md:text-4xl font-bold text-sage mb-6 leading-snug">
              {product.problemHook}
            </h2>
            <p className="text-gray-600 text-lg md:text-xl leading-relaxed">{product.problemBody}</p>
          </div>
        </div>
      </section>

      {/* Story sections */}
      {product.sections.map((section, i) => (
        <section key={i} className={`py-20 ${i % 2 === 0 ? "bg-cream" : "bg-white"}`}>
          <div className="max-w-container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
            <div className={i % 2 === 0 ? "md:order-2" : "md:order-1"}>
              <span className="text-sage text-sm font-bold mb-3 block">0{i + 1}</span>
              <h2 className="text-2xl md:text-3xl font-bold mb-5 leading-snug">{section.title}</h2>
              <p className="text-gray-600 text-lg leading-relaxed">{section.body}</p>
            </div>
            <div
              className={`relative aspect-[4/3] rounded-3xl overflow-hidden bg-white border border-border shadow-lg ${i % 2 === 0 ? "md:order-1" : "md:order-2"}`}
            >
              <ProductImage src={section.image} alt={section.title} fill className="object-cover" />
            </div>
          </div>
        </section>
      ))}

      {/* Mechanism */}
      <section className="py-20 bg-sage text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(196,162,101,0.15),transparent_60%)]" />
        <div className="max-w-container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-gold-light text-sm font-semibold mb-3">العلم وراء المنتج</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{product.mechanismTitle}</h2>
            <p className="text-white/85 text-lg md:text-xl leading-relaxed">{product.mechanismBody}</p>
          </div>
        </div>
      </section>

      {/* Ingredients */}
      <section className="py-20 bg-white">
        <div className="max-w-container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">المكونات · شفافية كاملة</h2>
            <p className="text-gray-400">كل مكون · وفائدته · بدون أسرار</p>
          </div>
          <div className="max-w-xl mx-auto">
            <IngredientsList items={product.ingredients} />
          </div>
        </div>
      </section>

      {/* How to use */}
      <section className="py-20 bg-cream">
        <div className="max-w-container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">كيف تستخدمينه؟</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {product.howToUse.map((step) => (
              <div
                key={step.step}
                className="bg-white rounded-2xl border border-border p-8 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-full bg-sage text-white font-bold text-lg flex items-center justify-center mx-auto mb-5">
                  {step.step}
                </div>
                <h3 className="font-bold text-gray-900 mb-3 text-lg">{step.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-20 bg-white">
        <div className="max-w-container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">سفرا جلد vs البدائل العادية</h2>
          <div className="hidden md:block max-w-2xl mx-auto overflow-hidden rounded-2xl border border-border shadow-sm">
            <div className="grid grid-cols-3 bg-sage text-white text-sm font-semibold text-center">
              <div className="p-4" />
              <div className="p-4 opacity-70">العادي</div>
              <div className="p-4 bg-sage-dark">سفرا جلد ✓</div>
            </div>
            {product.comparison.map((row, i) => (
              <div
                key={row.title}
                className={`grid grid-cols-3 text-sm border-t border-border ${i % 2 === 0 ? "bg-white" : "bg-cream/50"}`}
              >
                <div className="p-4 font-semibold text-gray-900">{row.title}</div>
                <div className="p-4 text-gray-400 text-center">{row.generic}</div>
                <div className="p-4 text-sage font-semibold text-center bg-sage/5">{row.ours}</div>
              </div>
            ))}
          </div>
          <div className="md:hidden space-y-3 max-w-md mx-auto">
            {product.comparison.map((row) => (
              <div key={row.title} className="bg-cream rounded-2xl border border-border p-5">
                <p className="font-bold text-gray-900 mb-3">{row.title}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between gap-3 pb-2 border-b border-border/60">
                    <span className="text-gray-400">العادي</span>
                    <span className="text-gray-600">{row.generic}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-sage font-semibold">سفرا جلد ✓</span>
                    <span className="text-sage font-semibold">{row.ours}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-20 bg-cream border-y border-border">
        <div className="max-w-container mx-auto px-4">
          <ProductReviews reviews={product.reviews} productName={product.nameAr} />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">أسئلة شائعة</h2>
          <ProductFAQ items={product.faqs} />
        </div>
      </section>

      <GuaranteeBanner />
      <ProductPageCrossSells product={product} />
      <ScrollToOrderCTA />
    </>
  );
}
