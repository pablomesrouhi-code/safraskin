"use client";

import { useEffect, useState } from "react";
import { Check, Copy, MessageCircle, Phone, X } from "lucide-react";
import {
  type AdminOrder,
  type OrderStatus,
  STATUS_FLOW,
  STATUS_META,
  formatMad,
  formatWhen,
  patchOrder,
  waLink,
} from "@/lib/adminApi";
import { formatPhoneDisplay } from "@/lib/phone";
import { UPSELL_PRICE_MAD } from "@/data/products";
import clsx from "clsx";

export default function OrderPreview({
  order,
  onClose,
  onUpdated,
}: {
  order: AdminOrder;
  onClose: () => void;
  onUpdated: (next: AdminOrder) => void;
}) {
  const [notes, setNotes] = useState(order.notes || "");
  const [busy, setBusy] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const phone = formatPhoneDisplay(order.customer_phone);
  const meta = STATUS_META[order.status];

  useEffect(() => {
    setNotes(order.notes || "");
  }, [order.order_id, order.notes]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function save(partial: { status?: OrderStatus; notes?: string }, key: string) {
    setBusy(key);
    setError("");
    try {
      const next = await patchOrder(order.order_id, partial);
      onUpdated(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : "ما قدرناش نعدّلو الطلب");
    } finally {
      setBusy(null);
    }
  }

  async function copyId() {
    try {
      await navigator.clipboard.writeText(order.order_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      <button type="button" className="absolute inset-0 bg-ink/40" onClick={onClose} aria-label="إغلاق" />
      <aside className="relative mr-auto flex h-full w-full max-w-lg flex-col overflow-y-auto bg-cream shadow-2xl">
        <div className="bg-ink px-5 pb-5 pt-4 text-white">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold tracking-[0.18em] text-saffron">SAFRASKIN · COD</p>
              <h2 className="mt-1 font-english text-lg font-bold tracking-wide">{order.order_id}</h2>
              <p className="mt-1 text-xs text-white/70">{formatWhen(order.created_at)}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1.5 text-white/80 hover:bg-white/10"
              aria-label="إغلاق"
            >
              <X size={18} />
            </button>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className={clsx("rounded-full px-3 py-1 text-xs font-bold", meta.tone)}>{meta.label}</span>
            {order.is_morocco ? (
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-200">IP المغرب</span>
            ) : (
              <span className="rounded-full bg-rose/30 px-3 py-1 text-xs text-rose-100">
                IP خارج المغرب{order.ip_country ? ` · ${order.ip_country}` : ""}
              </span>
            )}
            <button
              type="button"
              onClick={copyId}
              className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs text-white/80"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? "تنسخ" : "نسخ الرقم"}
            </button>
          </div>
        </div>

        <div className="space-y-4 p-5">
          <section className="rounded-2xl border border-border bg-white p-4">
            <p className="text-[11px] font-bold text-muted">الزبونة</p>
            <p className="mt-1 text-lg font-bold text-ink">{order.customer_name}</p>
            <p className="mt-1 font-english text-base font-semibold tabular-nums text-ink" dir="ltr">
              {phone}
            </p>
            {(order.ip_city || order.ip_country) && (
              <p className="mt-1 text-xs text-muted">
                {order.ip_city || "—"}
                {order.ip_country ? ` · ${order.ip_country}` : ""}
              </p>
            )}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <a
                href={`tel:${order.customer_phone}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose py-2.5 text-sm font-bold text-white"
              >
                <Phone size={16} /> عيّط
              </a>
              <a
                href={waLink(order.customer_phone)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-600 py-2.5 text-sm font-bold text-emerald-700"
              >
                <MessageCircle size={16} /> واتساب
              </a>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-white p-4">
            <p className="text-[11px] font-bold text-muted">الطلب</p>
            <ul className="mt-3 space-y-2">
              {order.items.map((item, i) => (
                <li key={`${item.sku}-${i}`} className="flex items-start justify-between gap-3 text-sm">
                  <span className="text-ink">
                    {item.name_ar || item.product_slug}
                    <span className="mt-0.5 block text-xs text-muted">
                      {item.quantity} × {item.sku}
                    </span>
                  </span>
                </li>
              ))}
              {order.upsell_accepted ? (
                <li className="flex items-start justify-between gap-3 text-sm">
                  <span className="text-ink">
                    {order.upsell_name || "إضافة"}
                    <span className="mt-0.5 block text-xs text-muted">upsell · {formatMad(UPSELL_PRICE_MAD)}</span>
                  </span>
                </li>
              ) : null}
            </ul>
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <span className="text-sm text-muted">المجموع · الدفع عند الاستلام</span>
              <span className="text-xl font-extrabold tabular-nums text-rose">{formatMad(order.grand_total_mad)}</span>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-white p-4">
            <p className="text-[11px] font-bold text-muted">الحالة</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {STATUS_FLOW.map((status) => {
                const active = order.status === status;
                return (
                  <button
                    key={status}
                    type="button"
                    disabled={busy === status}
                    onClick={() => save({ status }, status)}
                    className={clsx(
                      "rounded-full px-3 py-1.5 text-[11px] font-bold transition",
                      active ? STATUS_META[status].tone + " ring-2 ring-ink/10" : "bg-cream text-muted hover:bg-white"
                    )}
                  >
                    {STATUS_META[status].label}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-white p-4">
            <p className="text-[11px] font-bold text-muted">ملاحظة للكونفيرماسيون</p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="mt-2 w-full rounded-xl border border-border bg-cream px-3 py-2 text-sm text-ink outline-none focus:border-saffron"
              placeholder="مدينة، موعد الاتصال، شك، عنوان..."
            />
            <button
              type="button"
              disabled={busy === "notes"}
              onClick={() => save({ notes }, "notes")}
              className="mt-2 rounded-xl bg-ink px-4 py-2 text-sm font-bold text-white"
            >
              حفظ الملاحظة
            </button>
          </section>

          <section className="rounded-2xl border border-border bg-white p-4 text-xs text-muted">
            <p>
              المصدر: {order.utm_source || "direct"}
              {order.utm_medium ? ` / ${order.utm_medium}` : ""}
              {order.utm_campaign ? ` / ${order.utm_campaign}` : ""}
            </p>
            <p className="mt-1">Sheets: {order.sheets_synced ? "متزامن" : "ما تسناش"}</p>
            {order.status_updated_at ? <p className="mt-1">آخر تحديث: {formatWhen(order.status_updated_at)}</p> : null}
          </section>

          {error ? <p className="text-sm text-rose">{error}</p> : null}
        </div>
      </aside>
    </div>
  );
}
