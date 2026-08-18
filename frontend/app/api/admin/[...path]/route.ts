import { NextRequest, NextResponse } from "next/server";
import { apiBase, forwardingHeaders } from "@/lib/backend";

export const dynamic = "force-dynamic";

async function proxy(req: NextRequest, path: string[] | undefined) {
  const base = apiBase();
  if (!base) {
    return NextResponse.json({ detail: "API_URL غير مضبوط" }, { status: 503 });
  }
  const segments = Array.isArray(path) ? path : [];
  if (!segments.length) {
    return NextResponse.json({ detail: "مسار غير صالح" }, { status: 404 });
  }
  const search = req.nextUrl.search || "";
  const url = `${base}/api/v1/admin/${segments.map(encodeURIComponent).join("/")}${search}`;
  const auth = req.headers.get("authorization") || "";
  const headers = forwardingHeaders(req);
  if (auth) headers.Authorization = auth;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  const init: RequestInit = { method: req.method, headers, signal: controller.signal };
  if (!["GET", "HEAD"].includes(req.method)) {
    init.body = await req.text();
  }

  try {
    const res = await fetch(url, init);
    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: { "Content-Type": res.headers.get("content-type") || "application/json" },
    });
  } catch {
    return NextResponse.json(
      { detail: "الباكند ما جاوبش. تأكد من API_URL وديبلوي ديال الـ API." },
      { status: 502 }
    );
  } finally {
    clearTimeout(timeout);
  }
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
