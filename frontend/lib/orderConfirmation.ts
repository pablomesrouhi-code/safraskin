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
      headline: "غنعيّطو ليكِ فـ أقل من 10 دقايق",
      subline: "الرقم غادي يبان جديد، وماشي محفوظ عندكِ. جاوبي باش نأكدو العنوان ونرسلو الطلب.",
      badge: "مكالمة التأكيد دابا",
    };
  }

  if (hour >= CALL_END) {
    return {
      isOpen: false,
      headline: "راح يوصلك اتصال منا في الصباح الباكر لتأكيد طلبك",
      subline: "من 9 الصباح كنعيّطو. خلّي التيليفون قريب، والرقم غادي يبان جديد.",
      badge: "طلب مسجّل ✓",
    };
  }

  return {
    isOpen: false,
    headline: "راح يوصلك اتصال منا في الصباح الباكر لتأكيد طلبك",
    subline: "من 9 الصباح كنعيّطو لتأكيد العنوان قبل الإرسال. الرقم غادي يبان جديد.",
    badge: "طلب مسجّل ✓",
  };
}

export function firstNameFrom(fullName: string): string {
  const part = fullName.trim().split(/\s+/)[0];
  return part || "";
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
