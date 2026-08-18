import { NextRequest } from "next/server";

export function apiBase(): string {
  const fromEnv =
    process.env.API_URL?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
    "";
  if (fromEnv) return fromEnv;
  if (process.env.NODE_ENV === "production") return "http://safraskin_backend:8000";
  return "http://127.0.0.1:8000";
}

export function forwardingHeaders(req: NextRequest, extra?: HeadersInit): Record<string, string> {
  const ip =
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("true-client-ip") ||
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "";
  const country = req.headers.get("cf-ipcountry") || req.headers.get("x-vercel-ip-country") || "";
  const city = req.headers.get("cf-ipcity") || req.headers.get("x-vercel-ip-city") || "";
  const ua = req.headers.get("user-agent") || "";
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (ip) {
    headers["X-Forwarded-For"] = ip;
    headers["X-Real-IP"] = ip;
    headers["CF-Connecting-IP"] = ip;
  }
  if (country) {
    headers["CF-IPCountry"] = country;
    headers["X-Vercel-IP-Country"] = country;
  }
  if (city) headers["CF-IPCity"] = city;
  if (ua) headers["User-Agent"] = ua;
  if (extra) {
    const merged = extra instanceof Headers ? Object.fromEntries(extra.entries()) : extra;
    Object.assign(headers, merged as Record<string, string>);
  }
  return headers;
}
