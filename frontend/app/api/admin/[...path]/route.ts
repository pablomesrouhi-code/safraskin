import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/lib/backendUrl";

type Ctx = { params: Promise<{ path: string[] }> };

async function proxyAdmin(request: NextRequest, pathSegments: string[]) {
  const base = getBackendUrl();
  if (!base) {
    return NextResponse.json(
      {
        detail:
          "API_URL غير مهيأ على frontend-safra. أضف: API_URL=https://api.safraskin.online",
        code: "API_NOT_CONFIGURED",
      },
      { status: 503 }
    );
  }

  const subPath = pathSegments.join("/");
  const target = `${base}/api/v1/admin/${subPath}${request.nextUrl.search}`;

  const headers: Record<string, string> = {};
  const contentType = request.headers.get("content-type");
  if (contentType) headers["Content-Type"] = contentType;
  const auth = request.headers.get("authorization");
  if (auth) headers["Authorization"] = auth;

  const init: RequestInit = { method: request.method, headers };
  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.text();
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const res = await fetch(target, { ...init, signal: controller.signal });
    clearTimeout(timeout);

    const text = await res.text();

    if (res.status === 404) {
      return NextResponse.json(
        {
          detail:
            "Admin API غير موجودة — redeploy backend-safra + env ADMIN_USERNAME/PASSWORD/JWT_SECRET",
          code: "ADMIN_NOT_DEPLOYED",
        },
        { status: 502 }
      );
    }

    return new NextResponse(text, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("Content-Type") || "application/json",
      },
    });
  } catch {
    return NextResponse.json(
      {
        detail: "تعذر الاتصال بـ api.safraskin.online — تحقق أن backend-safra يعمل",
        code: "BACKEND_UNREACHABLE",
      },
      { status: 502 }
    );
  }
}

export async function GET(request: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  return proxyAdmin(request, path);
}

export async function POST(request: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  return proxyAdmin(request, path);
}

export async function PATCH(request: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  return proxyAdmin(request, path);
}
