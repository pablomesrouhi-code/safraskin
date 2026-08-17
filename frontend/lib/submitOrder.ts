import { getSessionId, getUtmParams } from "@/lib/track";

type OrderItem = { sku: string; qty: number };

export type CreateOrderPayload = {
  customer_name: string;
  customer_phone: string;
  items: OrderItem[];
  upsell_sku?: string;
  upsell_price_mad?: number;
  upsell_price_sar?: number;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  session_id?: string;
};

export class OrderSubmitError extends Error {
  code?: string;
  constructor(message: string, code?: string) {
    super(message);
    this.name = "OrderSubmitError";
    this.code = code;
  }
}

export async function submitOrder(payload: CreateOrderPayload): Promise<string> {
  const utm = getUtmParams();
  const body: CreateOrderPayload = {
    ...payload,
    session_id: payload.session_id ?? getSessionId(),
    utm_source: payload.utm_source ?? utm.utm_source,
    utm_medium: payload.utm_medium ?? utm.utm_medium,
    utm_campaign: payload.utm_campaign ?? utm.utm_campaign,
  };

  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  let data: Record<string, unknown> = {};
  try {
    data = await res.json();
  } catch {
    /* non-JSON body */
  }

  if (!res.ok) {
    const detail =
      typeof data.detail === "string"
        ? data.detail
        : Array.isArray(data.detail)
          ? String((data.detail as { msg?: string }[])[0]?.msg ?? "فشل الطلب")
          : "ما قدرناش نأكدو الطلب. تأكدي من رقم التيليفون وعاودي.";
    const code = typeof data.code === "string" ? data.code : undefined;
    throw new OrderSubmitError(detail, code);
  }

  const orderId =
    (typeof data.order_id === "string" && data.order_id) ||
    (typeof data.order_number === "string" && data.order_number);

  if (!orderId) {
    throw new OrderSubmitError("لم يُرجع الخادم رقم الطلب");
  }

  if (data.sheets_synced === false) {
    const sheetErr =
      typeof data.sheets_sync_error === "string"
        ? data.sheets_sync_error
        : "تعذر إرسال الطلب إلى Google Sheet";
    throw new OrderSubmitError(sheetErr, "SHEETS_SYNC_FAILED");
  }

  return orderId;
}
