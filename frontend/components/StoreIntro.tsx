"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { BRAND_NAME_AR, BRAND_SLOGAN } from "@/data/brand";

const STORAGE_KEY = "safra-intro-seen";

type Phase = "idle" | "enter" | "exit" | "done";

export default function StoreIntro() {
  const [phase, setPhase] = useState<Phase>("idle");

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY) === "1") {
      setPhase("done");
      return;
    }

    setPhase("enter");
    document.body.style.overflow = "hidden";

    const exitTimer = setTimeout(() => setPhase("exit"), 1600);
    const doneTimer = setTimeout(() => {
      sessionStorage.setItem(STORAGE_KEY, "1");
      document.body.style.overflow = "";
      setPhase("done");
    }, 2200);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
      document.body.style.overflow = "";
    };
  }, []);

  if (phase === "idle" || phase === "done") return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-cream transition-opacity duration-500 ease-out ${
        phase === "exit" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      aria-hidden={phase === "exit"}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(45,106,90,0.08),transparent_55%)]" />

      <div className="relative flex flex-col items-center text-center px-6">
        <div className="animate-intro-logo mb-5">
          <Image
            src="/brand/icon.png"
            alt=""
            width={72}
            height={72}
            priority
            className="h-[4.5rem] w-[4.5rem] object-contain drop-shadow-sm"
          />
        </div>

        <p className="font-bold text-2xl text-sage-dark tracking-tight animate-intro-title">
          {BRAND_NAME_AR}
        </p>
        <p className="text-sm text-gold font-medium mt-2 animate-intro-tagline">{BRAND_SLOGAN}</p>

        <div className="mt-8 h-0.5 w-24 rounded-full bg-sage/15 overflow-hidden">
          <div className="h-full bg-sage animate-intro-bar origin-right" />
        </div>
      </div>
    </div>
  );
}
