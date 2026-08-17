"use client";

import { useEffect } from "react";

export default function DeferredPixels() {
  useEffect(() => {
    const metaId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
    const tiktokId = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;
    const snapId = process.env.NEXT_PUBLIC_SNAP_PIXEL_ID;

    if (!metaId && !tiktokId && !snapId) return;

    // Pixel scripts load after page interactive — placeholder for production
    console.debug("[pixels] deferred load", { metaId, tiktokId, snapId });
  }, []);

  return null;
}
