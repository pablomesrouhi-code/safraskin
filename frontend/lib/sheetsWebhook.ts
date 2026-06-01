/** POST order row to Google Apps Script (GET fallback avoids Google 405 on POST redirect). */

function normalizeExecUrl(url: string): string {
  const u = url.trim();
  if (u.includes("/macros/s/") && u.replace(/\/$/, "").endsWith("/dev")) {
    return u.replace(/\/dev\/?$/, "/exec");
  }
  return u;
}

function validateWebhookUrl(url: string): string | null {
  const u = url.trim();
  if (!u) return "GOOGLE_SHEETS_WEBHOOK_URL is empty";
  if (u.includes("docs.google.com/spreadsheets") || u.includes("spreadsheets/d/")) {
    return "Wrong URL: use Apps Script /exec URL, not the Sheet link";
  }
  if (!u.includes("script.google.com/macros")) {
    return "Wrong URL: must be script.google.com/macros/s/.../exec";
  }
  return null;
}

function parseSheetsResponse(text: string): { ok: boolean; error?: string } {
  const trimmed = text.trim();
  if (!trimmed) {
    return { ok: false, error: "Empty response from Google Apps Script" };
  }
  if (trimmed.startsWith("<")) {
    return {
      ok: false,
      error: "Got HTML — redeploy Apps Script (Anyone) and use /exec URL",
    };
  }
  try {
    const result = JSON.parse(trimmed) as { success?: boolean; error?: string };
    if (!result.success) {
      return { ok: false, error: result.error || JSON.stringify(result) };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: `Invalid JSON: ${trimmed.slice(0, 200)}` };
  }
}

export async function syncOrderToSheets(
  payload: Record<string, string | number>
): Promise<{ ok: boolean; error?: string }> {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim();
  if (!url) {
    return { ok: false, error: "GOOGLE_SHEETS_WEBHOOK_URL not set on frontend Easypanel" };
  }

  const urlErr = validateWebhookUrl(url);
  if (urlErr) {
    return { ok: false, error: urlErr };
  }

  const execUrl = normalizeExecUrl(url);
  const body = JSON.stringify(payload);
  let lastError = "Unknown error";

  // 1) GET ?payload= — works when POST redirect returns 405 (common on Google Apps Script)
  try {
    const getUrl = `${execUrl}?payload=${encodeURIComponent(body)}`;
    const res = await fetch(getUrl, { method: "GET", redirect: "follow" });
    const parsed = parseSheetsResponse(await res.text());
    if (parsed.ok) return { ok: true };
    lastError = `GET: ${parsed.error}`;
  } catch (e) {
    lastError = `GET: ${e instanceof Error ? e.message : String(e)}`;
  }

  // 2) POST form (no manual redirect — avoid 405 on googleusercontent.com)
  try {
    const res = await fetch(execUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ payload: body }).toString(),
      redirect: "follow",
    });
    const parsed = parseSheetsResponse(await res.text());
    if (parsed.ok) return { ok: true };
    lastError = `POST: ${parsed.error}`;
  } catch (e) {
    lastError = `POST: ${e instanceof Error ? e.message : String(e)}`;
  }

  if (lastError.includes("404")) {
    return {
      ok: false,
      error:
        "Webhook 404 — Apps Script → Deploy → New deployment → copy /exec URL → Easypanel GOOGLE_SHEETS_WEBHOOK_URL",
    };
  }

  return { ok: false, error: lastError };
}
