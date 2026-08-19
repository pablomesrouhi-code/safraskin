import ProductGallery from "@/components/ProductGallery";
import OfferSelector from "@/components/OfferSelector";
import type { Product } from "@/data/products";

export default function ProductHero({ product }: { product: Product }) {
  return (
    <section className="hero-glow border-b border-border">
      <div className="mx-auto grid max-w-container items-center gap-5 px-4 py-5 md:grid-cols-2 md:gap-10 md:py-10">
        <div className="order-1 min-w-0 md:order-2">
          <ProductGallery product={product} />
        </div>
        <div className="order-2 min-w-0 md:order-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-saffron-dark">
            {product.problemTitle}
          </p>
          <h1 className="mt-1.5 text-2xl font-bold leading-snug text-ink md:text-[2.1rem]">
            {product.feelingTitle}
          </h1>
          <p className="mt-3 text-sm font-semibold leading-7 text-ink md:text-[15px] md:leading-8">{product.problemHook}</p>
          <p className="mt-2 text-sm leading-7 text-muted md:leading-8">{product.taglineAr}</p>
          <p className="mt-3 text-xs text-saffron-dark md:text-sm">
            {product.headlineAr} · {product.formulaLine}
          </p>
          <div className="mt-4">
            <OfferSelector slug={product.slug} />
          </div>
        </div>
      </div>
    </section>
  );
}
