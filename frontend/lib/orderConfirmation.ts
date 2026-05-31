/** COD confirmation call window — KSA 9:00–21:00 */
const CALL_START = 9;
const CALL_END = 21;

export type CallWindow = {
  isOpen: boolean;
  headline: string;
  subline: string;
  badge: string;
};

export function getRiyadhHour(date = new Date()): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Riyadh",
    hour: "numeric",
    hour12: false,
  }).formatToParts(date);
  return Number(parts.find((p) => p.type === "hour")?.value ?? 12);
}

export function getCallWindow(date = new Date()): CallWindow {
  const hour = getRiyadhHour(date);

  if (hour >= CALL_START && hour < CALL_END) {
    return {
      isOpen: true,
      headline: "نتصل بكِ خلال 10 دقائق",
      subline: "فريق سفرا جلد يتصل لتأكيد العنوان — أبقي الهاتف قريباً",
      badge: "مكالمة الآن",
    };
  }

  if (hour >= CALL_END) {
    return {
      isOpen: false,
      headline: "مكالمة تأكيد الصباح الباكر",
      subline: "طلبكِ مسجّل — نتصل غداً من 9 صباحاً لتأكيد العنوان قبل الشحن",
      badge: "طلب مسجّل ✓",
    };
  }

  return {
    isOpen: false,
    headline: "مكالمة تأكيد هذا الصباح",
    subline: "طلبكِ مسجّل — نتصل من 9 صباحاً (خلال ساعات) لتأكيد العنوان",
    badge: "طلب مسجّل ✓",
  };
}

export type OrderLine = { slug: string; qty: number };

export function parseOrderItems(raw?: string): OrderLine[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((part) => {
      const [slug, qtyStr] = part.split(":");
      const qty = Number(qtyStr);
      if (!slug || !Number.isFinite(qty) || qty < 1) return null;
      return { slug, qty };
    })
    .filter((x): x is OrderLine => x !== null);
}

export function encodeOrderItems(items: { slug: string; qty: number }[]): string {
  return items.map((i) => `${i.slug}:${i.qty}`).join(",");
}
