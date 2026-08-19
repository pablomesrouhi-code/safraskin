"use client";

import { useState } from "react";
import ProductImage from "@/components/ProductImage";
import type { Product } from "@/data/products";

export default function ProductGallery({ product }: { product: Product }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = product.gallery[activeIndex] ?? product.gallery[0];

  return (
    <div className="min-w-0">
      <div className="relative aspect-square overflow-hidden rounded-3xl bg-white shadow-sm">
        <ProductImage
          src={activeImage?.src ?? product.heroImage}
          alt={activeImage?.label ?? product.feelingTitle}
          fill
          priority={activeIndex === 0}
          emptyLabel={product.headlineAr}
        />
      </div>

      <div className="mt-3 grid grid-cols-4 gap-2" aria-label="صور المنتج">
        {product.gallery.map((image, index) => (
          <button
            key={image.src}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`relative aspect-square overflow-hidden rounded-xl border-2 bg-white transition ${
              activeIndex === index
                ? "border-rose shadow-sm"
                : "border-transparent opacity-75 hover:opacity-100"
            }`}
            aria-label={image.label}
            aria-pressed={activeIndex === index}
          >
            <ProductImage src={image.src} alt={image.label} fill compact />
          </button>
        ))}
      </div>
    </div>
  );
}
