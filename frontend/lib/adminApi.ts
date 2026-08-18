const TOKEN_KEY = "safra_admin_token";

export type OrderStatus =
  | "pending_confirmation"
  | "no_answer"
  | "callback"
  | "confirmed"
  | "cancelled"
  | "shipped"
  | "delivered"
  | "returned"
  | "duplicate";

export const STATUS_META: Record<OrderStatus, { label: string; tone: string }> = {
  pending_confirmation: { label: "جديد", tone: "bg-amber-100 text-amber-800" },
  no_answer: { label: "ما جاوبش", tone: "bg-orange-100 text-orange-800" },
  callback: { label: "إعادة اتصال", tone: "bg-sky-100 text-sky-800" },
  confirmed: { label: "مؤكد", tone: "bg-blue-100 text-blue-800" },
  cancelled: { label: "ملغي", tone: "bg-zinc-200 text-zinc-700" },
  shipped: { label: "في التوصيل", tone: "bg-indigo-100 text-indigo-800" },
  delivered: { label: "تسلّم", tone: "bg-emerald-100 text-emerald-800" },
  returned: { label: "مرجع", tone: "bg-rose/15 text-rose" },
  duplicate: { label: "مكرر", tone: "bg-zinc-100 text-zinc-600" },
};

export const STATUS_FLOW: OrderStatus[] = [
  "pending_confirmation",
  "no_answer",
  "callback",
  "confirmed",
  "shipped",
  "delivered",
  "returned",
  "cancelled",
  "duplicate",
];

export type AdminOrder = {
  id: number;
  order_id: string;
  customer_name: string;
  customer_phone: string;
  items: { sku?: string; product_slug: string; quantity: number; name_ar: string }[];
  grand_total_mad: number;
  upsell_accepted: boolean;
  upsell_sku: string | null;
  upsell_name: string | null;
  status: OrderStatus;
  notes: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  ip_country: string | null;
  ip_city: string | null;
  is_morocco: boolean;
  sheets_synced: boolean;
  created_at: string | null;
  status_updated_at: string | null;
};

export type DashboardMetrics = {
  range: { from: string | null; to: string | null };
  kpis: {
    clicks: number;
    page_views: number;
    orders: number;
    cvr: number;
    aov: number;
    gross_value: number;
    confirmed: number;
    confirmed_value: number;
    delivered: number;
    delivered_value: number;
    pending: number;
    cancelled: number;
    returned: number;
    confirmation_rate: number;
    confirmation_among_decided: number;
    delivery_rate: number;
    return_rate: number;
    cancel_rate: number;
    upsell_rate: number;
    upsell_count: number;
    crosssell_count: number;
    crosssell_rate: number;
    repeat_customers: number;
    units: number;
  };
  funnel: Record<string, number>;
  status_counts: Record<string, number>;
  daily: { date: string; clicks: number; orders: number; revenue: number }[];
  sources: { source: string; orders: number; revenue: number }[];
  products: { slug: string; qty: number; orders: number; revenue: number; name_ar: string }[];
  economics: {
    product_cost_mad: number;
    packaging_mad: number;
    delivery_cost_mad: number;
    return_cost_mad: number;
    cod_fee_pct: number;
    selling_price_mad: number;
    ad_spend_mad: number;
    lead_cost_mad: number;
    space_seller_fee_mad: number;
    upsell_cost_mad: number;
    cpl_mad: number;
    assumed_confirmation_rate: number;
    assumed_delivery_rate: number;
    selling_used: number;
    confirmation_used: number;
    delivery_used: number;
    net_per_delivered: number;
    expected_per_lead: number;
    break_even_cpa: number;
    break_even_cpc: number;
    current_cpa: number;
    current_cpc: number;
    profit: number;
    margin_per_order: number | null;
    lead_spend: number;
    space_spend: number;
    upsell_spend: number;
    product_spend: number;
    revenue: number;
    cost_per_delivered: number;
    break_even_lead_cost: number;
    delivered_est: number;
    verdict: "ok" | "losing" | "fill_costs" | "fill_ads";
    verdict_ar: string;
  };
};

export type EconomicsInput = {
  product_cost_mad: number;
  packaging_mad: number;
  delivery_cost_mad: number;
  return_cost_mad: number;
  cod_fee_pct: number;
  selling_price_mad: number;
  ad_spend_mad: number;
    lead_cost_mad: number;
    space_seller_fee_mad: number;
    upsell_cost_mad: number;
    cpl_mad: number;
    assumed_confirmation_rate: number;
    assumed_delivery_rate: number;
};

