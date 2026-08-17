"use client";

import { X, Trash2 } from "lucide-react";
import ProductImage from "@/components/ProductImage";
import { useCart } from "@/context/CartContext";
import { getProductOrThrow, CROSSSELL_PRICE_MAD } from "@/data/products";
import { getOfferPrice } from "@/lib/pricing";
import { getCrossSells } from "@/lib/upsell";

export default function CartDrawer() {
  const { state, closeDrawer, openCheckout, removeFromCart, addSlug, total, itemCount, cartSlugs } =
    useCart();

  if (!state.isDrawerOpen) return null;

  const crossSells = getCrossSells(cartSlugs);

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
            <p className="py-12 text-center text-muted">السلة فارغة — اختاري مشكلتك من المجموعة</p>
          ) : (
            state.items.map((item) => {
              const product = getProductOrThrow(item.slug);
              return (
                <div key={item.slug} className="flex items-center gap-3">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-cream">
                    <ProductImage src={product.image} alt={product.headlineAr} fill emptyLabel={product.headlineAr} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{product.headlineAr}</p>
                    <p className="text-xs text-muted">
                      {item.qty === 1 ? "علبة واحدة" : item.qty === 2 ? "علبتين" : "3 علب"} ·{" "}
                      {getOfferPrice(item.qty)} د.م
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.slug)}
                    className="p-2 text-gray-400 hover:text-scarcity"
                    aria-label="حذف"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })
          )}

          {crossSells.length > 0 && state.items.length > 0 && (
            <div className="border-t border-border pt-4">
              <p className="mb-1 text-sm font-semibold">زيدِ حل آخر لنفس الطلب</p>
              <p className="mb-3 text-xs text-muted">
                كيتزاد للسلة بـ {CROSSSELL_PRICE_MAD} د.م · نفس التوصيل · نفس الدفع عند الباب
              </p>
              <div className="space-y-3">
                {crossSells.map((p) => (
                  <button
                    key={p.slug}
                    onClick={() => addSlug(p.slug)}
                    className="flex w-full items-center gap-3 rounded-xl border border-border p-3 text-right hover:border-rose/40"
                  >
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-cream">
                      <ProductImage src={p.image} alt={p.headlineAr} fill emptyLabel={p.headlineAr} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{p.headlineAr}</p>
                      <p className="text-xs text-muted">{p.problemTitle}</p>
                    </div>
                    <span className="shrink-0 text-sm font-bold text-rose">{CROSSSELL_PRICE_MAD} د.م</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {state.items.length > 0 && (
          <div className="space-y-3 border-t border-border p-5">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-rose tabular-nums">{total} د.م</span>
              <span className="text-sm text-muted">المجموع · الدفع عند الاستلام</span>
            </div>
            <p className="text-center text-xs text-muted">
              غنعيّطو ليكِ لتأكيد العنوان · خلّصي ملي توصّل
            </p>
            <button
              onClick={openCheckout}
              className="w-full rounded-xl bg-rose py-4 font-semibold text-white transition-colors hover:bg-rose-dark"
            >
              إتمام الطلب — الدفع عند الاستلام
            </button>
          </div>
        )}
      </div>
    </>
  );
}
