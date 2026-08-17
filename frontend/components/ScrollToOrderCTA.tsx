"use client";

import { ShoppingBag } from "lucide-react";

export default function ScrollToOrderCTA() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-white/95 p-3 backdrop-blur md:hidden">
      <a
        href="#offer-selector"
        className="flex items-center justify-center gap-2 rounded-xl bg-rose py-3.5 font-bold text-white"
      >
        <ShoppingBag size={18} />
        أضيفي للسلة
      </a>
    </div>
  );
}
