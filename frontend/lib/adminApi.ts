const TOKEN_KEY = "safra_admin_token";

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token: string) {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearAdminToken() {
  sessionStorage.removeItem(TOKEN_KEY);
}

async function adminFetch<T>(
  path: string,
  init?: RequestInit & { skipAuthRedirect?: boolean }
): Promise<T> {
  const token = getAdminToken();
  const { skipAuthRedirect, ...fetchInit } = init ?? {};

  let res: Response;
  try {
    res = await fetch(`/api/admin${path}`, {
      ...fetchInit,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...fetchInit.headers,
      },
    });
  } catch {
    throw new Error("تعذر الاتصال — تحقق من الإنترنت أو أعد تحميل الصفحة");
  }

  if (res.status === 401 && !skipAuthRedirect) {
    clearAdminToken();
    window.location.href = "/admin/login";
    throw new Error("Unauthorized");
  }

  let data: Record<string, unknown> = {};
  const text = await res.text();
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error("استجابة غير صالحة من الخادم");
  }

  if (!res.ok) {
    const detail = typeof data.detail === "string" ? data.detail : "Request failed";
    throw new Error(detail);
  }

  return data as T;
}

export type Metrics = {
  date_from: string;
  date_to: string;
  page_views: number;
  product_views: number;
  add_to_cart: number;
  checkout_starts: number;
  orders: number;
  valid_orders: number;
  revenue_sar: number;
  conversion_rate: number;
  aov_sar: number;
  invalid_traffic_pct: number;
  funnel: {
    leads_total: number;
    leads_valid: number;
    checkout_starts: number;
    pending_confirmation: number;
    confirmed: number;
    shipped: number;
    delivered: number;
    cancelled: number;
    refunded: number;
    returned: number;
  };
  order_counts: {
    delivered_revenue_sar: number;
    delivered_count: number;
    confirmed_count: number;
    warehouse_count: number;
    return_count: number;
  };
  by_day: { date: string; page_views: number; add_to_cart: number; orders: number }[];
  by_product: { slug: string; name_ar: string; views: number }[];
  by_utm_source: { source: string; orders: number; revenue_sar: number }[];
};

export type OrderListItem = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone_display: string;
  grand_total_sar: number;
  status: string;
  is_valid_traffic: boolean;
  sheets_synced: boolean;
  created_at: string;
  item_count: number;
};

export type OrderDetail = OrderListItem & {
  customer_phone: string;
  tier_count: number;
  tier_total_sar: number;
  upsell_accepted: boolean;
  upsell_sku: string | null;
  upsell_price_sar: number | null;
  payment_method: string;
  client_ip: string | null;
  country_code: string | null;
  country_name: string | null;
  is_vpn: boolean;
  is_proxy: boolean;
  is_hosting: boolean;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  admin_notes: string | null;
  items: { product_slug: string; sku: string; quantity: number; name_ar: string }[];
};

export const adminApi = {
  login: (username: string, password: string) =>
    adminFetch<{ token: string; username: string }>("/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      skipAuthRedirect: true,
    }),

  metrics: (from: string, to: string) =>
    adminFetch<Metrics>(`/metrics?date_from=${from}&date_to=${to}`),

  orders: (params: Record<string, string>) => {
    const q = new URLSearchParams(params).toString();
    return adminFetch<{ items: OrderListItem[]; total: number; page: number; page_size: number }>(
      `/orders?${q}`
    );
  },

  order: (id: string) => adminFetch<OrderDetail>(`/orders/${id}`),

  updateOrder: (id: string, status: string, admin_notes?: string) =>
    adminFetch<OrderDetail>(`/orders/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status, admin_notes }),
    }),
};
