"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, ShoppingBag, X } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import { TrustBar } from "@/components/TrustSections";
import { useCart } from "@/context/CartContext";

const LINKS = [
  { href: "/", label: "الرئيسية" },
  { href: "/collection", label: "المجموعة" },
  { href: "/about", label: "المختبر" },
  { href: "/contact", label: "تواصل" },
] as const;

export default function Header() {
  const { itemCount, openDrawer } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-cream/95 backdrop-blur">
      <TrustBar />
      <div className="relative mx-auto flex max-w-container items-center justify-between px-4 py-3">
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-white md:hidden"
          aria-label="الصفحات"
        >
          <Menu size={22} />
        </button>

        <div className="hidden md:block">
          <BrandLogo />
        </div>

        <div className="pointer-events-none absolute inset-x-0 flex justify-center md:hidden">
          <div className="pointer-events-auto">
            <BrandLogo />
          </div>
        </div>

        <nav className="hidden items-center gap-6 text-sm font-medium text-muted md:flex">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-ink">
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={openDrawer}
          className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-white"
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

      {menuOpen ? (
        <>
          <div className="fixed inset-0 z-50 bg-black/40 md:hidden" onClick={() => setMenuOpen(false)} />
          <aside
            className="fixed inset-y-0 right-0 z-50 flex w-64 flex-col bg-cream p-5 shadow-2xl md:hidden"
            role="dialog"
            aria-label="الصفحات"
          >
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm font-bold text-ink">الصفحات</p>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="rounded-full p-1 text-muted hover:bg-white"
                aria-label="إغلاق"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="flex flex-col gap-1 text-base font-medium">
              {LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl px-3 py-3 text-ink hover:bg-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </aside>
        </>
      ) : null}
    </header>
  );
}
