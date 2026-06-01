/** POST order row to Google Apps Script (same format as backend). */

export async function syncOrderToSheets(
  payload: Record<string, string | number>
): Promise<{ ok: boolean; error?: string }> {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim();
  if (!url) {
    return { ok: false, error: "GOOGLE_SHEETS_WEBHOOK_URL not set on frontend" };
  }

  const execUrl = url.replace(/\/dev\/?$/, "/exec");
  const body = JSON.stringify(payload);

  const attempts: Array<() => Promise<Response>> = [
    () =>
      fetch(execUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ payload: body }).toString(),
        redirect: "follow",
      }),
    () =>
      fetch(execUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        redirect: "follow",
      }),
  ];

  let lastError = "Unknown error";

  for (const attempt of attempts) {
    try {
      const res = await attempt();
      const text = await res.text();

      if (!res.ok) {
        lastError = `HTTP ${res.status}: ${text.slice(0, 200)}`;
        continue;
      }

      if (text.trim().startsWith("<")) {
        lastError = "Got HTML — redeploy Apps Script as Anyone and use /exec URL";
        continue;
      }

      let result: { success?: boolean; error?: string };
      try {
        result = JSON.parse(text);
      } catch {
        lastError = `Invalid JSON: ${text.slice(0, 200)}`;
        continue;
      }

      if (!result.success) {
        lastError = result.error || JSON.stringify(result);
        continue;
      }

      return { ok: true };
    } catch (e) {
      lastError = e instanceof Error ? e.message : String(e);
    }
  }

  return { ok: false, error: lastError };
}
