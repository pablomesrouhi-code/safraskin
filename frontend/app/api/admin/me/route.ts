import { NextRequest, NextResponse } from "next/server";
import { adminUser, tokenOk } from "@/lib/adminLocalAuth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!tokenOk(req.headers.get("authorization"))) {
    return NextResponse.json({ detail: "تسجيل الدخول مطلوب" }, { status: 401 });
  }
  return NextResponse.json({ ok: true, username: adminUser(), mode: "local" });
}
