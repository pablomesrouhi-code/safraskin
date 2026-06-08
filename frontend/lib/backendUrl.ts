/** Backend API — env override, then production default. */
export function getBackendUrl(): string | null {
  const url =
    process.env.API_URL?.trim() ||
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    (process.env.NODE_ENV === "production" ? "https://api.safraskin.online" : "");
  return url ? url.replace(/\/$/, "") : null;
}
