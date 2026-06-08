import { NextRequest, NextResponse } from "next/server";
import {
  buildSheetsPayload,
  generateOrderId,
  validateAndPrice,
  type CreateOrderBody,
  OrderValidationError,
} from "@/lib/orderPricing";
import { isValidKsaPhone, toE164 } from "@/lib/phone";
import { syncOrderToSheets } from "@/lib/sheetsWebhook";

const UPSELL_PRICE_SAR = 99;

async function proxyToBackend(body: unknown, apiBase: string): Promise<NextResponse | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(`${apiBase}/api/v1/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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

    if (res.ok) {
      return NextResponse.json(data, { status: res.status });
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
      { detail: "الاسم مطلوب", code: "VALIDATION_ERROR" },
      { status: 400 }
    );
  }

  if (!isValidKsaPhone(body.customer_phone)) {
    return NextResponse.json(
      { detail: "رقم الجوال غير صالح", code: "INVALID_PHONE" },
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
    priced.grand_total_sar,
    priced.upsell_accepted,
    priced.upsell_sku
  );

  const sync = await syncOrderToSheets(sheetsPayload);
  if (!sync.ok) {
    return NextResponse.json(
      {
        detail: "تعذر إرسال الطلب. حاولي مرة أخرى.",
        code: "SHEETS_SYNC_FAILED",
        sheets_sync_error: sync.error,
      },
      { status: 502 }
    );
  }

  const upsellTotal = priced.upsell_accepted ? UPSELL_PRICE_SAR : 0;
  const tierTotal = priced.grand_total_sar - upsellTotal;

  return NextResponse.json({
    order_id: orderId,
    grand_total_sar: priced.grand_total_sar,
    tier_total_sar: tierTotal,
    upsell_total_sar: upsellTotal,
    status: "pending_confirmation",
    thank_you_path: `/thank-you/${orderId}`,
    sheets_synced: true,
  });
}

/** Orders: backend DB + Sheet first; Sheet-only fallback if backend down */
export async function POST(request: NextRequest) {
  let body: CreateOrderBody;
  try {
    body = (await request.json()) as CreateOrderBody;
  } catch {
    return NextResponse.json({ detail: "طلب غير صالح", code: "INVALID_JSON" }, { status: 400 });
  }

  const sheetsUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim();
  const apiBase =
    process.env.API_URL?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

  // Backend first: saves to DB (admin dashboard) + syncs Google Sheet
  if (apiBase) {
    const backendRes = await proxyToBackend(body, apiBase);
    if (backendRes) {
      return backendRes;
    }
  }

  if (sheetsUrl) {
    return handleSheetsOrder(body);
  }

  if (apiBase) {
    return NextResponse.json(
      {
        detail: "تعذر الاتصال بالخادم. أضيفي GOOGLE_SHEETS_WEBHOOK_URL في إعدادات الموقع.",
        code: "NETWORK_ERROR",
      },
      { status: 502 }
    );
  }

  return NextResponse.json(
    { detail: "الطلبات غير مهيأة على السيرفر", code: "API_NOT_CONFIGURED" },
    { status: 503 }
  );
}
