import { PRODUCTS, TIER_PRICES, UPSELL_PRICE_SAR, type ProductSlug } from "@/data/products";

export type OrderItemInput = { sku: string; qty: number };

export type CreateOrderBody = {
  customer_name: string;
  customer_phone: string;
  items: OrderItemInput[];
  upsell_sku?: string;
  upsell_price_sar?: number;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  session_id?: string;
};

const SKU_TO_SLUG: Record<string, ProductSlug> = {
  SK847291CY: "cyclecalm",
  SK295103OR: "oralflora",
  SK716408CB: "clearbalance",
  "BL-CYCLE-01": "cyclecalm",
  "BL-ORAL-02": "oralflora",
  "BL-SKIN-03": "clearbalance",
};

const SLUG_TO_NAME_AR = Object.fromEntries(
  PRODUCTS.map((p) => [p.slug, p.nameAr])
) as Record<ProductSlug, string>;

export class OrderValidationError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
  }
}

function slugForSku(sku: string): ProductSlug | null {
  return SKU_TO_SLUG[sku.trim().toUpperCase()] ?? null;
}

function calculateTier(slugs: ProductSlug[], totalQty: number): { count: number; total: number } {
  const unique = new Set(slugs);
  if (unique.size === 1 && totalQty > 0) {
    const count = Math.min(Math.max(totalQty, 1), 3) as 1 | 2 | 3;
    return { count, total: TIER_PRICES[count] };
  }
  const count = Math.min(unique.size, 3) || 1;
  return { count, total: TIER_PRICES[count as 1 | 2 | 3] };
}

export type PricedLine = { sku: string; product_slug: ProductSlug; quantity: number };

export function validateAndPrice(body: CreateOrderBody): {
  line_items: PricedLine[];
  grand_total_sar: number;
  upsell_accepted: boolean;
  upsell_sku: string | null;
} {
  if (!body.items?.length) {
    throw new OrderValidationError("السلة فارغة", "EMPTY_CART");
  }

  const line_items: PricedLine[] = [];
  const slugs: ProductSlug[] = [];

  for (const item of body.items) {
    const sku = item.sku.trim().toUpperCase();
    const slug = slugForSku(sku);
    if (!slug) {
      throw new OrderValidationError(`منتج غير معروف: ${sku}`, "INVALID_SKU");
    }
    if (item.qty < 1) {
      throw new OrderValidationError("الكمية غير صالحة", "INVALID_QTY");
    }
    slugs.push(slug);
    line_items.push({ sku, product_slug: slug, quantity: item.qty });
  }

  let upsell_accepted = false;
  let upsell_sku: string | null = null;
  let upsell_price = 0;

  if (body.upsell_sku) {
    upsell_sku = body.upsell_sku.trim().toUpperCase();
    if (!slugForSku(upsell_sku)) {
      throw new OrderValidationError("منتج الإضافة غير صالح", "INVALID_UPSELL");
    }
    if (body.upsell_price_sar != null && body.upsell_price_sar !== UPSELL_PRICE_SAR) {
      throw new OrderValidationError("سعر الإضافة غير صحيح", "PRICE_MISMATCH");
    }
    upsell_accepted = true;
    upsell_price = UPSELL_PRICE_SAR;
  }

  const totalQty = body.items.reduce((s, i) => s + i.qty, 0);
  const tier = calculateTier(slugs, totalQty);
  const grand_total_sar = tier.total + (upsell_accepted ? upsell_price : 0);

  return { line_items, grand_total_sar, upsell_accepted, upsell_sku };
}

export function buildSheetsPayload(
  orderId: string,
  customerName: string,
  phoneE164: string,
  line_items: PricedLine[],
  grand_total_sar: number,
  upsell_accepted: boolean,
  upsell_sku: string | null
): Record<string, string | number> {
  const lines = [...line_items];
  if (upsell_accepted && upsell_sku) {
    const slug = slugForSku(upsell_sku);
    if (slug) {
      lines.push({ sku: upsell_sku, product_slug: slug, quantity: 1 });
    }
  }

  const date = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Riyadh",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date());

  return {
    date,
    orderid: orderId,
    country: "KSA",
    name: customerName.trim(),
    phone: phoneE164.replace(/^\+/, ""),
    product: lines.map((l) => SLUG_TO_NAME_AR[l.product_slug] || l.product_slug).join("/"),
    sku: lines.map((l) => l.sku).join("/"),
    quantity: lines.map((l) => String(l.quantity)).join("/"),
    total_price: grand_total_sar,
    currency: "SAR",
    status: "",
  };
}

export function generateOrderId(): string {
  const prefix = process.env.ORDER_NUMBER_PREFIX || "nama";
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let suffix = "";
  for (let i = 0; i < 8; i++) {
    suffix += chars[Math.floor(Math.random() * chars.length)];
  }
  return `${prefix}${suffix}`;
}
