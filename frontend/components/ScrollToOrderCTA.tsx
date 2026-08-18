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
      setPastForm(rect.bottom < 88);
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
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-white/95 p-2.5 backdrop-blur">
      <button
        type="button"
        onClick={() =>
          document.getElementById("offer-selector")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose py-3 text-sm font-extrabold text-white"
      >
        <ArrowUp size={18} strokeWidth={2.5} aria-hidden />
        رجعي للعروض
      </button>
    </div>
  );
}
