import ProductImage from "@/components/ProductImage";
import Link from "next/link";
import { formatPrice } from "@/lib/money";
import type { Product } from "@/data/products";
import { TIER_PRICES } from "@/data/products";

export default function CollectionProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/5]">
        <ProductImage src={product.image} alt={product.feelingTitle} fill emptyLabel={product.headlineAr} />
      </div>
      <div className="flex flex-1 flex-col p-4 md:p-5">
        <p className="text-xs font-semibold text-saffron-dark">{product.problemTitle}</p>
        <h3 className="mt-1.5 text-lg font-bold leading-snug">{product.feelingTitle}</h3>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted">{product.problemHook}</p>
        <p className="mt-3 text-xs text-saffron-dark">{product.headlineAr}</p>
        <p className="mt-3 text-sm font-bold text-rose">من {formatPrice(TIER_PRICES[1])}</p>
      </div>
    </Link>
  );
}
