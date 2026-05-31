"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { BRAND_NAME_AR, BRAND_TAGLINE } from "@/data/brand";

const NAV = [
  { label: "الرئيسية", href: "/" },
  { label: "المجموعة", href: "/collection" },
  { label: "من نحن", href: "/about" },
  { label: "تواصل", href: "/contact" },
];

export default function Header() {
  const { itemCount, openDrawer } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-border">
      <div className="max-w-container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-gray-700"
            aria-label="القائمة"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <button
            onClick={openDrawer}
            className="relative p-2 text-gray-700 hover:text-sage transition-colors"
            aria-label="السلة"
          >
            <ShoppingBag size={22} />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -left-0.5 bg-sage text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {itemCount}
              </span>
            )}
          </button>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-sage transition-colors">
              {item.label}
            </Link>
          ))}
        </nav>

        <Link href="/" className="flex items-center gap-3 group">
          <div className="text-right">
            <div className="font-semibold text-lg text-gray-900 leading-tight">{BRAND_NAME_AR}</div>
            <div className="text-[10px] text-gray-500 leading-tight max-w-[140px]">
              {BRAND_TAGLINE}
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-sage flex items-center justify-center text-white font-bold text-lg group-hover:bg-sage-dark transition-colors">
            S
          </div>
        </Link>
      </div>

      {menuOpen && (
        <nav className="md:hidden border-t border-border bg-white px-4 py-3 space-y-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="block py-2.5 text-gray-700 hover:text-sage font-medium"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
