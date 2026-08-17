import ProductImage from "@/components/ProductImage";
import Link from "next/link";
import { formatPrice } from "@/lib/money";
import type { Product } from "@/data/products";
import { TIER_PRICES } from "@/data/products";

export default function CollectionProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-[1.75rem] border border-border bg-white shadow-sm transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[4/5] min-h-[280px] md:min-h-[420px]">
        <ProductImage src={product.image} alt={product.headlineAr} fill emptyLabel={product.headlineAr} />
      </div>
      <div className="flex flex-1 flex-col p-6 md:p-8">
        <p className="text-sm font-semibold text-saffron-dark">{product.problemTitle}</p>
        <h3 className="mt-2 text-2xl font-bold leading-snug md:text-[1.75rem]">{product.headlineAr}</h3>
        <p className="mt-3 text-[15px] leading-7 text-muted">{product.formulaLine}</p>
        <p className="mt-6 text-base font-bold text-rose">من {formatPrice(TIER_PRICES[1])}</p>
      </div>
    </Link>
  );
}
