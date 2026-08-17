"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import type { ProductSlug } from "@/data/products";

export default function ScrollToOrderCTA({ slug }: { slug: ProductSlug }) {
  const [pastForm, setPastForm] = useState(false);
  const { buyNow } = useCart();

  useEffect(() => {
    const form = document.getElementById("offer-selector");
    if (!form) return;

    const update = () => {
      const rect = form.getBoundingClientRect();
      setPastForm(rect.bottom < 72);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  if (!pastForm) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-white/95 p-2.5 backdrop-blur">
      <button
        type="button"
        onClick={() => buyNow(slug, 1)}
        className="flex w-full items-center justify-center rounded-xl bg-rose py-3 text-sm font-extrabold text-white"
      >
        اطلبي · الدفع عند الاستلام
      </button>
    </div>
  );
}
