"use client";

import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { Product, ProductSlug, getProduct } from "@/data/products";
import { useCart } from "@/context/CartContext";
import ProductImage from "@/components/ProductImage";

export default function ProductPageCrossSells({ product }: { product: Product }) {
  const { addSlug, openDrawer } = useCart();

  const crossSells = product.crossSellSlugs
    .map((slug) => getProduct(slug))
    .filter((p): p is Product => p !== undefined);

  if (crossSells.length === 0) return null;

  const handleAdd = (slug: ProductSlug) => {
    addSlug(slug);
    openDrawer();
  };

  return (
    <section className="py-20 pb-28 md:pb-20 bg-gradient-to-b from-cream to-white scroll-mt-header" id="complete-routine">
      <div className="max-w-container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-sage text-sm font-bold tracking-widest mb-3">أكملي بروتوكولك</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {product.nameAr} + الباقي = ثقة كاملة
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            نفس · حر · إبط — 3 بروتوكولات · صفر blind spots · باقة 349 ر.س
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {crossSells.map((p) => (
            <div
              key={p.slug}
              className="group bg-white rounded-3xl border border-border overflow-hidden hover:shadow-xl hover:shadow-sage/10 transition-all hover:-translate-y-1"
            >
              <Link href={`/products/${p.slug}`} className="block">
                <div className="relative aspect-[16/10] bg-cream overflow-hidden">
                  <ProductImage
                    src={p.image}
                    alt={p.nameAr}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </Link>

              <div className="p-6">
                <p className="text-sage text-xs font-bold mb-1">سفرا جلد · {p.problemTag}</p>
                <Link href={`/products/${p.slug}`}>
                  <h3 className="font-bold text-xl text-gray-900 mb-1 hover:text-sage transition-colors">
                    {p.nameAr}
                  </h3>
                </Link>
                <p className="text-sm text-gray-500 mb-4">{p.taglineAr}</p>
                <p className="text-xs text-gray-400 italic mb-5 line-clamp-2">
                  &ldquo;{p.heroQuote}&rdquo;
                </p>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleAdd(p.slug)}
                    className="flex-1 flex items-center justify-center gap-2 bg-sage hover:bg-sage-dark text-white font-semibold py-3.5 rounded-xl transition-colors"
                  >
                    <Plus size={18} />
                    أضيفي — 199 ر.س
                  </button>
                  <Link
                    href={`/products/${p.slug}`}
                    className="flex items-center gap-1 text-sm text-sage font-semibold hover:gap-2 transition-all px-3 py-3.5"
                  >
                    التفاصيل
                    <ArrowLeft size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <div className="inline-flex items-center gap-3 bg-sage/5 border border-sage/20 rounded-2xl px-6 py-4">
            <span className="text-2xl font-bold text-sage">349 ر.س</span>
            <span className="text-gray-500 text-sm text-right">
              الباقة الكاملة · 3 بروتوكولات
              <br />
              <span className="text-scarcity font-semibold">وفّري 248 ر.س</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
