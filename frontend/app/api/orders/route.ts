import { NextRequest, NextResponse } from "next/server";

/** Server-side proxy — avoids browser CORS to api.safraskin.online */
export async function POST(request: NextRequest) {
  const apiBase =
    process.env.API_URL?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

  if (!apiBase) {
    return NextResponse.json(
      { detail: "API_URL not configured on server", code: "API_NOT_CONFIGURED" },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ detail: "طلب غير صالح", code: "INVALID_JSON" }, { status: 400 });
  }

  try {
    const res = await fetch(`${apiBase}/api/v1/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const text = await res.text();
    let data: Record<string, unknown> = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { detail: text || "خطأ من الخادم" };
    }

    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { detail: "تعذر الاتصال بالخادم. حاولي مرة أخرى.", code: "NETWORK_ERROR" },
      { status: 502 }
    );
  }
}
