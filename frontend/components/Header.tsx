"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const { itemCount, openDrawer } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-cream/95 backdrop-blur">
      <p className="bg-ink text-center text-[11px] text-cream py-1.5 px-3">
        الدفع عند الاستلام · التوصيل لجميع المدن المغربية
      </p>
      <div className="mx-auto flex max-w-container items-center justify-between gap-3 px-4 py-3">
        <BrandLogo />
        <nav className="hidden items-center gap-6 text-sm font-medium text-muted md:flex">
          <Link href="/collection" className="hover:text-ink">
            المجموعة
          </Link>
          <Link href="/about" className="hover:text-ink">
            المختبر
          </Link>
          <Link href="/contact" className="hover:text-ink">
            تواصل
          </Link>
        </nav>
        <button
          type="button"
          onClick={openDrawer}
          className="relative rounded-full p-2 text-ink hover:bg-white"
          aria-label="السلة"
        >
          <ShoppingBag size={22} />
          {itemCount > 0 && (
            <span className="absolute -left-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose px-1 text-[10px] font-bold text-white">
              {itemCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
