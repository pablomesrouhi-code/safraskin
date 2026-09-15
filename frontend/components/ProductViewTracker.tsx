"use client";

import { useEffect } from "react";
import { trackEvent, trackTikTokEvent } from "@/lib/track";

export default function ProductViewTracker({ slug, price }: { slug: string; price?: number }) {
  useEffect(() => {
    try {
      trackEvent("product_view", { product_slug: slug });
    } catch {}

    try {
      trackTikTokEvent("ViewContent", {
        contents: [{ content_id: slug, content_type: "product", content_name: slug }],
        value: price || 0,
        currency: "MAD",
        content_type: "product",
      });
    } catch {}
  }, [slug, price]);

  return null;
}
