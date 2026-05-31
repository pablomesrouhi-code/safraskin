"use client";

import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import { Star } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";

export default function CollectionProductCard({ product }: { product: Product }) {
  const { addSlug, openDrawer } = useCart();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addSlug(product.slug);
    openDrawer();
  };

  return (
    <div className="group bg-white rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square bg-white">
          <ProductImage
            src={product.image}
            alt={product.nameAr}
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-5 flex-1">
          <div className="flex items-center gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={14}
                className={
                  i < Math.floor(product.rating) ? "fill-gold text-gold" : "text-gray-300"
                }
              />
            ))}
            <span className="text-xs text-gray-500 mr-1">{product.rating}</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-0.5 leading-snug">{product.nameAr}</h3>
          <p className="text-sm text-gray-500 mb-3">{product.taglineAr}</p>
          <span className="text-xl font-bold text-sage">{product.unitPriceSar} ر.س</span>
        </div>
      </Link>
      <div className="px-5 pb-5">
        <button
          onClick={handleAdd}
          className="w-full bg-sage hover:bg-sage-dark text-white font-semibold py-3 rounded-xl transition-colors"
        >
          أضيفي للسلة
        </button>
      </div>
    </div>
  );
}
