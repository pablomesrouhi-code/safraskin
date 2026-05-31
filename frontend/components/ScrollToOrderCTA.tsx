"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import clsx from "clsx";

const OFFER_SELECTOR_ID = "offer-selector";

export default function ScrollToOrderCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const offerEl = document.getElementById(OFFER_SELECTOR_ID);
    if (!offerEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const scrolledPast =
          !entry.isIntersecting && entry.boundingClientRect.top < 0;
        setVisible(scrolledPast);
      },
      { threshold: 0 }
    );

    observer.observe(offerEl);
    return () => observer.disconnect();
  }, []);

  const scrollToOffers = () => {
    const el = document.getElementById(OFFER_SELECTOR_ID);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div
      className={clsx(
        "fixed bottom-0 inset-x-0 z-40 transition-transform duration-300 pointer-events-none",
        visible ? "translate-y-0" : "translate-y-full"
      )}
    >
      <button
        type="button"
        onClick={scrollToOffers}
        aria-label="العودة لاختيار العرض والطلب"
        className="pointer-events-auto w-full flex items-center justify-center gap-2 bg-sage hover:bg-sage-dark text-white py-2.5 px-4 border-t border-sage-dark/30 shadow-[0_-4px_16px_rgba(45,106,90,0.35)] transition-colors"
      >
        <ChevronUp size={16} className="shrink-0 animate-bounce" aria-hidden />
        <span className="text-sm font-semibold leading-none">ابدأي رحلتك الآن</span>
        <span className="text-[11px] font-normal text-white/75 leading-none hidden sm:inline">
          · ابتداءً من 199 ريال سعودي
        </span>
        <span className="text-[11px] font-normal text-white/75 leading-none sm:hidden">
          · من 199 ر.س
        </span>
      </button>
    </div>
  );
}
