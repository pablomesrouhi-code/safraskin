import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/lib/backendUrl";

export async function POST(request: NextRequest) {
  const base = getBackendUrl();
  if (!base) {
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  const body = await request.text();
  const forwarded = request.headers.get("x-forwarded-for");
  const clientIp = forwarded?.split(",")[0]?.trim();

  try {
    const res = await fetch(`${base}/api/v1/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(clientIp ? { "X-Forwarded-For": clientIp } : {}),
        ...(request.headers.get("user-agent")
          ? { "User-Agent": request.headers.get("user-agent")! }
          : {}),
      },
      body,
    });
    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return NextResponse.json({ ok: false }, { status: 502 });
  }
}
