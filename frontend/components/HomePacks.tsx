"use client";

import { PACK_LIST } from "@/data/packs";
import { PRODUCTS } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/money";
import { EmptyFrame } from "@/components/ProductImage";
import { ShoppingBag } from "lucide-react";

export default function HomePacks() {
  const { addPack } = useCart();

  return (
    <section id="packs" className="scroll-mt-header border-t border-border bg-white">
      <div className="mx-auto max-w-container px-4 py-16 md:py-20">
        <p className="font-english text-[11px] font-semibold uppercase tracking-[0.22em] text-saffron-dark">
          Safraskin
        </p>
        <h2 className="mt-2 text-2xl font-bold md:text-3xl">جوج روتينات جاهزين</h2>
        <p className="mt-2 max-w-xl text-sm leading-7 text-muted">
          علبة من كل صيغة، ثمن واحد، والدفع عند الباب.
        </p>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {PACK_LIST.map((pack) => (
            <article
              key={pack.id}
              className="flex flex-col overflow-hidden rounded-3xl border border-border bg-cream"
            >
              <div className="relative aspect-[16/9]">
                <EmptyFrame label={pack.title} className="absolute inset-0 h-full w-full" />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-xl font-bold">{pack.title}</h3>
                <p className="mt-1 text-sm text-muted">{pack.subtitle}</p>
                <ul className="mt-4 space-y-1.5 text-sm text-ink">
                  {pack.slugs.map((slug) => {
                    const product = PRODUCTS.find((p) => p.slug === slug);
                    return <li key={slug}>· {product?.headlineAr}</li>;
                  })}
                </ul>
                <p className="mt-5 text-lg font-bold text-rose">{formatPrice(pack.price)}</p>
                <button
                  type="button"
                  onClick={() => addPack(pack.id)}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-rose py-3.5 text-sm font-bold text-white hover:bg-rose-dark"
                >
                  <ShoppingBag size={16} />
                  زيدِ الروتين للسلة
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
