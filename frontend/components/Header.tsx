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
    <header className="sticky top-0 z-40 border-b border-border/80 bg-cream">
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
          <div className="fixed inset-0 z-[70] bg-black/45 md:hidden" onClick={() => setMenuOpen(false)} />
          <aside
            className="fixed inset-y-0 right-0 z-[80] flex h-dvh w-[82vw] max-w-xs flex-col overflow-y-auto bg-cream p-5 shadow-2xl md:hidden"
            role="dialog"
            aria-label="الصفحات"
          >
            <div className="mb-6 flex shrink-0 items-center justify-between border-b border-border pb-4">
              <p className="text-lg font-bold text-ink">الصفحات</p>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="rounded-full p-1 text-muted hover:bg-white"
                aria-label="إغلاق"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="flex flex-col gap-2 text-base font-semibold">
              {LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block w-full rounded-xl border border-border bg-white px-4 py-3.5 text-ink hover:border-rose/30"
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
