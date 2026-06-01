"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { BRAND_NAME_AR, BRAND_NAME_EN, BRAND_SLOGAN } from "@/data/brand";

const STORAGE_KEY = "safra-intro-seen";

type Phase = "enter" | "hold" | "exit" | "done";

function markIntroDone() {
  document.documentElement.classList.remove("store-intro-pending");
  document.documentElement.classList.add("store-intro-revealed");
  document.body.style.overflow = "";
}

export default function StoreIntro() {
  const [phase, setPhase] = useState<Phase>("enter");

  useEffect(() => {
    const alreadySeen = sessionStorage.getItem(STORAGE_KEY) === "1";

    if (alreadySeen) {
      setPhase("done");
      markIntroDone();
      return;
    }

    document.body.style.overflow = "hidden";

    const holdTimer = setTimeout(() => setPhase("hold"), 900);
    const exitTimer = setTimeout(() => setPhase("exit"), 2100);
    const doneTimer = setTimeout(() => {
      sessionStorage.setItem(STORAGE_KEY, "1");
      markIntroDone();
      setPhase("done");
    }, 2800);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
      document.body.style.overflow = "";
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className={`store-intro-overlay fixed inset-0 z-[200] flex items-center justify-center bg-cream transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
        phase === "exit" ? "opacity-0 scale-[1.02] pointer-events-none" : "opacity-100 scale-100"
      }`}
      aria-hidden={phase === "exit"}
      role="presentation"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(45,106,90,0.1),transparent_58%)]" />
      <div className="absolute inset-0 animate-intro-shimmer opacity-40" />

      <div
        className={`relative flex flex-col items-center text-center px-6 transition-transform duration-700 ease-out ${
          phase === "exit" ? "scale-95" : "scale-100"
        }`}
      >
        <div className="relative mb-6 animate-intro-logo">
          <div className="absolute -inset-4 rounded-full bg-sage/8 blur-xl animate-intro-glow" />
          <Image
            src="/brand/icon.png"
            alt=""
            width={80}
            height={80}
            priority
            className="relative h-20 w-20 object-contain drop-shadow-md"
          />
        </div>

        <p className="font-bold text-[1.75rem] leading-tight text-sage-dark tracking-tight animate-intro-title">
          {BRAND_NAME_AR}
        </p>
        <p className="mt-1 font-english text-xs font-medium uppercase tracking-[0.22em] text-sage/55 animate-intro-subtitle">
          {BRAND_NAME_EN}
        </p>
        <p className="mt-3 text-sm font-medium text-gold animate-intro-tagline">{BRAND_SLOGAN}</p>

        <div className="mt-9 h-px w-28 overflow-hidden rounded-full bg-sage/12">
          <div className="h-full bg-gradient-to-l from-sage/30 via-sage to-sage/30 animate-intro-bar origin-right" />
        </div>
      </div>
    </div>
  );
}
