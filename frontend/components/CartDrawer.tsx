"use client";

import { X, Trash2 } from "lucide-react";
import ProductImage from "@/components/ProductImage";
import QtyStepper from "@/components/QtyStepper";
import { useCart } from "@/context/CartContext";
import { getProduct, type ProductSlug } from "@/data/products";
import { getPack, isPackId } from "@/data/packs";
import { getCrossSells } from "@/lib/upsell";
import { formatPrice } from "@/lib/money";

export default function CartDrawer() {
  const { state, closeDrawer, openCheckout, removeFromCart, setQty, addSlug, total, itemCount, cartSlugs, hasPack } =
    useCart();

  if (!state.isDrawerOpen) return null;

  const productSlugs = cartSlugs.filter((slug): slug is ProductSlug => !isPackId(slug));
  const crossSells = hasPack ? [] : getCrossSells(productSlugs);

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40" onClick={closeDrawer} />
      <div className="fixed top-0 left-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-border p-5">
          <button onClick={closeDrawer} className="p-1 text-muted hover:text-ink" aria-label="إغلاق">
            <X size={22} />
          </button>
          <h2 className="text-lg font-bold">سلتك ({itemCount})</h2>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {state.items.length === 0 ? (
            <p className="py-12 text-center text-muted">السلة فارغة</p>
          ) : (
            state.items.map((item) => {
              const pack = getPack(item.slug);
              const product = !pack ? getProduct(item.slug) : undefined;
              const title = pack?.title || product?.headlineAr || item.slug;
              return (
                <div key={item.slug} className="space-y-3 rounded-xl border border-border p-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-cream">
                      <ProductImage src={product?.image} alt={title} fill emptyLabel={title} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{title}</p>
                      {pack ? <p className="text-xs text-muted">{pack.subtitle}</p> : null}
                    </div>
                    <button
                      onClick={() => removeFromCart(item.slug)}
                      className="p-2 text-gray-400 hover:text-scarcity"
                      aria-label="حذف"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  {!pack ? (
                    <QtyStepper
                      qty={item.qty}
                      onDecrease={() => setQty(item.slug, item.qty - 1)}
                      onIncrease={() => setQty(item.slug, item.qty + 1)}
                    />
                  ) : null}
                </div>
              );
            })
          )}

          {crossSells.length > 0 && state.items.length > 0 && (
            <div className="border-t border-border pt-4">
              <p className="mb-1 text-sm font-semibold">زيدِ منتج لنفس الطلب</p>
              <p className="mb-3 text-xs text-muted">كيتزاد لنفس التوصيل · الدفع عند الباب</p>
              <div className="space-y-3">
                {crossSells.map((p) => (
                  <div key={p.slug} className="flex items-center gap-3 rounded-xl border border-border p-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-cream">
                      <ProductImage src={p.image} alt={p.headlineAr} fill emptyLabel={p.headlineAr} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{p.headlineAr}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => addSlug(p.slug)}
                      className="shrink-0 rounded-xl bg-rose px-3 py-2 text-xs font-bold text-white hover:bg-rose-dark"
                    >
                      أضيفي
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {state.items.length > 0 && (
          <div className="space-y-3 border-t border-border p-5">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-rose tabular-nums">{formatPrice(total)}</span>
              <span className="text-sm text-muted">المجموع · الدفع عند الاستلام</span>
            </div>
            <button
              onClick={openCheckout}
              className="w-full rounded-xl bg-rose py-4 font-semibold text-white hover:bg-rose-dark"
            >
              إتمام الطلب
            </button>
          </div>
        )}
      </div>
    </>
  );
}
