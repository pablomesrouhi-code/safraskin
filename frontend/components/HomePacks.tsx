"use client";

import { PACK_LIST } from "@/data/packs";
import { PRODUCTS } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/money";
import { ShoppingBag } from "lucide-react";

export default function HomePacks() {
  const { addPack } = useCart();

  return (
    <section id="packs" className="scroll-mt-header border-t border-border bg-white">
      <div className="mx-auto max-w-container px-4 py-16 md:py-20">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-saffron-dark">
          إلا كانت المشكلة أكثر من واحدة
        </p>
        <h2 className="mt-2 text-2xl font-bold md:text-3xl">جوج روتينات جاهزين</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
          ماشي خصك تختار علبة علبة إلا كنتي كتحسي بأكثر من حاجة. ثمن واحد، علبة من كل صيغة، والدفع عند الباب.
        </p>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {PACK_LIST.map((pack) => (
            <article
              key={pack.id}
              className="flex flex-col rounded-3xl border border-border bg-cream p-6 md:p-8"
            >
              <h3 className="text-xl font-bold md:text-2xl">{pack.title}</h3>
              <p className="mt-2 text-sm leading-7 text-muted">{pack.subtitle}</p>
              <ul className="mt-5 space-y-2 text-sm leading-7 text-ink">
                {pack.slugs.map((slug) => {
                  const product = PRODUCTS.find((p) => p.slug === slug);
                  return (
                    <li key={slug}>
                      <span className="font-semibold">{product?.feelingTitle}</span>
                      <span className="mt-0.5 block text-xs text-muted">{product?.headlineAr}</span>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-6 text-lg font-bold text-rose">{formatPrice(pack.price)}</p>
              <button
                type="button"
                onClick={() => addPack(pack.id)}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-rose py-3.5 text-sm font-bold text-white hover:bg-rose-dark"
              >
                <ShoppingBag size={16} />
                زيدِ الروتين للسلة
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
