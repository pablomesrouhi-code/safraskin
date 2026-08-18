"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import {
  BarChart3,
  Calculator,
  LogOut,
  Package,
  PhoneCall,
  Search,
  Truck,
} from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import OrderPreview from "@/components/admin/OrderPreview";
import {
  type AdminOrder,
  type DashboardMetrics,
  type EconomicsInput,
  STATUS_FLOW,
  STATUS_META,
  adminMe,
  clearToken,
  computeOkDaba,
  emptyEconomicsInput,
  getToken,
  fetchMetrics,
  fetchOrders,
  formatMad,
  formatPct,
  formatWhen,
  isAuthError,
  saveEconomics,
  shiftDate,
  todayMA,
} from "@/lib/adminApi";
import { formatPhoneDisplay } from "@/lib/phone";

type Tab = "overview" | "orders";

const PRESETS = [
  { id: "today", label: "اليوم", span: 0 },
  { id: "7", label: "7 أيام", span: 6 },
  { id: "30", label: "30 يوم", span: 29 },
  { id: "month", label: "هذا الشهر", span: -1 },
] as const;

function monthStart(iso: string): string {
  return `${iso.slice(0, 7)}-01`;
}

export default function AdminApp() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<Tab>("overview");
  const [from, setFrom] = useState(() => shiftDate(todayMA(), -6));
  const [to, setTo] = useState(() => todayMA());
  const [preset, setPreset] = useState("7");
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [q, setQ] = useState("");
  const [qDraft, setQDraft] = useState("");
  const [moroccoOnly, setMoroccoOnly] = useState(true);
  const [selected, setSelected] = useState<AdminOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [econForm, setEconForm] = useState<EconomicsInput>(() => emptyEconomicsInput());
  const econLoaded = useRef(false);

  useEffect(() => {
    let cancelled = false;
    async function boot() {
      if (!getToken()) {
        setReady(false);
        return;
      }
      try {
        await adminMe();
        if (!cancelled) setReady(true);
      } catch {
        clearToken();
        if (!cancelled) setReady(false);
      }
    }
    void boot();
    return () => {
      cancelled = true;
    };
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [m, o] = await Promise.all([
        fetchMetrics(from, to),
        fetchOrders({ from, to, status: status || undefined, q: q || undefined, morocco_only: moroccoOnly, page }),
      ]);
      setMetrics(m);
      setOrders(o.orders);
      setTotalOrders(o.total);
      setEconForm((prev) => {
        if (econLoaded.current) return prev;
        econLoaded.current = true;
        return pickEconomics(m.economics);
      });
    } catch (e) {
      if (isAuthError(e)) {
        setReady(false);
        return;
      }
      setError(e instanceof Error ? e.message : "ما قدرناش نجيبو البيانات");
    } finally {
      setLoading(false);
    }
  }, [from, to, status, q, moroccoOnly, page]);

  useEffect(() => {
    if (ready) void load();
  }, [ready, load]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      setQ(qDraft.trim());
      setPage(1);
    }, 400);
    return () => window.clearTimeout(t);
  }, [qDraft]);

  function applyPreset(id: string) {
    const today = todayMA();
    setPreset(id);
    setTo(today);
    if (id === "today") setFrom(today);
    else if (id === "month") setFrom(monthStart(today));
    else if (id === "7") setFrom(shiftDate(today, -6));
    else if (id === "30") setFrom(shiftDate(today, -29));
    setPage(1);
  }

  async function persistEconomics() {
    setSaving(true);
    setError("");
    try {
      await saveEconomics(econForm);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "ما تحفظوش");
    } finally {
      setSaving(false);
    }
  }

  const k = metrics?.kpis;
  const live = computeOkDaba(econForm, k ?? null);
  const maxBar = useMemo(() => {
    const days = metrics?.daily || [];
    return Math.max(1, ...days.map((d) => Math.max(d.clicks, d.orders)));
  }, [metrics]);

  if (!ready) {
    return (
      <AdminLoginForm
        onSuccess={() => {
          setReady(true);
          router.replace("/admin");
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-cream text-ink">
      <header className="sticky top-0 z-30 border-b border-border bg-cream/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <BrandLogo compact />
            <div className="hidden sm:block">
              <p className="text-[10px] font-bold tracking-[0.16em] text-saffron-dark">ADMIN · COD</p>
              <p className="text-xs text-muted">إحصائيات المغرب فقط · IP صالح</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              clearToken();
              setReady(false);
            }}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-bold text-muted"
          >
            <LogOut size={14} /> خروج
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-5">
        <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-border bg-white p-3">
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => applyPreset(p.id)}
                className={clsx(
                  "rounded-full px-3 py-1.5 text-xs font-bold",
                  preset === p.id ? "bg-ink text-white" : "bg-cream text-muted hover:bg-gold-light"
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
          <label className="text-xs text-muted">
            من
            <input
              type="date"
              value={from}
              onChange={(e) => {
                setFrom(e.target.value);
                setPreset("custom");
                setPage(1);
              }}
              className="mr-2 mt-1 block rounded-lg border border-border bg-cream px-2 py-1 font-english text-sm"
            />
          </label>
          <label className="text-xs text-muted">
            إلى
            <input
              type="date"
              value={to}
              onChange={(e) => {
                setTo(e.target.value);
                setPreset("custom");
                setPage(1);
              }}
              className="mr-2 mt-1 block rounded-lg border border-border bg-cream px-2 py-1 font-english text-sm"
            />
          </label>
          <p className="mr-auto text-[11px] text-muted">الزيارات والطلبات محسوبون غير من IP مغربي.</p>
        </div>

        <nav className="mt-4 flex gap-1 rounded-2xl bg-white p-1 shadow-sm ring-1 ring-border">
          {(
            [
              ["overview", "اللوحة", BarChart3],
              ["orders", "الطلبات", Package],
            ] as const
          ).map(([id, label, Icon]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={clsx(
                "flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold",
                tab === id ? "bg-ink text-white" : "text-muted hover:bg-cream"
              )}
            >
              <Icon size={16} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </nav>

        {error ? <p className="mt-3 rounded-xl bg-rose/10 px-3 py-2 text-sm text-rose">{error}</p> : null}
        {loading && !metrics ? <p className="mt-8 text-center text-muted">كنحسبو الأرقام…</p> : null}

        {tab === "overview" ? (
          <div className="mt-5 space-y-5">
            {k && k.pending > 0 ? (
              <button
                type="button"
                onClick={() => {
                  setTab("orders");
                  setStatus("pending_confirmation");
                  setPage(1);
                }}
                className="flex w-full items-center justify-between rounded-2xl bg-rose px-4 py-3 text-right text-white"
              >
                <span className="flex items-center gap-2 text-sm font-bold">
                  <PhoneCall size={18} /> {k.pending} طلب خاصّو تأكيد
                </span>
                <span className="text-xs text-white/80">فتح الطلبات</span>
              </button>
            ) : null}

            <div className="grid items-start gap-4 lg:grid-cols-2">
              <section className="rounded-3xl border border-border bg-white p-4 md:p-5">
                <p className="text-[10px] font-bold tracking-[0.16em] text-saffron-dark">الأرقام</p>
                <h2 className="mt-1 text-xl font-extrabold">الطلبات فهاد الفترة</h2>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Kpi
                    label="Leads"
                    value={(k?.orders || 0).toLocaleString("fr-MA")}
                    hint={`${formatPct(k?.cvr || 0)} تحويل من ${(k?.clicks || 0).toLocaleString("fr-MA")} زيارة`}
                  />
                  <Kpi
                    label="AOV"
                    value={formatMad(k?.aov || 0)}
                    hint={`${formatMad(k?.gross_value || 0)} إجمالي`}
                  />
                  <Kpi
                    label="Upsell"
                    value={(k?.upsell_count || 0).toLocaleString("fr-MA")}
                    hint={`${formatPct(k?.upsell_rate || 0)} من الـ leads`}
                  />
                  <Kpi
                    label="Cross-sell"
                    value={(k?.crosssell_count || 0).toLocaleString("fr-MA")}
                    hint={`${formatPct(k?.crosssell_rate || 0)} طلبات فيها أكثر من منتج`}
                  />
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <Kpi
                    label="تأكيد"
                    value={formatPct(k?.confirmation_rate || 0)}
                    hint={`${k?.confirmed || 0} مؤكد`}
                  />
                  <Kpi
                    label="تسليم"
                    value={formatPct(k?.delivery_rate || 0)}
                    hint={`${k?.delivered || 0} تسلّم`}
                  />
                  <Kpi
                    label="إلغاء / مرجع"
                    value={`${formatPct(k?.cancel_rate || 0)} / ${formatPct(k?.return_rate || 0)}`}
                    hint={`${k?.cancelled || 0} ملغي · ${k?.returned || 0} مرجع`}
                  />
                  <Kpi
                    label="كليك"
                    value={(k?.clicks || 0).toLocaleString("fr-MA")}
                    hint={`${k?.page_views || 0} مشاهدة صفحة`}
                  />
                </div>
              </section>

              <section className="rounded-3xl border border-border bg-white p-4 md:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.16em] text-saffron-dark">الحساب</p>
                    <h2 className="mt-1 flex items-center gap-2 text-xl font-extrabold">
                      <Calculator size={18} /> Break-even
                    </h2>
                  </div>
                  <span
                    className={clsx(
                      "rounded-full px-2.5 py-1 text-[11px] font-bold",
                      live.verdict === "ok" && "bg-emerald-100 text-emerald-800",
                      live.verdict === "losing" && "bg-rose/15 text-rose",
                      live.verdict !== "ok" && live.verdict !== "losing" && "bg-cream text-muted"
                    )}
                  >
                    {live.verdict === "ok" ? "OK دابا" : live.verdict === "losing" ? "ماشي OK" : "كمّل الحساب"}
                  </span>
                </div>

                <p className="mt-3 text-xs leading-6 text-muted">
                  حط أسعار الخدمة. الحساب كيتضرب فعدد الـ leads / المسلّمين / الـ upsells ديال الفترة.
                </p>

                <div className="mt-4 space-y-2">
                  <CalcLine
                    label="Leads entered"
                    hint={`${(k?.orders || 0).toLocaleString("fr-MA")} lead`}
                    value={econForm.lead_cost_mad}
                    total={live.lead_spend - econForm.ad_spend_mad}
                    onChange={(v) => setEconForm({ ...econForm, lead_cost_mad: v })}
                  />
                  <CalcLine
                    label="Space Seller Fees"
                    hint={`${Number(live.delivered_est).toLocaleString("fr-MA")} مسلّم`}
                    value={econForm.space_seller_fee_mad}
                    total={live.space_spend}
                    onChange={(v) => setEconForm({ ...econForm, space_seller_fee_mad: v })}
                  />
                  <CalcLine
                    label="Upsell"
                    hint={`${(k?.upsell_count || 0).toLocaleString("fr-MA")} إضافة`}
                    value={econForm.upsell_cost_mad}
                    total={live.upsell_spend}
                    onChange={(v) => setEconForm({ ...econForm, upsell_cost_mad: v })}
                  />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Field
                    label="تكلفة المنتج"
                    value={econForm.product_cost_mad}
                    onChange={(v) => setEconForm({ ...econForm, product_cost_mad: v })}
                  />
                  <Field
                    label="سعر البيع / AOV"
                    value={econForm.selling_price_mad}
                    onChange={(v) => setEconForm({ ...econForm, selling_price_mad: v })}
                  />
                  <Field
                    label="تغليف"
                    value={econForm.packaging_mad}
                    onChange={(v) => setEconForm({ ...econForm, packaging_mad: v })}
                  />
                  <Field
                    label="تكلفة التوصيل"
                    value={econForm.delivery_cost_mad}
                    onChange={(v) => setEconForm({ ...econForm, delivery_cost_mad: v })}
                  />
                  <Field
                    label="تأكيد %"
                    value={econForm.assumed_confirmation_rate}
                    onChange={(v) => setEconForm({ ...econForm, assumed_confirmation_rate: v })}
                  />
                  <Field
                    label="تسليم %"
                    value={econForm.assumed_delivery_rate}
                    onChange={(v) => setEconForm({ ...econForm, assumed_delivery_rate: v })}
                  />
                </div>

                <ul className="mt-4 space-y-1.5 rounded-2xl bg-cream px-3 py-3 text-sm">
                  <SumRow label="المدخول (مسلّم)" value={formatDh(live.revenue)} />
                  <SumRow label="Leads entered" value={`− ${formatDh(live.lead_spend)}`} />
                  <SumRow label="Space Seller" value={`− ${formatDh(live.space_spend)}`} />
                  <SumRow label="Upsell" value={`− ${formatDh(live.upsell_spend)}`} />
                  <SumRow label="منتج / تغليف / توصيل" value={`− ${formatDh(live.product_spend)}`} />
                  <li className="flex items-center justify-between border-t border-border pt-2 font-extrabold text-ink">
                    <span>الربح</span>
                    <span className={clsx("tabular-nums", live.profit >= 0 ? "text-emerald-700" : "text-rose")}>
                      {formatDh(live.profit)}
                    </span>
                  </li>
                  <SumRow label="أقصى Lead entered" value={formatDh(live.break_even_lead_cost)} />
                </ul>

                <p
                  className={clsx(
                    "mt-3 rounded-2xl px-3 py-3 text-sm font-bold leading-6",
                    live.verdict === "ok" && "bg-emerald-700 text-white",
                    live.verdict === "losing" && "bg-rose text-white",
                    live.verdict !== "ok" && live.verdict !== "losing" && "bg-ink text-white"
                  )}
                >
                  {live.verdict_ar}
                </p>

                <button
                  type="button"
                  onClick={() => void persistEconomics()}
                  disabled={saving}
                  className="mt-3 w-full rounded-xl bg-ink px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"
                >
                  {saving ? "كنحفظو…" : "حفظ الحساب"}
                </button>
              </section>
            </div>

            {metrics ? (
              <>
                <section className="rounded-2xl border border-border bg-white p-4">
                  <p className="text-sm font-bold">القمع</p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-5">
                    {[
                      ["زيارات", metrics.funnel.clicks],
                      ["منتج", metrics.funnel.product_views],
                      ["سلة", metrics.funnel.add_to_cart],
                      ["تشيك أوت", metrics.funnel.checkout],
                      ["طلب", metrics.funnel.orders],
                    ].map(([label, value], i, arr) => {
                      const prev = i === 0 ? Number(value) : Number(arr[i - 1][1]);
                      const drop = prev ? Math.round((100 * Number(value)) / prev) : 0;
                      return (
                        <div key={String(label)} className="rounded-xl bg-cream px-3 py-3">
                          <p className="text-[11px] text-muted">{label}</p>
                          <p className="mt-1 text-xl font-extrabold tabular-nums">{Number(value).toLocaleString("fr-MA")}</p>
                          {i > 0 ? <p className="text-[10px] text-muted">{drop}% من اللي قبل</p> : null}
                        </div>
                      );
                    })}
                  </div>
                </section>

                <section className="rounded-2xl border border-border bg-white p-4">
                  <p className="text-sm font-bold">كليك وطلبات باليوم</p>
                  <div className="mt-4 flex h-40 items-end gap-1">
                    {metrics.daily.map((day) => (
                      <div key={day.date} className="flex min-w-0 flex-1 flex-col items-center justify-end gap-1">
                        <div className="flex h-32 w-full items-end justify-center gap-0.5">
                          <div
                            className="w-1/2 rounded-t bg-gold-light"
                            style={{ height: `${(100 * day.clicks) / maxBar}%` }}
                            title={`${day.date} · ${day.clicks} زيارة`}
                          />
                          <div
                            className="w-1/2 rounded-t bg-rose"
                            style={{ height: `${(100 * day.orders) / maxBar}%` }}
                            title={`${day.date} · ${day.orders} طلب`}
                          />
                        </div>
                        <span className="font-english text-[9px] text-muted">{day.date.slice(8)}</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 text-[11px] text-muted">ذهبي = زيارات · وردي = طلبات</p>
                </section>

                <div className="grid gap-3 lg:grid-cols-2">
                  <section className="rounded-2xl border border-border bg-white p-4">
                    <p className="text-sm font-bold">حسب الحالة</p>
                    <ul className="mt-3 space-y-2">
                      {STATUS_FLOW.map((s) => (
                        <li key={s} className="flex items-center justify-between text-sm">
                          <span className={clsx("rounded-full px-2 py-0.5 text-xs font-bold", STATUS_META[s].tone)}>
                            {STATUS_META[s].label}
                          </span>
                          <span className="tabular-nums font-bold">{metrics.status_counts[s] || 0}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                  <section className="rounded-2xl border border-border bg-white p-4">
                    <p className="text-sm font-bold">المنتجات والمصادر</p>
                    <ul className="mt-3 space-y-2">
                      {metrics.products.length === 0 ? <li className="text-sm text-muted">ما كاين حتى طلب.</li> : null}
                      {metrics.products.map((p) => (
                        <li key={p.slug} className="flex justify-between gap-3 text-sm">
                          <span>{p.name_ar || p.slug}</span>
                          <span className="tabular-nums text-muted">
                            {p.qty} علبة · {p.orders} طلب
                          </span>
                        </li>
                      ))}
                    </ul>
                    <ul className="mt-4 space-y-1 border-t border-border pt-3">
                      {metrics.sources.map((s) => (
                        <li key={s.source} className="flex justify-between text-xs text-muted">
                          <span>{s.source}</span>
                          <span>
                            {s.orders} · {formatMad(s.revenue)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>
              </>
            ) : null}
          </div>
        ) : null}

        {tab === "orders" ? (
          <div className="mt-5">
            <div className="flex flex-wrap items-center gap-2">
              <label className="relative min-w-[180px] flex-1">
                <Search className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
                <input
                  value={qDraft}
                  onChange={(e) => setQDraft(e.target.value)}
                  placeholder="بحث بالاسم، التيليفون، رقم الطلب"
                  className="w-full rounded-xl border border-border bg-white py-2.5 pr-9 pl-3 text-sm outline-none focus:border-saffron"
                />
              </label>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                className="rounded-xl border border-border bg-white px-3 py-2.5 text-sm"
              >
                <option value="">كل الحالات</option>
                {STATUS_FLOW.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_META[s].label}
                  </option>
                ))}
              </select>
              <label className="flex items-center gap-2 rounded-xl border border-border bg-white px-3 py-2.5 text-xs">
                <input type="checkbox" checked={moroccoOnly} onChange={(e) => setMoroccoOnly(e.target.checked)} />
                المغرب فقط
              </label>
            </div>

            <p className="mt-3 text-xs text-muted">{totalOrders} طلب فهاد الفترة</p>

            <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-white">
              {orders.length === 0 ? (
                <p className="px-4 py-10 text-center text-sm text-muted">ما كاين حتى طلب.</p>
              ) : (
                <ul className="divide-y divide-border">
                  {orders.map((order) => (
                    <li key={order.order_id}>
                      <button
                        type="button"
                        onClick={() => setSelected(order)}
                        className="flex w-full items-start gap-3 px-4 py-3 text-right hover:bg-cream/80"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-ink">{order.customer_name}</span>
                            <span className={clsx("rounded-full px-2 py-0.5 text-[10px] font-bold", STATUS_META[order.status].tone)}>
                              {STATUS_META[order.status].label}
                            </span>
                            {!order.is_morocco ? (
                              <span className="rounded-full bg-rose/10 px-2 py-0.5 text-[10px] text-rose">خارج المغرب</span>
                            ) : null}
                          </div>
                          <p className="mt-0.5 font-english text-xs text-muted" dir="ltr">
                            {formatPhoneDisplay(order.customer_phone)} · {order.order_id}
                          </p>
                          <p className="mt-1 truncate text-xs text-muted">
                            {order.items.map((i) => `${i.name_ar} ×${i.quantity}`).join(" · ")}
                          </p>
                        </div>
                        <div className="shrink-0 text-left">
                          <p className="font-extrabold tabular-nums text-rose">{formatMad(order.grand_total_mad)}</p>
                          <p className="mt-1 text-[11px] text-muted">{formatWhen(order.created_at)}</p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {totalOrders > 40 ? (
              <div className="mt-3 flex justify-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-lg border border-border bg-white px-3 py-1 text-sm disabled:opacity-40"
                >
                  السابق
                </button>
                <span className="py-1 text-sm text-muted">{page}</span>
                <button
                  type="button"
                  disabled={page * 40 >= totalOrders}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-lg border border-border bg-white px-3 py-1 text-sm disabled:opacity-40"
                >
                  التالي
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      {selected ? (
        <OrderPreview
          order={selected}
          onClose={() => setSelected(null)}
          onUpdated={(next) => {
            setSelected(next);
            setOrders((rows) => rows.map((row) => (row.order_id === next.order_id ? next : row)));
          }}
        />
      ) : null}

      {tab === "orders" && k?.pending ? (
        <div className="pointer-events-none fixed bottom-4 left-4 right-4 mx-auto hidden max-w-6xl justify-end sm:flex">
          <span className="pointer-events-none inline-flex items-center gap-2 rounded-full bg-ink px-3 py-1.5 text-xs text-white">
            <Truck size={14} /> COD · {k.pending} فالانتظار
          </span>
        </div>
      ) : null}
    </div>
  );
}

function formatDh(n: number): string {
  return `${n.toLocaleString("fr-MA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} dh`;
}

function pickEconomics(e: DashboardMetrics["economics"]): EconomicsInput {
  const defaults = emptyEconomicsInput();
  return {
    product_cost_mad: e.product_cost_mad ?? defaults.product_cost_mad,
    packaging_mad: e.packaging_mad ?? defaults.packaging_mad,
    delivery_cost_mad: e.delivery_cost_mad ?? defaults.delivery_cost_mad,
    return_cost_mad: e.return_cost_mad ?? defaults.return_cost_mad,
    cod_fee_pct: e.cod_fee_pct ?? defaults.cod_fee_pct,
    selling_price_mad: e.selling_price_mad ?? defaults.selling_price_mad,
    ad_spend_mad: e.ad_spend_mad ?? defaults.ad_spend_mad,
    lead_cost_mad: e.lead_cost_mad ?? defaults.lead_cost_mad,
    space_seller_fee_mad: e.space_seller_fee_mad ?? defaults.space_seller_fee_mad,
    upsell_cost_mad: e.upsell_cost_mad ?? defaults.upsell_cost_mad,
    assumed_confirmation_rate: e.assumed_confirmation_rate ?? defaults.assumed_confirmation_rate,
    assumed_delivery_rate: e.assumed_delivery_rate ?? defaults.assumed_delivery_rate,
  };
}

function Kpi({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "ok" | "bad" | "warn";
}) {
  return (
    <div
      className={clsx(
        "rounded-2xl border p-4",
        tone === "ok" && "border-emerald-200 bg-emerald-50",
        tone === "bad" && "border-rose/30 bg-rose/5",
        tone === "warn" && "border-saffron/40 bg-gold-light/40",
        tone === "default" && "border-border bg-cream"
      )}
    >
      <p className="text-[11px] font-bold text-muted">{label}</p>
      <p className="mt-1 text-2xl font-extrabold tabular-nums leading-tight">{value}</p>
      {hint ? <p className="mt-1 text-[11px] leading-5 text-muted">{hint}</p> : null}
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="text-xs text-muted">
      {label}
      <input
        type="number"
        min={0}
        step="0.01"
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="mt-1 block w-full rounded-xl border border-border bg-cream px-3 py-2 font-english text-sm text-ink outline-none focus:border-saffron"
      />
    </label>
  );
}

function CalcLine({
  label,
  hint,
  value,
  total,
  onChange,
}: {
  label: string;
  hint: string;
  value: number;
  total: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-cream/70 px-3 py-2.5">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-bold text-ink">{label}</p>
          <p className="text-[11px] text-muted">{hint}</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            step="0.01"
            value={Number.isFinite(value) ? value : 0}
            onChange={(e) => onChange(Number(e.target.value) || 0)}
            className="w-24 rounded-xl border border-border bg-white px-2 py-1.5 text-left font-english text-sm font-bold outline-none focus:border-saffron"
          />
          <span className="text-xs text-muted">dh</span>
        </div>
      </div>
      <p className="mt-1 text-left font-english text-xs font-bold tabular-nums text-ink">{formatDh(total)}</p>
    </div>
  );
}

function SumRow({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-center justify-between text-muted">
      <span>{label}</span>
      <span className="font-english tabular-nums text-ink">{value}</span>
    </li>
  );
}
