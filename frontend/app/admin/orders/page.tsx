"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";
import { adminApi, getAdminToken, type OrderListItem } from "@/lib/adminApi";
import clsx from "clsx";

const STATUS_LABELS: Record<string, string> = {
  pending_confirmation: "Lead جديد",
  confirmed: "مؤكد",
  shipped: "تم الشحن",
  delivered: "مُسلّم",
  cancelled: "ملغي / رجوع",
  refunded: "مسترد",
};

export default function AdminOrdersPage() {
  const router = useRouter();
  const [items, setItems] = useState<OrderListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [validOnly, setValidOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getAdminToken()) {
      router.replace("/admin/login");
      return;
    }
    setLoading(true);
    const params: Record<string, string> = {
      page: String(page),
      page_size: "20",
    };
    if (status) params.status = status;
    if (search) params.search = search;
    if (validOnly) params.valid_only = "true";

    adminApi
      .orders(params)
      .then((res) => {
        setItems(res.items);
        setTotal(res.total);
      })
      .catch(() => router.replace("/admin/login"))
      .finally(() => setLoading(false));
  }, [page, status, search, validOnly, router]);

  return (
    <>
      <AdminNav />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-1">Leads / Orders</h1>
        <p className="text-sm text-gray-500 mb-6">كل الطلبات — حدّث الحالة لحساب الربح (مؤكد → شحن → مُسلّم)</p>

        <div className="flex flex-wrap gap-3 mb-6">
          <input
            type="search"
            placeholder="بحث برقم الطلب أو الهاتف…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="border border-border rounded-xl px-4 py-2 text-sm min-w-[220px]"
          />
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="border border-border rounded-xl px-4 py-2 text-sm"
          >
            <option value="">كل الحالات</option>
            {Object.entries(STATUS_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-sm text-gray-600 border border-border rounded-xl px-4 py-2 cursor-pointer">
            <input
              type="checkbox"
              checked={validOnly}
              onChange={(e) => {
                setValidOnly(e.target.checked);
                setPage(1);
              }}
            />
            KSA فقط
          </label>
        </div>

        {loading ? (
          <p className="text-gray-500">جاري التحميل…</p>
        ) : (
          <div className="bg-white rounded-2xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-right px-4 py-3 font-medium">الطلب</th>
                  <th className="text-right px-4 py-3 font-medium">العميل</th>
                  <th className="text-right px-4 py-3 font-medium">المبلغ</th>
                  <th className="text-right px-4 py-3 font-medium">الحالة</th>
                  <th className="text-right px-4 py-3 font-medium">التاريخ</th>
                </tr>
              </thead>
              <tbody>
                {items.map((o) => (
                  <tr key={o.id} className="border-t border-gray-100 hover:bg-sage/5">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="font-mono text-sage-dark hover:underline"
                      >
                        {o.order_number}
                      </Link>
                      {!o.is_valid_traffic && (
                        <span className="mr-2 text-xs text-amber-600">VPN</span>
                      )}
                      {o.sheets_synced && (
                        <span className="mr-2 text-xs text-green-600">✓ Sheet</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div>{o.customer_name}</div>
                      <div className="text-gray-400 text-xs" dir="ltr">
                        {o.customer_phone_display}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium">{o.grand_total_sar} ر.س</td>
                    <td className="px-4 py-3">
                      <span
                        className={clsx(
                          "inline-block px-2 py-0.5 rounded-full text-xs font-medium",
                          (o.status === "pending" || o.status === "pending_confirmation") &&
                            "bg-amber-100 text-amber-800",
                          o.status === "confirmed" && "bg-blue-100 text-blue-800",
                          o.status === "delivered" && "bg-green-100 text-green-800",
                          o.status === "cancelled" && "bg-red-100 text-red-800"
                        )}
                      >
                        {STATUS_LABELS[o.status] || o.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(o.created_at).toLocaleString("ar-SA")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {items.length === 0 && (
              <p className="text-center text-gray-400 py-12">لا توجد طلبات</p>
            )}
          </div>
        )}

        {total > 20 && (
          <div className="flex justify-center gap-2 mt-6">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 border rounded-lg text-sm disabled:opacity-40"
            >
              السابق
            </button>
            <span className="self-center text-sm text-gray-500">
              {page} / {Math.ceil(total / 20)}
            </span>
            <button
              disabled={page * 20 >= total}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 border rounded-lg text-sm disabled:opacity-40"
            >
              التالي
            </button>
          </div>
        )}
      </main>
    </>
  );
}
