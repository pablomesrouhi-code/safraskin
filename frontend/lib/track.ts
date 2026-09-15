const SESSION_KEY = "safra_sid";

declare global {
  interface Window {
    ttq?: {
      track: (eventName: string, payload?: Record<string, unknown>) => void;
      identify: (payload: Record<string, string>) => void;
    };
  }
}

function hashSha256(value: string): Promise<string> {
  if (!value) return Promise.resolve("");
  if (typeof window === "undefined" || !window.crypto || !window.crypto.subtle) {
    return Promise.resolve(value);
  }

  const data = new TextEncoder().encode(value.trim().toLowerCase());
  return window.crypto.subtle.digest("SHA-256", data).then((buffer) =>
    Array.from(new Uint8Array(buffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
  );
}

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

export function trackTikTokEvent(eventName: string, payload: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const ttq = window.ttq;
  if (!ttq || typeof ttq.track !== "function") return;
  ttq.track(eventName, payload);
}

export async function trackTikTokIdentify(values: {
  email?: string;
  phone_number?: string;
  external_id?: string;
}) {
  if (typeof window === "undefined") return;
  const ttq = window.ttq;
  if (!ttq || typeof ttq.identify !== "function") return;

  const payload: Record<string, string> = {};

  if (values.email) {
    payload.email = await hashSha256(values.email);
  }
  if (values.phone_number) {
    payload.phone_number = await hashSha256(values.phone_number);
  }
  if (values.external_id) {
    payload.external_id = await hashSha256(values.external_id);
  }

  if (Object.keys(payload).length > 0) {
    ttq.identify(payload);
  }
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

  if (typeof window === "undefined" || !window.ttq) return;

  const productSlug = extra?.product_slug || "";
  const content = productSlug
    ? {
        contents: [
          {
            content_id: productSlug,
            content_type: "product",
            content_name: productSlug,
          },
        ],
      }
    : {};

  switch (event_type) {
    case "page_view":
      trackTikTokEvent("ViewContent", {
        ...content,
        content_type: "product",
      });
      break;
    case "product_view":
      trackTikTokEvent("ViewContent", {
        ...content,
        content_type: "product",
      });
      break;
    case "add_to_cart":
      trackTikTokEvent("AddToCart", {
        ...content,
        content_type: "product",
      });
      break;
    case "checkout_start":
      trackTikTokEvent("InitiateCheckout", {
        ...content,
        content_type: "product",
      });
      break;
    case "offer_click":
      trackTikTokEvent("ViewContent", {
        ...content,
        content_type: "product",
      });
      break;
    default:
      break;
  }
}
