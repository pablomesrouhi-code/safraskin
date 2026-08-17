"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToOrderCTA() {
  const [pastForm, setPastForm] = useState(false);

  useEffect(() => {
    const form = document.getElementById("offer-selector");
    if (!form) return;

    const update = () => {
      const rect = form.getBoundingClientRect();
      setPastForm(rect.bottom < 72);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  if (!pastForm) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-white/95 p-3 backdrop-blur">
      <a
        href="#offer-selector"
        className="flex items-center justify-center gap-2 rounded-xl bg-rose py-3.5 font-bold text-white"
      >
        <ArrowUp size={18} aria-hidden />
        رجعي للطلب
      </a>
    </div>
  );
}
