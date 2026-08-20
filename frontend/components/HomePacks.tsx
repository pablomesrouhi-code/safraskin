"use client";

import { PACK_LIST } from "@/data/packs";
import { PRODUCTS } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/money";
import ProductImage from "@/components/ProductImage";
import { ShoppingBag } from "lucide-react";

export default function HomePacks() {
  const { addPack, buyPack } = useCart();

  return (
    <section id="packs" className="scroll-mt-header border-t border-border bg-white">
      <div className="mx-auto max-w-container px-4 py-16 md:py-20">
        <p className="text-[11px] font-semibold tracking-[0.18em] text-saffron-dark">
          إلا كانت المشكلة أكثر من واحدة
        </p>
        <h2 className="mt-2 text-2xl font-bold leading-[1.45] md:text-3xl">جوج روتينات جاهزين</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
          ماشي خصك تختار علبة علبة إلا كنتي كتحسي بأكثر من حاجة. ثمن واحد، علبة من كل صيغة، والدفع عند الباب.
        </p>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {PACK_LIST.map((pack) => (
            <article
              key={pack.id}
              className="flex flex-col overflow-hidden rounded-3xl border border-border bg-cream"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-[#8f7364]">
                <ProductImage src={pack.image} alt={pack.title} fill emptyLabel="صورة الروتين" />
              </div>
              <div className="flex flex-1 flex-col p-5 md:p-7">
                <h3 className="text-xl font-bold leading-[1.45] md:text-2xl">{pack.title}</h3>
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
                <div className="mt-4 space-y-2">
                  <button
                    type="button"
                    onClick={() => addPack(pack.id)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose py-2.5 text-sm font-bold text-rose hover:bg-rose/5"
                  >
                    <ShoppingBag size={16} />
                    أضيفي للسلة
                  </button>
                  <button
                    type="button"
                    onClick={() => buyPack(pack.id)}
                    className="flex w-full items-center justify-center rounded-xl bg-rose py-3 text-sm font-bold text-white hover:bg-rose-dark"
                  >
                    اطلبي · الدفع عند الاستلام
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
