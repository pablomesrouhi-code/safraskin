"use client";

import { useCart } from "@/context/CartContext";
import { useEffect } from "react";

export default function CartPage() {
  const { openDrawer } = useCart();

  useEffect(() => {
    openDrawer();
  }, [openDrawer]);

  return (
    <div className="mx-auto max-w-container px-4 py-16 text-center">
      <h1 className="text-2xl font-bold">السلة</h1>
      <p className="mt-3 text-muted">السلّة كتفتح هنا على الجانب. زيدِ منتجات من المجموعة.</p>
    </div>
  );
}
