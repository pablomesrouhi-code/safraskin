import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import { PRODUCTS, type ProductSlug, TIER_PRICES } from "@/data/products";

export default function ProductPageCrossSells({ currentSlug }: { currentSlug: ProductSlug }) {
  const others = PRODUCTS.filter((p) => p.slug !== currentSlug);

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-container px-4 py-14">
        <h2 className="text-2xl font-bold">كمّلي الروتين</h2>
        <p className="mt-2 text-sm text-muted">
          زيدِ منتج آخر من السلة من بعد ما تختاري العرض — نفس التوصيل، نفس الدفع عند الباب.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {others.map((p) => (
            <Link
              key={p.slug}
              href={`/products/${p.slug}`}
              className="overflow-hidden rounded-2xl border border-border bg-cream hover:border-rose/30"
            >
              <div className="relative aspect-[4/3]">
                <ProductImage src={p.image} alt={p.nameAr} fill emptyLabel={p.nameAr} />
              </div>
              <div className="p-4">
                <p className="text-xs text-saffron-dark">{p.problemTitle}</p>
                <p className="mt-1 font-bold">{p.nameAr}</p>
                <p className="mt-2 text-sm font-semibold text-rose">من {TIER_PRICES[1]} د.م</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
