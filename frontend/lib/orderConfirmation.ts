const CALL_START = 9;
const CALL_END = 21;

export type CallWindow = {
  isOpen: boolean;
  headline: string;
  subline: string;
  badge: string;
};

export function getCasablancaHour(date = new Date()): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Casablanca",
    hour: "numeric",
    hour12: false,
  }).formatToParts(date);
  return Number(parts.find((p) => p.type === "hour")?.value ?? 12);
}

export function getCallWindow(date = new Date()): CallWindow {
  const hour = getCasablancaHour(date);

  if (hour >= CALL_START && hour < CALL_END) {
    return {
      isOpen: true,
      headline: "غنعيّطو ليكِ دابا تقريباً",
      subline: "جاوبي على التيليفون باش نأكدو العنوان — بلا ما نرسلو فالغلط",
      badge: "مكالمة التأكيد",
    };
  }

  if (hour >= CALL_END) {
    return {
      isOpen: false,
      headline: "طلبكِ مسجّل — المكالمة غداً مع الصباح",
      subline: "من 9 الصباح كنعيّطو لتأكيد العنوان قبل الإرسال",
      badge: "طلب مسجّل ✓",
    };
  }

  return {
    isOpen: false,
    headline: "طلبكِ مسجّل — المكالمة هاد الصباح",
    subline: "من 9 الصباح كنعيّطو لتأكيد العنوان",
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
