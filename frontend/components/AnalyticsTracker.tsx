"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/track";

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname?.startsWith("/thank-you") || pathname?.startsWith("/admin")) return;
    trackEvent("page_view", { path: pathname });

    const slugMatch = pathname?.match(/^\/products\/([^/]+)/);
    if (slugMatch) {
      trackEvent("product_view", { path: pathname, product_slug: slugMatch[1] });
    }
  }, [pathname]);

  return null;
}
