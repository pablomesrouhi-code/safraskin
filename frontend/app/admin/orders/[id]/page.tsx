"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";
import { adminApi, getAdminToken, type OrderDetail } from "@/lib/adminApi";
import { Shield, ShieldAlert, MapPin, Phone, User, Package } from "lucide-react";

const STATUS_OPTIONS = [
  { value: "pending_confirmation", label: "Lead جديد" },
  { value: "confirmed", label: "مؤكد (+$1.70)" },
  { value: "shipped", label: "شحن (+$0.80 warehouse)" },
  { value: "delivered", label: "مُسلّم (+$4.00)" },
  { value: "cancelled", label: "ملغي / رجوع (+$1.30)" },
  { value: "refunded", label: "مسترد (+$1.30)" },
];

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!getAdminToken()) {
      router.replace("/admin/login");
      return;
    }
    adminApi
      .order(id)
      .then((o) => {
        setOrder(o);
        setStatus(o.status);
        setNotes(o.admin_notes || "");
      })
      .catch(() => router.replace("/admin/login"));
  }, [id, router]);

  const save = async () => {
    if (!order) return;
    setSaving(true);
    try {
      const updated = await adminApi.updateOrder(order.id, status, notes);
      setOrder(updated);
    } finally {
      setSaving(false);
    }
  };

  if (!order) {
    return (
      <>
        <AdminNav />
        <main className="max-w-3xl mx-auto px-4 py-12 text-gray-500">جاري التحميل…</main>
      </>
    );
  }

  return (
    <>
      <AdminNav />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/admin/orders" className="text-sm text-sage hover:underline mb-4 inline-block">
          ← العودة للطلبات
        </Link>

        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="bg-gradient-to-l from-sage/10 to-cream px-6 py-5 border-b border-border">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">طلب COD</p>
                <h1 className="text-2xl font-bold font-mono text-sage-dark">{order.order_number}</h1>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(order.created_at).toLocaleString("ar-SA")}
                </p>
              </div>
              <div className="text-left">
                <p className="text-3xl font-bold text-gray-900">{order.grand_total_sar} ر.س</p>
                <p className="text-xs text-gray-500">الدفع عند الاستلام</p>
              </div>
            </div>
          </div>

          <div className="px-6 py-5 grid md:grid-cols-2 gap-6">
            <section>
              <h2 className="text-sm font-semibold text-gray-500 mb-3 flex items-center gap-2">
                <User size={16} /> العميل
              </h2>
              <p className="font-medium text-lg">{order.customer_name}</p>
              <p className="flex items-center gap-2 text-gray-600 mt-1" dir="ltr">
                <Phone size={14} />
                {order.customer_phone_display}
              </p>
            </section>

            <section>
              <h2 className="text-sm font-semibold text-gray-500 mb-3 flex items-center gap-2">
                {order.is_valid_traffic ? (
                  <Shield size={16} className="text-green-600" />
                ) : (
                  <ShieldAlert size={16} className="text-amber-600" />
                )}
                التحقق من الزيارة
              </h2>
              <div className="text-sm space-y-1">
                <p className="flex items-center gap-2">
                  <MapPin size={14} />
                  {order.country_name || order.country_code || "—"}
                  {order.is_valid_traffic ? (
                    <span className="text-green-600 text-xs">KSA صالح</span>
                  ) : (
                    <span className="text-amber-600 text-xs">غير صالح</span>
                  )}
                </p>
                {order.client_ip && (
                  <p className="text-gray-400 font-mono text-xs" dir="ltr">
                    {order.client_ip}
                  </p>
                )}
                {(order.is_vpn || order.is_proxy || order.is_hosting) && (
                  <p className="text-amber-700 text-xs">
                    {order.is_vpn && "VPN "}
                    {order.is_proxy && "Proxy "}
                    {order.is_hosting && "Hosting"}
                  </p>
                )}
              </div>
            </section>
          </div>

          <div className="px-6 py-5 border-t border-border">
            <h2 className="text-sm font-semibold text-gray-500 mb-3 flex items-center gap-2">
              <Package size={16} /> المنتجات
            </h2>
            <ul className="space-y-3">
              {order.items.map((item, i) => (
                <li
                  key={i}
                  className="flex justify-between items-center bg-gray-50 rounded-xl px-4 py-3"
                >
                  <div>
                    <p className="font-medium">{item.name_ar}</p>
                    <p className="text-xs text-gray-400 font-mono">{item.sku}</p>
                  </div>
                  <span className="text-sage font-semibold">×{item.quantity}</span>
                </li>
              ))}
            </ul>
            {order.upsell_accepted && order.upsell_sku && (
              <p className="text-sm text-sage mt-3">
                + عرض إضافي: {order.upsell_sku} ({order.upsell_price_sar} ر.س)
              </p>
            )}
            <p className="text-xs text-gray-400 mt-2">
              {order.tier_count} عبوة · المجموع الفرعي {order.tier_total_sar} ر.س
            </p>
          </div>

          {(order.utm_source || order.utm_campaign) && (
            <div className="px-6 py-4 border-t border-border text-sm text-gray-600">
              UTM: {order.utm_source} / {order.utm_medium} / {order.utm_campaign}
            </div>
          )}

          <div className="px-6 py-5 border-t border-border bg-gray-50/50">
            <h2 className="text-sm font-semibold text-gray-500 mb-3">إدارة الطلب</h2>
            <div className="flex flex-wrap gap-3 mb-4">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="border border-border rounded-xl px-4 py-2 text-sm bg-white"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <button
                onClick={save}
                disabled={saving}
                className="bg-sage text-white px-6 py-2 rounded-xl text-sm font-medium disabled:opacity-60"
              >
                {saving ? "جاري الحفظ…" : "حفظ"}
              </button>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="ملاحظات داخلية…"
              rows={3}
              className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-white"
            />
          </div>
        </div>
      </main>
    </>
  );
}
