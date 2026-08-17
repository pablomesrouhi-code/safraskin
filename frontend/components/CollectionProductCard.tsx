"use client";

import ProductImage from "@/components/ProductImage";
import Link from "next/link";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";

export default function CollectionProductCard({ product }: { product: Product }) {
  const { addToCart, buyNow } = useCart();

  return (
    <article className="flex min-w-0 flex-col overflow-hidden rounded-3xl border border-border bg-white shadow-sm">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/5]">
          <ProductImage src={product.image} alt={product.feelingTitle} fill emptyLabel={product.headlineAr} />
        </div>
        <div className="p-4 pb-0 md:p-6 md:pb-0">
          <p className="text-xs font-semibold text-saffron-dark">{product.problemTitle}</p>
          <h3 className="mt-1.5 text-lg font-bold leading-[1.45] md:text-xl">{product.feelingTitle}</h3>
          <p className="mt-2 text-sm leading-7 text-muted">{product.problemHook}</p>
          <p className="mt-3 text-xs leading-6 text-saffron-dark">{product.headlineAr}</p>
        </div>
      </Link>
      <div className="mt-auto space-y-2 p-4 md:p-6">
        <Link
          href={`/products/${product.slug}`}
          className="flex w-full items-center justify-center rounded-xl border border-saffron/40 bg-gold-light/40 py-2.5 text-sm font-bold text-ink hover:bg-gold-light"
        >
          بغيتي تقراي التفاصيل؟
        </Link>
        <button
          type="button"
          onClick={() => addToCart(product.slug, 1)}
          className="flex w-full items-center justify-center rounded-xl border border-rose py-2.5 text-sm font-bold text-rose hover:bg-rose/5"
        >
          أضيفي للسلة
        </button>
        <button
          type="button"
          onClick={() => buyNow(product.slug, 1)}
          className="flex w-full items-center justify-center rounded-xl bg-rose py-2.5 text-sm font-bold text-white hover:bg-rose-dark"
        >
          اطلبي · الدفع عند الاستلام
        </button>
      </div>
    </article>
  );
}
