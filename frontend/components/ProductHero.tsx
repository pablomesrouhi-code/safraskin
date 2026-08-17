import ProductImage from "@/components/ProductImage";
import OfferSelector from "@/components/OfferSelector";
import type { Product } from "@/data/products";

export default function ProductHero({ product }: { product: Product }) {
  return (
    <section className="hero-glow border-b border-border">
      <div className="mx-auto flex max-w-container flex-col gap-6 px-4 py-6 md:py-12">
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-white shadow-sm md:aspect-[16/10]">
          <ProductImage
            src={product.heroImage}
            alt={product.feelingTitle}
            fill
            priority
            emptyLabel={product.headlineAr}
          />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-saffron-dark">
            {product.problemTitle}
          </p>
          <h1 className="mt-2 text-[1.65rem] font-bold leading-[1.5] text-ink md:text-[2.4rem]">
            {product.feelingTitle}
          </h1>
          <p className="mt-4 text-[15px] font-semibold leading-8 text-ink">{product.problemHook}</p>
          <p className="mt-3 text-[15px] leading-8 text-muted">{product.taglineAr}</p>
          <p className="mt-4 text-sm leading-7 text-saffron-dark">
            {product.headlineAr}
            <span className="mt-1 block">{product.formulaLine}</span>
          </p>
          <div className="mt-6">
            <OfferSelector slug={product.slug} />
          </div>
        </div>
      </div>
    </section>
  );
}
