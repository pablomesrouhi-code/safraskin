"use client";

import { useEffect, useState } from "react";
import { Star, RotateCcw, Truck, Package } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const GUARANTEE_LINES: { text: string; hintIcon?: LucideIcon }[] = [
  { text: "ضمان 14 يوم — استرداد كامل إذا ما ناسبكِ", hintIcon: RotateCcw },
  { text: "دفع عند الاستلام — ما تدفعي حتى تستلمي الطلب", hintIcon: Truck },
  { text: "تغليف سري · توصيل 2–4 أيام داخل المملكة", hintIcon: Package },
];

const INTERVAL_MS = 3800;

export default function AnimatedGuaranteeBanner() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % GUARANTEE_LINES.length);
        setVisible(true);
      }, 300);
    }, INTERVAL_MS);

    return () => clearInterval(timer);
  }, []);

  const line = GUARANTEE_LINES[index];
  const HintIcon = line.hintIcon;

  return (
    <div className="w-full bg-gradient-to-r from-sage-dark via-sage to-sage-dark border-b border-sage-dark/30">
      <div className="max-w-container mx-auto px-4 py-2 flex items-center justify-center min-h-[2.5rem]">
        <div
          key={index}
          className={`flex items-center gap-2 transition-all duration-300 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
          }`}
        >
          <Star size={11} className="text-gold fill-gold shrink-0" strokeWidth={1.5} />
          {HintIcon && <HintIcon size={14} className="text-gold shrink-0" strokeWidth={2} />}
          <p className="text-xs sm:text-sm font-bold text-white leading-snug text-center">
            {line.text}
          </p>
        </div>
      </div>
    </div>
  );
}
