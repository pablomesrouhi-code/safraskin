import ProductImage from "@/components/ProductImage";
import Link from "next/link";
import type { Product } from "@/data/products";
import { TIER_PRICES } from "@/data/products";

export default function CollectionProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group overflow-hidden rounded-3xl border border-border bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/5]">
        <ProductImage src={product.image} alt={product.nameAr} fill emptyLabel={product.nameAr} />
      </div>
      <div className="p-5">
        <p className="text-xs font-semibold text-saffron-dark">{product.problemTitle}</p>
        <h3 className="mt-1 text-lg font-bold">{product.nameAr}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">{product.taglineAr}</p>
        <p className="mt-4 text-sm font-bold text-rose">من {TIER_PRICES[1]} د.م · COD</p>
      </div>
    </Link>
  );
}
