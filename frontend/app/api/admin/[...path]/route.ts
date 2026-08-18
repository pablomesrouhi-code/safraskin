import { createHmac, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { apiBase, forwardingHeaders } from "@/lib/backend";

export const dynamic = "force-dynamic";

const DEFAULT_USER = "admin";
const DEFAULT_PASS = "change_me_strong_password";

let savedEconomics: Record<string, number> = {
  product_cost_mad: 0,
  packaging_mad: 0,
  delivery_cost_mad: 0,
  return_cost_mad: 0,
  cod_fee_pct: 0,
  selling_price_mad: 0,
  ad_spend_mad: 0,
  assumed_confirmation_rate: 50,
  assumed_delivery_rate: 80,
};

function adminUser() {
  return (process.env.ADMIN_USERNAME || process.env.NEXT_PUBLIC_ADMIN_USERNAME || DEFAULT_USER).trim();
}

function adminPass() {
  return process.env.ADMIN_PASSWORD || process.env.NEXT_PUBLIC_ADMIN_PASSWORD || DEFAULT_PASS;
}

function localToken(user: string) {
  const secret = process.env.ADMIN_JWT_SECRET || adminPass();
  return createHmac("sha256", secret).update(`safraskin-admin:${user}`).digest("hex");
}

function tokenOk(header: string | null) {
  const raw = (header || "").replace(/^Bearer\s+/i, "").trim();
  if (!raw) return false;
  const expected = localToken(adminUser());
  try {
    return timingSafeEqual(Buffer.from(raw), Buffer.from(expected));
  } catch {
    return false;
  }
}

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

function backendBases(): string[] {
  const list = [
    apiBase(),
    process.env.API_URL?.replace(/\/$/, "") || "",
    "http://safraskin_backend:8000",
    "http://backend:8000",
    "http://safraskin-backend:8000",
  ];
  return Array.from(new Set(list.filter(Boolean)));
}

async function tryBackend(req: NextRequest, segments: string[], rawBody: string | undefined) {
  const search = req.nextUrl.search || "";
  const auth = req.headers.get("authorization") || "";
  const headers = forwardingHeaders(req);
  if (auth) headers.Authorization = auth;

  for (const base of backendBases()) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);
    try {
      const res = await fetch(`${base}/api/v1/admin/${segments.map(encodeURIComponent).join("/")}${search}`, {
        method: req.method,
        headers,
        body: rawBody,
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (res.status === 404) continue;
      const text = await res.text();
      return new NextResponse(text, {
        status: res.status,
        headers: { "Content-Type": res.headers.get("content-type") || "application/json" },
      });
    } catch {
      clearTimeout(timeout);
    }
  }
  return null;
}

function emptyMetrics() {
  return {
    range: { from: null, to: null },
    scope: "morocco_ip_only",
    kpis: {
      clicks: 0,
      page_views: 0,
      orders: 0,
      cvr: 0,
      aov: 0,
      gross_value: 0,
      confirmed: 0,
      confirmed_value: 0,
      delivered: 0,
      delivered_value: 0,
      pending: 0,
      cancelled: 0,
      returned: 0,
      confirmation_rate: 0,
      confirmation_among_decided: 0,
      delivery_rate: 0,
      return_rate: 0,
      cancel_rate: 0,
      upsell_rate: 0,
      upsell_count: 0,
      repeat_customers: 0,
      units: 0,
    },
    funnel: { clicks: 0, product_views: 0, offer_clicks: 0, add_to_cart: 0, checkout: 0, orders: 0 },
    status_counts: {},
    daily: [],
    sources: [],
    products: [],
    economics: {
      ...savedEconomics,
      selling_used: savedEconomics.selling_price_mad,
      confirmation_used: savedEconomics.assumed_confirmation_rate,
      delivery_used: savedEconomics.assumed_delivery_rate,
      net_per_delivered: 0,
      expected_per_lead: 0,
      break_even_cpa: 0,
      break_even_cpc: 0,
      current_cpa: 0,
      current_cpc: 0,
      profit: 0,
      margin_per_order: null,
      verdict: "fill_costs",
      verdict_ar: "حط تكلفة المنتج وسعر البيع والإعلانات. الحساب كيتحدّث هنا من اللوقو.",
    },
  };
}

async function localAdmin(req: NextRequest, segments: string[], rawBody: string | undefined) {
  const action = segments[0] || "";
  const auth = req.headers.get("authorization");

  if (req.method === "POST" && action === "login") {
    let body: { username?: string; password?: string } = {};
    try {
      body = rawBody ? (JSON.parse(rawBody) as { username?: string; password?: string }) : {};
    } catch {
      body = {};
    }
    const user = (body.username || "").trim();
    const pass = body.password || "";
    if (user !== adminUser() || pass !== adminPass()) {
      return json({ detail: "السمية أو كلمة السر غالطين" }, 401);
    }
    return json({ token: localToken(user), expires_hours: 24, username: user, mode: "local" });
  }

  if (!tokenOk(auth)) {
    return json({ detail: "تسجيل الدخول مطلوب" }, 401);
  }

  if (action === "me") return json({ ok: true, username: adminUser(), mode: "local" });

  if (action === "metrics") return json(emptyMetrics());

  if (action === "orders") {
    if (segments[1] && req.method === "GET") {
      return json({ detail: "الطلب ما كاينش" }, 404);
    }
    return json({ total: 0, page: 1, page_size: 40, orders: [] });
  }

  if (action === "settings" && req.method === "GET") {
    return json({
      economics: savedEconomics,
      statuses: [],
      today: new Date().toISOString().slice(0, 10),
    });
  }

  if (action === "settings" && req.method === "PUT") {
    const body = (rawBody ? JSON.parse(rawBody) : {}) as Record<string, number>;
    savedEconomics = { ...savedEconomics, ...body };
    return json({ economics: savedEconomics });
  }

  return json({ detail: "مسار غير صالح" }, 404);
}

async function proxy(req: NextRequest, path: string[] | undefined) {
  const segments = Array.isArray(path) ? path : [];
  if (!segments.length) return json({ detail: "مسار غير صالح" }, 404);
  const rawBody = ["GET", "HEAD"].includes(req.method) ? undefined : await req.text();
  const backendRes = await tryBackend(req, segments, rawBody);
  if (backendRes) return backendRes;
  return localAdmin(req, segments, rawBody);
}

type Ctx = { params: { path: string[] } };

export async function GET(req: NextRequest, ctx: Ctx) {
  return proxy(req, ctx.params.path);
}
export async function POST(req: NextRequest, ctx: Ctx) {
  return proxy(req, ctx.params.path);
}
export async function PATCH(req: NextRequest, ctx: Ctx) {
  return proxy(req, ctx.params.path);
}
export async function PUT(req: NextRequest, ctx: Ctx) {
  return proxy(req, ctx.params.path);
}
export async function DELETE(req: NextRequest, ctx: Ctx) {
  return proxy(req, ctx.params.path);
}
