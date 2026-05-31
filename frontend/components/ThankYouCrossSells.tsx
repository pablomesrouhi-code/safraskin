"use client";

import { PRODUCTS } from "@/data/products";
import CrossSellCards from "@/components/CrossSellCards";
import { useCart } from "@/context/CartContext";

export default function ThankYouCrossSells() {
  const { addSlug, openDrawer } = useCart();

  const handleAdd = (slug: (typeof PRODUCTS)[number]["slug"]) => {
    addSlug(slug);
    openDrawer();
  };

  return (
    <CrossSellCards
      products={PRODUCTS}
      onAdd={handleAdd}
      title="أكملي مجموعتك — طلب جديد"
    />
  );
}