export function emptyEconomicsInput(): EconomicsInput {
  return {
    product_cost_mad: 0,
    packaging_mad: 0,
    delivery_cost_mad: 0,
    return_cost_mad: 0,
    cod_fee_pct: 0,
    selling_price_mad: 0,
    ad_spend_mad: 0,
    lead_cost_mad: 2,
    space_seller_fee_mad: 63,
    upsell_cost_mad: 10,
    cpl_mad: 0,
    assumed_confirmation_rate: 50,
    assumed_delivery_rate: 70,
  };
}

export function computeOkDaba(
  form: EconomicsInput,
  kpis: DashboardMetrics["kpis"] | null,
  scaleLeads?: number
): DashboardMetrics["economics"] {
  const actualLeads = kpis?.orders || 0;
  const scaling = typeof scaleLeads === "number" && scaleLeads >= 0;
  const leads = scaling ? scaleLeads : actualLeads;
  const clicks = kpis?.clicks || 0;
  const avgPieces = actualLeads > 0 && kpis?.units ? kpis.units / actualLeads : 1;
  const upsellRate = actualLeads > 0 ? (kpis?.upsell_count || 0) / actualLeads : 0;
  const aov = form.selling_price_mad || kpis?.aov || 0;
  const conf =
    actualLeads > 0 && (kpis?.confirmation_rate || 0) > 0
      ? kpis!.confirmation_rate / 100
      : form.assumed_confirmation_rate / 100;
  const deliv =
    (kpis?.delivery_rate || 0) > 0 ? kpis!.delivery_rate / 100 : form.assumed_delivery_rate / 100;
  const leadFee = form.lead_cost_mad;
  const spaceFee = form.space_seller_fee_mad;
  const upsellFee = form.upsell_cost_mad;
  const product = form.product_cost_mad;
  const cpl = form.cpl_mad || 0;

  const confirmed = leads * conf;
  const deliveredEst = confirmed * deliv;
  const upsells = leads * upsellRate;
  const revenue = deliveredEst * aov;
  const adSpend = leads * cpl;
  const leadSpend = leads * leadFee;
  const spaceSpend = deliveredEst * spaceFee;
  const upsellSpend = upsells * upsellFee;
  const spaceOps = leadSpend + spaceSpend + upsellSpend;
  const productSpend = confirmed * avgPieces * product;
  const totalCost = adSpend + spaceOps + productSpend;
  const profit = Math.round((revenue - totalCost) * 100) / 100;
  const maxCpl =
    Math.round(
      (conf * deliv * aov - leadFee - conf * deliv * spaceFee - upsellRate * upsellFee - conf * avgPieces * product) *
        100
    ) / 100;
  const costPerDelivered = deliveredEst > 0 ? Math.round((totalCost / deliveredEst) * 100) / 100 : 0;
  const cvr = clicks > 0 ? actualLeads / clicks : 0;

  let verdict: DashboardMetrics["economics"]["verdict"] = "fill_costs";
  let verdict_ar = "حط سعر البيع وتكلفة المنتج والتأكيد والتسليم باش نحسبو شحال OK دابا.";
  if (aov > 0) {
    if (cpl <= maxCpl) {
      verdict = "ok";
      verdict_ar = `راك OK دابا. أقصى CPL مسموح ${maxCpl.toFixed(2)} درهم بعد Space Seller وتكلفة المنتج. دابا CPL ${cpl.toFixed(2)} درهم.`;
    } else {
      verdict = "losing";
      verdict_ar = `ماشي OK دابا. CPL ${cpl.toFixed(2)} فوق الـ break-even ${maxCpl.toFixed(2)} درهم.`;
    }
  }

  return {
    ...form,
    selling_used: aov,
    confirmation_used: Math.round(conf * 10000) / 100,
    delivery_used: Math.round(deliv * 10000) / 100,
    net_per_delivered: Math.round((aov - product * avgPieces - spaceFee) * 100) / 100,
    expected_per_lead: maxCpl,
    break_even_cpa: maxCpl,
    break_even_cpc: Math.round(maxCpl * cvr * 100) / 100,
    current_cpa: Math.round(cpl * 100) / 100,
    current_cpc: 0,
    profit,
    margin_per_order: deliveredEst ? Math.round((profit / deliveredEst) * 100) / 100 : null,
    lead_spend: Math.round(leadSpend * 100) / 100,
    space_spend: Math.round(spaceSpend * 100) / 100,
    upsell_spend: Math.round(upsellSpend * 100) / 100,
    product_spend: Math.round(productSpend * 100) / 100,
    revenue: Math.round(revenue * 100) / 100,
    cost_per_delivered: costPerDelivered,
    break_even_lead_cost: maxCpl,
    delivered_est: Math.round(deliveredEst * 100) / 100,
    verdict,
    verdict_ar,
  };
}

