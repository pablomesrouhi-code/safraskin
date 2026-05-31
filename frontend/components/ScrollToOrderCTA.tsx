"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import clsx from "clsx";

export default function ScrollToOrderCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const imageEl = document.getElementById("hero-image");
    const orderEl = document.getElementById("order");
    if (!imageEl || !orderEl) return;

    let imageVisible = true;
    let orderVisible = true;

    const update = () => {
      setVisible(!imageVisible && !orderVisible);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target === imageEl) imageVisible = entry.isIntersecting;
          if (entry.target === orderEl) orderVisible = entry.isIntersecting;
        }
        update();
      },
      { threshold: 0, rootMargin: "-72px 0px 0px 0px" }
    );

    observer.observe(imageEl);
    observer.observe(orderEl);
    return () => observer.disconnect();
  }, []);

  const scrollToOrder = () => {
    const el = document.getElementById("order");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className={clsx(
        "fixed bottom-4 inset-x-0 z-40 flex justify-center px-4 transition-all duration-300 pointer-events-none",
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      )}
    >
      <button
        type="button"
        onClick={scrollToOrder}
        className="pointer-events-auto inline-flex flex-col items-center gap-0.5 bg-sage hover:bg-sage-dark text-white font-semibold px-5 py-2.5 rounded-full transition-all shadow-lg shadow-sage/30 text-sm max-w-[min(100%,20rem)]"
      >
        <span className="flex items-center gap-1.5 leading-tight">
          <ChevronUp size={16} className="animate-bounce shrink-0" />
          <span>ابدأي روتين نظافة الآن</span>
        </span>
        <span className="text-[11px] font-normal text-white/80">من 199 ر.س</span>
      </button>
    </div>
  );
}
