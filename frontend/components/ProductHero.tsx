import ProductImage from "@/components/ProductImage";
import OfferSelector from "@/components/OfferSelector";
import { productCutout, type Product } from "@/data/products";

export default function ProductHero({ product }: { product: Product }) {
  return (
    <section className="hero-glow border-b border-border">
      <div className="mx-auto grid max-w-container items-center gap-5 px-4 py-5 md:grid-cols-2 md:gap-10 md:py-10">
        <div className="relative order-1 aspect-square min-w-0 overflow-hidden rounded-3xl border border-ink/15 bg-white shadow-sm md:order-2">
          <ProductImage
            src={product.gallery[0]?.src ?? product.heroImage}
            alt={product.gallery[0]?.label ?? product.feelingTitle}
            fill
            priority
            emptyLabel={product.headlineAr}
          />
          <div className="pointer-events-none absolute bottom-3 start-3 h-[46%] w-[38%] rounded-2xl border border-ink/15 bg-cream/95 p-2 shadow-sm md:bottom-4 md:start-4 md:p-3">
            <ProductImage
              src={productCutout(product.slug)}
              alt={product.nameAr}
              fill
              fit="contain"
              outlineShape
              priority
              emptyLabel={product.nameAr}
            />
          </div>
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
