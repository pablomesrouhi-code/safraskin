import { NextRequest, NextResponse } from "next/server";
import { loginResponse, passwordAllowed, userAllowed } from "@/lib/adminLocalAuth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: { username?: string; password?: string } = {};
  try {
    body = (await req.json()) as { username?: string; password?: string };
  } catch {
    body = {};
  }
  const user = (body.username || "").trim();
  const pass = body.password || "";
  if (!userAllowed(user) || !passwordAllowed(pass)) {
    return NextResponse.json({ detail: "السمية أو كلمة السر غالطين" }, { status: 401 });
  }
  return loginResponse(user);
}
