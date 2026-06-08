const SESSION_KEY = "safra_sid";

export function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let sid = localStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

export function getUtmParams(): Record<string, string | undefined> {
  if (typeof window === "undefined") return {};
  const p = new URLSearchParams(window.location.search);
  return {
    utm_source: p.get("utm_source") || undefined,
    utm_medium: p.get("utm_medium") || undefined,
    utm_campaign: p.get("utm_campaign") || undefined,
  };
}

export async function trackEvent(
  event_type: "page_view" | "product_view" | "add_to_cart" | "checkout_start" | "offer_click",
  extra?: { path?: string; product_slug?: string }
) {
  try {
    await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_type,
        session_id: getSessionId(),
        path: extra?.path ?? window.location.pathname,
        product_slug: extra?.product_slug,
        referrer: document.referrer || undefined,
        ...getUtmParams(),
      }),
      keepalive: true,
    });
  } catch {
    /* non-blocking */
  }
}
