import ProductImage from "@/components/ProductImage";
import OfferSelector from "@/components/OfferSelector";
import type { Product } from "@/data/products";

export default function ProductHero({ product }: { product: Product }) {
  return (
    <section className="hero-glow border-b border-border">
      <div className="mx-auto grid max-w-container items-center gap-6 px-4 py-6 md:grid-cols-2 md:gap-10 md:py-10">
        <div className="relative order-1 aspect-[4/5] overflow-hidden rounded-3xl bg-white shadow-sm md:order-2">
          <ProductImage
            src={product.heroImage}
            alt={product.feelingTitle}
            fill
            priority
            emptyLabel={product.headlineAr}
          />
        </div>
        <div className="order-2 min-w-0 md:order-1">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-saffron-dark">
            {product.problemTitle}
          </p>
          <h1 className="mt-2 text-[1.65rem] font-bold leading-[1.5] text-ink md:text-[2.15rem]">
            {product.feelingTitle}
          </h1>
          <p className="mt-3 text-sm leading-7 text-saffron-dark">{product.headlineAr}</p>
          <div className="mt-6">
            <OfferSelector slug={product.slug} />
          </div>
        </div>
      </div>
    </section>
  );
}
