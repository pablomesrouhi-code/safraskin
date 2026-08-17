import ProductImage from "@/components/ProductImage";
import OfferSelector from "@/components/OfferSelector";
import type { Product } from "@/data/products";
import { Star } from "lucide-react";

export default function ProductHero({ product }: { product: Product }) {
  return (
    <section className="hero-glow border-b border-border">
      <div className="mx-auto grid max-w-container items-center gap-8 px-4 py-8 md:grid-cols-2 md:py-12">
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-white shadow-sm">
          <ProductImage
            src={product.heroImage}
            alt={product.nameAr}
            fill
            priority
            emptyLabel={product.gallery[0]?.label || "صورة المنتج"}
          />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-saffron-dark">
            {product.problemTitle}
          </p>
          <h1 className="mt-2 font-english text-3xl font-semibold text-ink md:text-4xl">
            {product.nameEn}
          </h1>
          <p className="mt-1 text-xl font-bold text-ink">{product.nameAr}</p>
          <p className="mt-3 text-base leading-8 text-muted">{product.heroQuote}</p>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <Star size={16} className="fill-saffron text-saffron" />
            <span className="font-semibold">{product.rating}</span>
            <span className="text-muted">· {product.reviewCount} رأي</span>
            <span className="text-muted">· {product.dailyOrders} طلب اليوم</span>
          </div>
          <p className="mt-4 text-sm leading-7 text-muted">{product.taglineAr}</p>
          <div className="mt-6">
            <OfferSelector slug={product.slug} />
          </div>
        </div>
      </div>
    </section>
  );
}
