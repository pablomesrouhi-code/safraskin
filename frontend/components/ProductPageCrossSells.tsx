import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import { PRODUCTS, type ProductSlug, TIER_PRICES } from "@/data/products";
import { formatPrice } from "@/lib/money";

export default function ProductPageCrossSells({ currentSlug }: { currentSlug: ProductSlug }) {
  const others = PRODUCTS.filter((p) => p.slug !== currentSlug);

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-container px-4 py-10 md:py-12">
        <h2 className="text-2xl font-bold">واش كاين إحساس آخر كيشبه ليكِ؟</h2>
        <p className="mt-2 text-sm leading-7 text-muted">
          صيغة أخرى لنفس الطلب — نفس التوصيل، ونفس الدفع عند الباب.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {others.map((p) => (
            <Link
              key={p.slug}
              href={`/products/${p.slug}`}
              className="overflow-hidden rounded-2xl border border-border bg-cream hover:border-rose/30"
            >
              <div className="relative aspect-[4/3]">
                <ProductImage src={p.image} alt={p.feelingTitle} fill emptyLabel={p.headlineAr} />
              </div>
              <div className="p-4">
                <p className="text-xs text-saffron-dark">{p.problemTitle}</p>
                <p className="mt-1 font-bold leading-snug">{p.feelingTitle}</p>
                <p className="mt-2 text-xs leading-6 text-muted">{p.problemHook}</p>
                <p className="mt-3 text-sm font-semibold text-rose">من {formatPrice(TIER_PRICES[1])}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
