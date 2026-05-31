"use client";

import { PRODUCTS } from "@/data/products";
import CollectionProductCard from "@/components/CollectionProductCard";
import TrustBadges from "@/components/TrustBadges";
import { useCart } from "@/context/CartContext";

export default function CollectionPage() {
  const { addSlug, openDrawer } = useCart();

  const addBundle = () => {
    PRODUCTS.forEach((p) => addSlug(p.slug));
    openDrawer();
  };

  return (
    <div className="max-w-container mx-auto px-4 py-12 md:py-16">
      <div className="text-center mb-12 max-w-2xl mx-auto">
        <p className="text-sage text-sm font-bold tracking-widest mb-3">مجموعة مختارة</p>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">مجموعة سفرا جلد</h1>
        <p className="text-gray-500 leading-relaxed">
          ثلاثة gummies — كل واحد لمشكلة واحدة. دورة · فم · بشرة التوتر.
        </p>
      </div>

      <div className="bg-sage/5 border border-sage/20 rounded-2xl p-8 md:p-10 text-center mb-12 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">طقم الاتزان الكامل</h2>
        <p className="text-gray-600 mb-1">هدوء الدورة + فلورا الفم + توازن البشرة</p>
        <p className="text-3xl font-bold text-sage my-4">349 ر.س</p>
        <p className="text-gray-500 text-sm mb-6">60 gummy لكل منتج · شهر كامل لكل مشكلة</p>
        <button
          onClick={addBundle}
          className="bg-sage hover:bg-sage-dark text-white font-semibold px-8 py-3.5 rounded-xl transition-colors"
        >
          ابدئي بالطقم الكامل
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {PRODUCTS.map((p) => (
          <CollectionProductCard key={p.slug} product={p} />
        ))}
      </div>

      <TrustBadges />
    </div>
  );
}