export function getToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(TOKEN_KEY) || "";
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function todayMA(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Casablanca" });
}

export function shiftDate(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + days);
  return dt.toISOString().slice(0, 10);
}

export function formatMad(n: number): string {
  const rounded = Math.round(n);
  return `${rounded.toLocaleString("fr-MA")} د.م.`;
}

export function formatPct(n: number): string {
  return `${n.toLocaleString("fr-MA", { maximumFractionDigits: 1 })}%`;
}

export function formatWhen(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso.endsWith("Z") || iso.includes("+") ? iso : `${iso}Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("ar-MA", {
    timeZone: "Africa/Casablanca",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function waLink(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  const intl = digits.startsWith("212") ? digits : digits.startsWith("0") ? `212${digits.slice(1)}` : digits;
  return `https://wa.me/${intl}`;
}

class AdminAuthError extends Error {}

async function adminFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  const clean = path.replace(/^\//, "");
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 12000);
  let res: Response;
  try {
    res = await fetch(`/api/admin/${clean}`, {
      ...init,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(init?.headers || {}),
      },
    });
  } catch {
    throw new Error("الباكند ما جاوبش. دير rebuild للفرونت والـ API، وزيد ADMIN_USERNAME / ADMIN_PASSWORD.");
  } finally {
    window.clearTimeout(timer);
  }
  let data: unknown = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }
  if (res.status === 401 && !clean.startsWith("login")) {
    clearToken();
    throw new AdminAuthError("unauthorized");
  }
  if (!res.ok) {
    const raw =
      data && typeof data === "object" && "detail" in data ? (data as { detail: unknown }).detail : null;
    const detailText = typeof raw === "string" ? raw : "";
    const detail =
      /not found/i.test(detailText)
        ? "الباسوورد غلط أو السيرفر ما فيهوش الأدمن. جرّب admin + كلمة السر ديال ADMIN_PASSWORD فالفرونت، أو change_me_strong_password."
        : detailText
          ? detailText
          : res.status === 404
            ? "مسار الأدمن ما كاينش. rebuild للفرونت."
            : "وقع خطأ";
    throw new Error(detail);
  }
  return data as T;
}

export function isAuthError(e: unknown): boolean {
  return e instanceof AdminAuthError;
}

export async function adminLogin(username: string, password: string) {
  const data = await adminFetch<{ token: string }>("/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  if (!data.token) throw new Error("ما رجع حتى توكن");
  setToken(data.token);
  return data;
}

export function adminMe() {
  return adminFetch<{ ok: boolean; username: string }>("/me");
}

export function fetchMetrics(from: string, to: string) {
  return adminFetch<DashboardMetrics>(`/metrics?from=${from}&to=${to}`);
}

export function fetchOrders(params: {
  from: string;
  to: string;
  status?: string;
  q?: string;
  morocco_only?: boolean;
  page?: number;
}) {
  const sp = new URLSearchParams({
    from: params.from,
    to: params.to,
    morocco_only: params.morocco_only === false ? "false" : "true",
    page: String(params.page || 1),
    page_size: "40",
  });
  if (params.status) sp.set("status", params.status);
  if (params.q) sp.set("q", params.q);
  return adminFetch<{ total: number; page: number; page_size: number; orders: AdminOrder[] }>(`/orders?${sp}`);
}

export function fetchOrder(id: string) {
  return adminFetch<AdminOrder>(`/orders/${encodeURIComponent(id)}`);
}

export function patchOrder(id: string, body: { status?: OrderStatus; notes?: string }) {
  return adminFetch<AdminOrder>(`/orders/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export function saveEconomics(body: EconomicsInput) {
  return adminFetch<{ economics: EconomicsInput }>("/settings", {
    method: "PUT",
    body: JSON.stringify(body),
  });
}
