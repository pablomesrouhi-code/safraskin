import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";

export const DEFAULT_ADMIN_USER = "admin";
export const DEFAULT_ADMIN_PASS = "change_me_strong_password";

export function adminUser() {
  return (process.env.ADMIN_USERNAME || process.env.NEXT_PUBLIC_ADMIN_USERNAME || DEFAULT_ADMIN_USER).trim();
}

export function passwordAllowed(pass: string) {
  const candidates = [
    process.env.ADMIN_PASSWORD,
    process.env.NEXT_PUBLIC_ADMIN_PASSWORD,
    DEFAULT_ADMIN_PASS,
  ].filter((value): value is string => Boolean(value));
  return candidates.includes(pass);
}

export function userAllowed(user: string) {
  return user === adminUser() || user === DEFAULT_ADMIN_USER;
}

export function localToken(user: string) {
  const secret =
    process.env.ADMIN_JWT_SECRET || process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASS;
  return createHmac("sha256", secret).update(`safraskin-admin:${user}`).digest("hex");
}

export function tokenOk(header: string | null) {
  const raw = (header || "").replace(/^Bearer\s+/i, "").trim();
  if (!raw) return false;
  const expected = localToken(adminUser());
  try {
    return timingSafeEqual(Buffer.from(raw), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function loginResponse(user: string) {
  return NextResponse.json({
    token: localToken(user),
    expires_hours: 24,
    username: user,
    mode: "local",
  });
}
