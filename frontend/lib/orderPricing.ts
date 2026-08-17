import {
  PRODUCTS,
  PRODUCT_SKUS,
  TIER_PRICES,
  UPSELL_PRICE_MAD,
  type ProductSlug,
} from "@/data/products";
import { getOfferPrice } from "@/lib/pricing";

export type OrderItemInput = { sku: string; qty: number };

export type CreateOrderBody = {
  customer_name: string;
  customer_phone: string;
  items: OrderItemInput[];
  upsell_sku?: string;
  upsell_price_mad?: number;
  upsell_price_sar?: number;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  session_id?: string;
};

const SKU_TO_SLUG: Record<string, ProductSlug> = {
  [PRODUCT_SKUS.clarelia]: "clarelia",
  [PRODUCT_SKUS.femmelia]: "femmelia",
  [PRODUCT_SKUS.capilys]: "capilys",
  [PRODUCT_SKUS.luminora]: "luminora",
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

export type PricedLine = { sku: string; product_slug: ProductSlug; quantity: number };

export function validateAndPrice(body: CreateOrderBody): {
  line_items: PricedLine[];
  grand_total_mad: number;
  upsell_accepted: boolean;
  upsell_sku: string | null;
} {
  if (!body.items?.length) {
    throw new OrderValidationError("السلة فارغة", "EMPTY_CART");
  }

  const line_items: PricedLine[] = [];
  let merchandise = 0;

  for (const item of body.items) {
    const sku = item.sku.trim().toUpperCase();
    const slug = slugForSku(sku);
    if (!slug) {
      throw new OrderValidationError(`منتج غير معروف: ${sku}`, "INVALID_SKU");
    }
    if (item.qty < 1) {
      throw new OrderValidationError("الكمية غير صالحة", "INVALID_QTY");
    }
    line_items.push({ sku, product_slug: slug, quantity: item.qty });
    merchandise += getOfferPrice(item.qty);
  }

  let upsell_accepted = false;
  let upsell_sku: string | null = null;
  let upsell_price = 0;
  const incomingUpsell = body.upsell_sku;
  const incomingPrice = body.upsell_price_mad ?? body.upsell_price_sar;

  if (incomingUpsell) {
    upsell_sku = incomingUpsell.trim().toUpperCase();
    if (!slugForSku(upsell_sku)) {
      throw new OrderValidationError("منتج الإضافة غير صالح", "INVALID_UPSELL");
    }
    if (incomingPrice != null && incomingPrice !== UPSELL_PRICE_MAD) {
      throw new OrderValidationError("سعر الإضافة غير صحيح", "PRICE_MISMATCH");
    }
    upsell_accepted = true;
    upsell_price = UPSELL_PRICE_MAD;
  }

  return {
    line_items,
    grand_total_mad: merchandise + upsell_price,
    upsell_accepted,
    upsell_sku,
  };
}

export function buildSheetsPayload(
  orderId: string,
  customerName: string,
  phoneE164: string,
  line_items: PricedLine[],
  grand_total_mad: number,
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
    timeZone: "Africa/Casablanca",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date());

  return {
    date,
    orderid: orderId,
    country: "MA",
    name: customerName.trim(),
    phone: phoneE164.replace(/^\+/, ""),
    product: lines.map((l) => SLUG_TO_NAME_AR[l.product_slug] || l.product_slug).join("/"),
    sku: lines.map((l) => l.sku).join("/"),
    quantity: lines.map((l) => String(l.quantity)).join("/"),
    total_price: grand_total_mad,
    currency: "MAD",
    status: "",
  };
}

export function generateOrderId(): string {
  const prefix = process.env.ORDER_NUMBER_PREFIX || "safra";
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let suffix = "";
  for (let i = 0; i < 8; i++) {
    suffix += chars[Math.floor(Math.random() * chars.length)];
  }
  return `${prefix}${suffix}`;
}

export { TIER_PRICES };
