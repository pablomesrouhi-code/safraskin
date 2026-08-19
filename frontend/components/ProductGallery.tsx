"use client";

import { useEffect, useState } from "react";
import ProductImage from "@/components/ProductImage";
import type { Product } from "@/data/products";

export default function ProductGallery({ product }: { product: Product }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = product.gallery[activeIndex] ?? product.gallery[0];
  const imageCount = product.gallery.length;

  useEffect(() => {
    if (imageCount < 2) return;
    const nextImage = new Image();
    nextImage.src = product.gallery[(activeIndex + 1) % imageCount].src;
  }, [activeIndex, imageCount, product.gallery]);

  const showPrevious = () => {
    setActiveIndex((current) => (current - 1 + imageCount) % imageCount);
  };

  const showNext = () => {
    setActiveIndex((current) => (current + 1) % imageCount);
  };

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

        {imageCount > 1 ? (
          <>
            <button
              type="button"
              onClick={showPrevious}
              className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-2xl text-ink shadow-md transition hover:bg-white"
              aria-label="الصورة السابقة"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={showNext}
              className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-2xl text-ink shadow-md transition hover:bg-white"
              aria-label="الصورة التالية"
            >
              ›
            </button>
            <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-ink/75 px-3 py-1 text-xs font-semibold text-white">
              {activeIndex + 1} / {imageCount}
            </span>
          </>
        ) : null}
      </div>

      <div className="sr-only" aria-live="polite">
        {activeImage?.label}
      </div>
    </div>
  );
}
