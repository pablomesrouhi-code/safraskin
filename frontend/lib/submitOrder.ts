type OrderItem = { sku: string; qty: number };

export type CreateOrderPayload = {
  customer_name: string;
  customer_phone: string;
  items: OrderItem[];
  upsell_sku?: string;
  upsell_price_sar?: number;
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
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
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
          : "فشل تأكيد الطلب. تحققي من رقم الجوال وحاولي مرة أخرى.";
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
