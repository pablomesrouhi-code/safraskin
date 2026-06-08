"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";
import LeadFunnel from "@/components/admin/LeadFunnel";
import ProfitCalculator from "@/components/admin/ProfitCalculator";
import { adminApi, getAdminToken, type Metrics } from "@/lib/adminApi";
import { calcProfit, loadProfitCosts } from "@/lib/profitCalc";

function DashboardTopStats({ metrics: m }: { metrics: Metrics }) {
  const profit = calcProfit(m.order_counts, loadProfitCosts());
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
      <StatCard label="Leads (KSA)" value={m.funnel.leads_valid} sub={`${m.funnel.leads_total} إجمالي`} />
      <StatCard label="مُسلّم" value={m.funnel.delivered} sub={`${m.order_counts.delivered_revenue_sar} ر.س`} />
      <StatCard label="AOV" value={`${profit.aovDelivered || m.aov_sar} ر.س`} sub="متوسط الطلب" />
      <StatCard
        label="صافي الربح"
        value={`$${profit.netProfitUsd.toFixed(2)}`}
        sub={`${profit.margin.toFixed(1)}% هامش`}
      />
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);
  const monthAgo = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);
  const [from, setFrom] = useState(monthAgo);
  const [to, setTo] = useState(today);
  const [m, setM] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getAdminToken()) {
      router.replace("/admin/login");
      return;
    }
    setLoading(true);
    adminApi
      .metrics(from, to)
      .then(setM)
      .catch(() => router.replace("/admin/login"))
      .finally(() => setLoading(false));
  }, [from, to, router]);

  return (
    <>
      <AdminNav />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-wrap items-end gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">لوحة الإحصائيات</h1>
            <p className="text-sm text-gray-500">KSA فقط · بدون VPN/Proxy</p>
          </div>
          <div className="flex gap-2 mr-auto">
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="border border-border rounded-lg px-3 py-2 text-sm"
            />
            <span className="self-center text-gray-400">→</span>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="border border-border rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500">جاري التحميل…</p>
        ) : m ? (
          <>
            <DashboardTopStats metrics={m} />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard label="زيارات (KSA)" value={m.page_views} />
              <StatCard label="معدل التحويل" value={`${m.conversion_rate}%`} />
              <StatCard label="إضافة للسلة" value={m.add_to_cart} />
              <StatCard label="بدء الدفع" value={m.checkout_starts} />
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              <ProfitCalculator metrics={m} />
              <LeadFunnel funnel={m.funnel} />
            </div>

            <p className="text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2 mb-6 inline-block">
              حركة غير صالحة (VPN/خارج KSA): {m.invalid_traffic_pct}%
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-border p-5">
                <h2 className="font-semibold mb-4">حسب اليوم</h2>
                <div className="space-y-2 max-h-64 overflow-auto text-sm">
                  {m.by_day.map((d) => (
                    <div key={d.date} className="flex justify-between border-b border-gray-100 py-2">
                      <span>{d.date}</span>
                      <span className="text-gray-600">
                        {d.page_views} زيارة · {d.orders} طلب
                      </span>
                    </div>
                  ))}
                  {m.by_day.length === 0 && <p className="text-gray-400">لا بيانات</p>}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-border p-5">
                <h2 className="font-semibold mb-4">حسب المنتج</h2>
                <div className="space-y-2">
                  {m.by_product.map((p) => (
                    <div key={p.slug} className="flex justify-between text-sm py-2 border-b border-gray-100">
                      <span>{p.name_ar}</span>
                      <span className="text-sage font-medium">{p.views} مشاهدة</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {m.by_utm_source.length > 0 && (
              <div className="bg-white rounded-2xl border border-border p-5 mt-6">
                <h2 className="font-semibold mb-4">حسب المصدر (UTM)</h2>
                <div className="space-y-2">
                  {m.by_utm_source.map((u) => (
                    <div key={u.source} className="flex justify-between text-sm py-2">
                      <span>{u.source}</span>
                      <span>
                        {u.orders} طلب · {u.revenue_sar} ر.س
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : null}
      </main>
    </>
  );
}
