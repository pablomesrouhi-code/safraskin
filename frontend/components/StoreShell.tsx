"use client";

import { usePathname } from "next/navigation";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DeferredPixels from "@/components/DeferredPixels";
import AnalyticsTracker from "@/components/AnalyticsTracker";

export default function StoreShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  if (pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <CartProvider>
      <Header />
      <main>{children}</main>
      <Footer />
      <AnalyticsTracker />
      <DeferredPixels />
    </CartProvider>
  );
}
