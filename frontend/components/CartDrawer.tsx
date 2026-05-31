"use client";

import ProductImage from "@/components/ProductImage";
import { X, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { getProductOrThrow, TIER_PRICES } from "@/data/products";
import { getCrossSells } from "@/lib/upsell";

export default function CartDrawer() {
  const {
    state,
    closeDrawer,
    openCheckout,
    removeFromCart,
    addSlug,
    total,
    savings,
    uniqueCount,
    cartSlugs,
  } = useCart();

  if (!state.isDrawerOpen) return null;

  const crossSells = getCrossSells(cartSlugs);

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50" onClick={closeDrawer} />
      <div className="fixed top-0 left-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <button onClick={closeDrawer} className="p-1 text-gray-500 hover:text-gray-900" aria-label="إغلاق">
            <X size={22} />
          </button>
          <h2 className="font-bold text-lg">طلبك ({uniqueCount})</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {state.items.length === 0 ? (
            <p className="text-center text-gray-500 py-12">السلة فارغة</p>
          ) : (
            state.items.map((item) => {
              const product = getProductOrThrow(item.slug);
              return (
                <div key={item.slug} className="flex gap-3 items-center">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-cream shrink-0">
                    <ProductImage src={product.image} alt={product.nameAr} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{product.nameAr}</p>
                    <p className="text-xs text-gray-500">× {item.qty}</p>
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
            <div className="pt-4 border-t border-border">
              <p className="font-semibold text-sm mb-3">أكملي بروتوكولك:</p>
              <div className="space-y-3">
                {crossSells.map((p) => (
                  <button
                    key={p.slug}
                    onClick={() => addSlug(p.slug)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-border hover:border-sage transition-colors text-right"
                  >
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-cream shrink-0">
                      <ProductImage src={p.image} alt={p.nameAr} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{p.nameAr}</p>
                      <p className="text-xs text-gray-500">{p.taglineAr}</p>
                    </div>
                    <span className="text-sage font-bold text-sm shrink-0">{TIER_PRICES[1]} ر.س</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {state.items.length > 0 && (
          <div className="p-5 border-t border-border space-y-3">
            {savings > 0 && (
              <p className="text-sm text-scarcity font-medium text-center">
                🎉 وفّرتِ {savings} ر.س!
              </p>
            )}
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-sage">{total} ر.س</span>
              <span className="text-sm text-gray-500">المجموع</span>
            </div>
            <p className="text-xs text-gray-500 text-center">✓ COD · ✓ اتصال تأكيد · ✓ تغليف سري</p>
            <button
              onClick={openCheckout}
              className="w-full bg-sage hover:bg-sage-dark text-white font-semibold py-4 rounded-xl transition-colors"
            >
              إتمام الطلب — الدفع عند الاستلام
            </button>
          </div>
        )}
      </div>
    </>
  );
}
