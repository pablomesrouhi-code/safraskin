import { NextRequest, NextResponse } from "next/server";
import { apiBase, forwardingHeaders } from "@/lib/backend";

export async function POST(request: NextRequest) {
  const base = apiBase();
  if (!base) return NextResponse.json({ ok: true, ignored: true });

  let body: unknown = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(`${base}/api/v1/events`, {
      method: "POST",
      headers: forwardingHeaders(request),
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    const text = await res.text();
    return new NextResponse(text || '{"ok":true}', {
      status: res.ok ? 200 : res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return NextResponse.json({ ok: true, ignored: true });
  }
}
