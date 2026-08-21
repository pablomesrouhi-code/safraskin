import { NextRequest, NextResponse } from "next/server";
import {
  buildSheetsPayload,
  generateOrderId,
  validateAndPrice,
  type CreateOrderBody,
  OrderValidationError,
} from "@/lib/orderPricing";
import { isValidMaPhone, toE164 } from "@/lib/phone";
import { syncOrderToSheets } from "@/lib/sheetsWebhook";
import { UPSELL_PRICE_MAD } from "@/data/products";
import { apiBase, forwardingHeaders } from "@/lib/backend";

async function proxyToBackend(request: NextRequest, body: unknown): Promise<NextResponse | null> {
  const base = apiBase();
  if (!base) return null;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    const res = await fetch(`${base}/api/v1/orders`, {
      method: "POST",
      headers: forwardingHeaders(request),
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    const text = await res.text();
    let data: Record<string, unknown> = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { detail: text || "خطأ من الخادم" };
    }

    if (res.ok && (data.order_id || data.order_number)) {
      return NextResponse.json(data, { status: res.status });
    }

    if (!res.ok) {
      return NextResponse.json(
        {
          detail: typeof data.detail === "string" ? data.detail : "ما قدرناش نأكدو الطلب",
          code: typeof data.code === "string" ? data.code : "BACKEND_ERROR",
        },
        { status: res.status }
      );
    }
    return null;
  } catch {
    return null;
  }
}

async function handleSheetsOrder(body: CreateOrderBody): Promise<NextResponse> {
  const name = body.customer_name?.trim();
  if (!name || name.length < 2) {
    return NextResponse.json(
      { detail: "السمية مطلوبة", code: "VALIDATION_ERROR" },
      { status: 400 }
    );
  }

  if (!isValidMaPhone(body.customer_phone)) {
    return NextResponse.json(
      { detail: "رقم التيليفون المغربي غير صالح", code: "INVALID_PHONE" },
      { status: 400 }
    );
  }

  let priced;
  try {
    priced = validateAndPrice(body);
  } catch (e) {
    if (e instanceof OrderValidationError) {
      return NextResponse.json({ detail: e.message, code: e.code }, { status: 400 });
    }
    throw e;
  }

  const orderId = generateOrderId();
  const phoneE164 = toE164(body.customer_phone);
  const sheetsPayload = buildSheetsPayload(
    orderId,
    name,
    phoneE164,
    priced.line_items,
    priced.grand_total_mad,
    priced.upsell_accepted,
    priced.upsell_sku,
    body.customer_address
  );

  const sheetsUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim();
  if (sheetsUrl) {
    const sync = await syncOrderToSheets(sheetsPayload);
    if (!sync.ok) {
      return NextResponse.json(
        {
          detail: "ما قدرناش نسجلو الطلب. عاودي من بعد.",
          code: "SHEETS_SYNC_FAILED",
          sheets_sync_error: sync.error,
        },
        { status: 502 }
      );
    }
  } else if (process.env.NODE_ENV === "production" && !apiBase()) {
    return NextResponse.json(
      { detail: "الطلبات غير مهيأة على السيرفر", code: "API_NOT_CONFIGURED" },
      { status: 503 }
    );
  }

  const upsellTotal = priced.upsell_accepted ? UPSELL_PRICE_MAD : 0;

  return NextResponse.json({
    order_id: orderId,
    grand_total_mad: priced.grand_total_mad,
    grand_total_sar: priced.grand_total_mad,
    upsell_total_mad: upsellTotal,
    status: "pending_confirmation",
    thank_you_path: `/thank-you/${orderId}`,
    sheets_synced: Boolean(sheetsUrl),
  });
}

export async function POST(request: NextRequest) {
  let body: CreateOrderBody;
  try {
    body = (await request.json()) as CreateOrderBody;
  } catch {
    return NextResponse.json({ detail: "طلب غير صالح", code: "INVALID_JSON" }, { status: 400 });
  }

  const backendRes = await proxyToBackend(request, body);
  if (backendRes) return backendRes;

  return handleSheetsOrder(body);
}
