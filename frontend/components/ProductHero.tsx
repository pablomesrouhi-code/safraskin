import ProductImage from "@/components/ProductImage";
import OfferSelector from "@/components/OfferSelector";
import type { Product } from "@/data/products";

export default function ProductHero({ product }: { product: Product }) {
  return (
    <section className="hero-glow border-b border-border">
      <div className="mx-auto grid max-w-container items-center gap-8 px-4 py-8 md:grid-cols-2 md:py-12">
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-white shadow-sm">
          <ProductImage
            src={product.heroImage}
            alt={product.feelingTitle}
            fill
            priority
            emptyLabel={product.headlineAr}
          />
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-saffron-dark">
            {product.problemTitle}
          </p>
          <h1 className="mt-2 text-3xl font-bold leading-snug text-ink md:text-[2.4rem]">
            {product.feelingTitle}
          </h1>
          <p className="mt-4 text-[15px] font-semibold leading-8 text-ink">{product.problemHook}</p>
          <p className="mt-3 text-[15px] leading-8 text-muted">{product.taglineAr}</p>
          <p className="mt-4 text-sm text-saffron-dark">
            {product.headlineAr} · {product.formulaLine}
          </p>
          <div className="mt-6">
            <OfferSelector slug={product.slug} />
          </div>
        </div>
      </div>
    </section>
  );
}
