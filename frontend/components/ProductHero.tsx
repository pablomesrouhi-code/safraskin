import ProductImage from "@/components/ProductImage";
import OfferSelector from "@/components/OfferSelector";
import type { Product } from "@/data/products";
import { Star } from "lucide-react";

export default function ProductHero({ product }: { product: Product }) {
  return (
    <section className="hero-glow border-b border-border">
      <div className="mx-auto grid max-w-container items-center gap-10 px-4 py-10 md:grid-cols-2 md:py-16">
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-white shadow-sm">
          <ProductImage
            src={product.heroImage}
            alt={product.headlineAr}
            fill
            priority
            emptyLabel={product.gallery[0]?.label || "صورة المنتج"}
          />
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-saffron-dark">
            {product.problemTitle}
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-snug text-ink md:text-[2.5rem]">
            {product.headlineAr}
          </h1>
          <p className="mt-3 text-sm leading-7 text-saffron-dark">{product.formulaLine}</p>
          <p className="mt-4 text-[15px] leading-8 text-muted">{product.heroQuote}</p>
          <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
            <Star size={16} className="fill-saffron text-saffron" />
            <span className="font-semibold">{product.rating}</span>
            <span className="text-muted">· {product.reviewCount} رأي</span>
            <span className="text-muted">· {product.dailyOrders} طلب اليوم</span>
          </div>
          <p className="mt-4 text-sm leading-7 text-muted">{product.taglineAr}</p>
          <div className="mt-7">
            <OfferSelector slug={product.slug} />
          </div>
        </div>
      </div>
    </section>
  );
}
