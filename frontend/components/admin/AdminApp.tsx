"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { LogOut, Search } from "lucide-react";
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

type Tab = "leads" | "breakeven" | "orders";

const PRESETS = [
  { id: "today", label: "اليوم" },
  { id: "7", label: "7 أيام" },
  { id: "30", label: "30 يوم" },
  { id: "month", label: "هذا الشهر" },
] as const;

function monthStart(iso: string): string {
  return `${iso.slice(0, 7)}-01`;
}

export default function AdminApp() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<Tab>("leads");
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
  const [scaleLeads, setScaleLeads] = useState(100);
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
      if (m.kpis.orders > 0) setScaleLeads((n) => (n === 100 ? m.kpis.orders : n));
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
  const perLead = computeOkDaba(econForm, k ?? null, 1);
  const atScale = computeOkDaba(econForm, k ?? null, scaleLeads);
  const avgPieces = k && k.orders ? Math.round((k.units / k.orders) * 100) / 100 : 0;

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
    <div className="min-h-screen bg-[#f4f1ef] text-ink">
      <div className="mx-auto max-w-[1180px] px-4 py-6 md:px-5">
        <header className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-white/90 px-4 py-3 shadow-sm backdrop-blur">
          <div className="flex min-w-0 items-center gap-3">
            <BrandLogo compact />
            <span className="rounded-full border border-rose/25 bg-rose/10 px-2.5 py-1 text-[11px] font-bold text-rose">
              لوحة التحكم
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <nav className="flex flex-wrap gap-1.5">
              {(
                [
                  ["leads", "نظرة عامة"],
                  ["orders", "الطلبات"],
                  ["breakeven", "Profit calculator"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id)}
                  className={clsx(
                    "rounded-full border px-4 py-2 text-sm font-bold shadow-sm transition",
                    tab === id
                      ? "border-rose bg-gradient-to-l from-rose/10 to-gold-light/60 text-rose"
                      : "border-border bg-white text-ink hover:border-rose/40"
                  )}
                >
                  {label}
                  {id === "orders" && k?.pending ? (
                    <span className="mr-1.5 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] text-emerald-800">
                      {k.pending}
                    </span>
                  ) : null}
                </button>
              ))}
            </nav>
            <button
              type="button"
              onClick={() => {
                clearToken();
                setReady(false);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3 py-2 text-xs font-bold text-muted hover:border-rose hover:text-rose"
            >
              <LogOut size={14} /> خروج
            </button>
          </div>
        </header>

        {error ? <p className="mb-3 rounded-xl bg-rose/10 px-3 py-2 text-sm text-rose">{error}</p> : null}
        {loading && !metrics ? <p className="py-10 text-center text-muted">كنحسبو الأرقام…</p> : null}

        {tab === "leads" ? (
          <Panel>
            <DateBar from={from} to={to} preset={preset} onFrom={setFrom} onTo={setTo} onPreset={applyPreset} onCustom={() => { setPreset("custom"); setPage(1); }} />
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
              <Kpi label="نقرات موثوقة (المغرب)" value={(k?.clicks || 0).toLocaleString("fr-MA")} hint="زيارات من IP مغربي صالح فقط." />
              <Kpi label="Leads / طلبات" value={(k?.orders || 0).toLocaleString("fr-MA")} hint="جميع الطلبات في النطاق الزمني." />
              <Kpi label="معدل التحويل" value={formatPct(k?.cvr || 0)} hint="طلبات ÷ النقرات الموثوقة." />
              <Kpi label="إيرادات (د.م.)" value={formatMad(k?.gross_value || 0)} hint="مجموع الطلبات." />
              <Kpi label="متوسط قيمة الطلب (AOV)" value={formatMad(k?.aov || 0)} hint="إجمالي الطلب ÷ العدد — يشمل Upsell." />
              <Kpi label="متوسط القطع / طلب" value={avgPieces ? avgPieces.toLocaleString("fr-MA") : "—"} hint="قطع العرض الأساسي." />
              <Kpi label="Upsell" value={(k?.upsell_count || 0).toLocaleString("fr-MA")} hint={`${formatPct(k?.upsell_rate || 0)} من الـ leads قبلو العرض الإضافي.`} />
              <Kpi label="Cross-sell" value={(k?.crosssell_count || 0).toLocaleString("fr-MA")} hint={`${formatPct(k?.crosssell_rate || 0)} طلبات فيها أكثر من منتج.`} />
              <Kpi label="تأكيد" value={formatPct(k?.confirmation_rate || 0)} hint={`${k?.confirmed || 0} مؤكد.`} />
              <Kpi label="تسليم" value={formatPct(k?.delivery_rate || 0)} hint={`${k?.delivered || 0} تسلّم.`} />
            </div>
            <FeeChips form={econForm} />
            <p className="mt-3 text-[12px] leading-6 text-muted">
              الزيارات والطلبات محسوبون غير من IP مغربي. Funnel: leads × تأكيد → مؤكد × تسليم → مسلّم.
            </p>
          </Panel>
        ) : null}

        {tab === "breakeven" ? (
          <Panel>
            <p className="text-[1.05rem] font-extrabold text-rose">Profit calculator — Space Seller المغرب</p>
            <p className="mt-1 text-[13px] leading-6 text-muted">
              Funnel: <strong>leads</strong> × confirmation → <strong>confirmed</strong> × delivery → <strong>delivered</strong>.
              الرسوم: Leads entered + Space Seller Fees + Upsell بالدرهم.
            </p>
            <DateBar from={from} to={to} preset={preset} onFrom={setFrom} onTo={setTo} onPreset={applyPreset} onCustom={() => { setPreset("custom"); setPage(1); }} />
            <div className="mt-4 rounded-xl border border-rose/20 bg-gradient-to-l from-white to-rose/5 px-3 py-3 text-[13px] leading-6">
              <strong>Store data ({from} → {to}):</strong> {(k?.orders || 0).toLocaleString("fr-MA")} leads · AOV {formatDh(k?.aov || 0)} ·
              تأكيد {formatPct(live.confirmation_used)} · تسليم {formatPct(live.delivery_used)} · upsell {(k?.upsell_count || 0).toLocaleString("fr-MA")}
            </div>
            <FeeChips form={econForm} />

            <div className="mt-4 rounded-xl border border-border bg-[#faf8f7] p-4">
              <h4 className="text-sm font-extrabold text-rose">Revenue & product</h4>
              <p className="mt-1 text-[12px] text-muted">AOV من الطلبات الحقيقية إلا ما حطيتيش سعر البيع.</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <Field label="AOV (د.م.)" value={econForm.selling_price_mad || (k?.aov || 0)} onChange={(v) => setEconForm({ ...econForm, selling_price_mad: v })} />
                <Field label="تكلفة المنتج / علبة" value={econForm.product_cost_mad} onChange={(v) => setEconForm({ ...econForm, product_cost_mad: v })} />
                <Field label="تغليف" value={econForm.packaging_mad} onChange={(v) => setEconForm({ ...econForm, packaging_mad: v })} />
                <Field label="تكلفة التوصيل" value={econForm.delivery_cost_mad} onChange={(v) => setEconForm({ ...econForm, delivery_cost_mad: v })} />
                <Field label="تكلفة المرجع" value={econForm.return_cost_mad} onChange={(v) => setEconForm({ ...econForm, return_cost_mad: v })} />
                <Field label="متوسط القطع / طلب" value={avgPieces} onChange={() => undefined} readOnly />
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-border bg-[#faf8f7] p-4">
              <h4 className="text-sm font-extrabold text-rose">Funnel & service fees</h4>
              <p className="mt-1 text-[12px] text-muted">Confirmation = % ديال الـ leads اللي كيتأكدو. Delivery = % ديال المؤكدين اللي كيتسلمو.</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <Field label="Leads entered (د.م.)" value={econForm.lead_cost_mad} onChange={(v) => setEconForm({ ...econForm, lead_cost_mad: v })} />
                <Field label="Space Seller Fees (د.م.)" value={econForm.space_seller_fee_mad} onChange={(v) => setEconForm({ ...econForm, space_seller_fee_mad: v })} />
                <Field label="Upsell (د.م.)" value={econForm.upsell_cost_mad} onChange={(v) => setEconForm({ ...econForm, upsell_cost_mad: v })} />
                <Field label="Confirmation rate (%)" value={econForm.assumed_confirmation_rate} onChange={(v) => setEconForm({ ...econForm, assumed_confirmation_rate: v })} />
                <Field label="Delivery rate (% of confirmed)" value={econForm.assumed_delivery_rate} onChange={(v) => setEconForm({ ...econForm, assumed_delivery_rate: v })} />
              </div>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-border bg-[#faf8f7] p-4">
                <h3 className="text-sm font-extrabold text-rose">1 — Breakeven</h3>
                <p className="mt-1 text-[12px] leading-5 text-muted">لكل lead واحد: أقصى Leads entered قبل ما تخسر.</p>
                <span
                  className={clsx(
                    "mt-3 inline-block rounded-full px-3 py-1 text-[12px] font-bold",
                    perLead.verdict === "ok" ? "bg-emerald-100 text-emerald-800" : "bg-rose/10 text-rose"
                  )}
                >
                  {perLead.verdict === "ok"
                    ? `Profitable per lead — ${formatDh(econForm.lead_cost_mad)} vs max ${formatDh(perLead.break_even_lead_cost)}`
                    : `Below breakeven — max ${formatDh(perLead.break_even_lead_cost)}`}
                </span>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Out label="AOV" value={formatDh(perLead.selling_used)} />
                  <Out label="Max Lead entered" value={formatDh(perLead.break_even_lead_cost)} pos={perLead.break_even_lead_cost > 0} />
                  <Out label="Your Lead entered" value={formatDh(econForm.lead_cost_mad)} pos={econForm.lead_cost_mad <= perLead.break_even_lead_cost} />
                  <Out label="Profit / lead" value={formatDh(perLead.profit)} pos={perLead.profit >= 0} />
                  <Out label="Space Seller / lead" value={formatDh(perLead.space_spend)} />
                  <Out label="Upsell fee / lead" value={formatDh(perLead.upsell_spend)} />
                  <Out label="Delivered / lead" value={perLead.delivered_est.toLocaleString("fr-MA", { maximumFractionDigits: 3 })} />
                  <Out label="Cost / delivered" value={formatDh(perLead.cost_per_delivered)} />
                </div>
              </div>

              <div className="rounded-xl border border-border bg-[#faf8f7] p-4">
                <h3 className="text-sm font-extrabold text-rose">2 — Profit at scale</h3>
                <p className="mt-1 text-[12px] leading-5 text-muted">نفس الفرضيات × عدد الـ leads (التكلفة = leads × Leads entered).</p>
                <Field label="Number of leads" value={scaleLeads} onChange={setScaleLeads} />
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Out label="Leads" value={scaleLeads.toLocaleString("fr-MA")} />
                  <Out label="Delivered (est.)" value={atScale.delivered_est.toLocaleString("fr-MA", { maximumFractionDigits: 1 })} />
                  <Out label="Revenue (COD)" value={formatDh(atScale.revenue)} pos />
                  <Out label="Leads entered spend" value={formatDh(atScale.lead_spend)} />
                  <Out label="Space Seller Fees" value={formatDh(atScale.space_spend)} />
                  <Out label="Upsell fees" value={formatDh(atScale.upsell_spend)} />
                  <Out label="Product / pack / delivery" value={formatDh(atScale.product_spend)} />
                  <Out label="Total cost" value={formatDh(atScale.lead_spend + atScale.space_spend + atScale.upsell_spend + atScale.product_spend)} />
                  <Out label="Net profit" value={formatDh(atScale.profit)} pos={atScale.profit >= 0} />
                  <Out label="Profit / delivered" value={atScale.margin_per_order == null ? "—" : formatDh(atScale.margin_per_order)} pos={(atScale.margin_per_order || 0) >= 0} />
                </div>
              </div>
            </div>

            <p
              className={clsx(
                "mt-4 rounded-xl px-3 py-3 text-sm font-bold leading-6",
                live.verdict === "ok" ? "bg-emerald-700 text-white" : live.verdict === "losing" ? "bg-rose text-white" : "bg-ink text-white"
              )}
            >
              {live.verdict_ar}
            </p>
            <button
              type="button"
              onClick={() => void persistEconomics()}
              disabled={saving}
              className="mt-3 rounded-xl bg-ink px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60"
            >
              {saving ? "كنحفظو…" : "حفظ الحساب"}
            </button>
            <p className="mt-3 text-[12px] leading-6 text-muted">
              Leads entered كيتخلص على كل lead. Space Seller Fees على كل مسلّم. Upsell على كل إضافة.
            </p>
          </Panel>
        ) : null}

        {tab === "orders" ? (
          <Panel>
            <p className="text-[1.05rem] font-extrabold text-rose">آخر الطلبات</p>
            <div className="mt-3 flex flex-wrap items-end gap-2">
              <label className="relative min-w-[180px] flex-1">
                <Search className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
                <input
                  value={qDraft}
                  onChange={(e) => setQDraft(e.target.value)}
                  placeholder="بحث بالاسم، التيليفون، رقم الطلب"
                  className="w-full rounded-[10px] border border-border bg-[#fdfcfc] py-2.5 pr-9 pl-3 text-sm outline-none focus:border-rose"
                />
              </label>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                className="rounded-[10px] border border-border bg-[#fdfcfc] px-3 py-2.5 text-sm"
              >
                <option value="">كل الحالات</option>
                {STATUS_FLOW.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_META[s].label}
                  </option>
                ))}
              </select>
              <label className="flex items-center gap-2 rounded-[10px] border border-border bg-[#fdfcfc] px-3 py-2.5 text-xs">
                <input type="checkbox" checked={moroccoOnly} onChange={(e) => setMoroccoOnly(e.target.checked)} />
                المغرب فقط
              </label>
            </div>
            <p className="mt-3 text-[12px] text-muted">{totalOrders} طلب فهاد الفترة</p>
            <div className="mt-3 overflow-auto rounded-xl border border-border bg-[#fdfcfc]">
              <table className="w-full text-right text-[13px]">
                <thead>
                  <tr className="sticky top-0 bg-[#faf8f7] text-[12px] font-bold text-muted">
                    <th className="px-3 py-3">الطلب</th>
                    <th className="px-3 py-3">التاريخ</th>
                    <th className="px-3 py-3">العميل</th>
                    <th className="px-3 py-3">الجوال</th>
                    <th className="px-3 py-3">المجموع</th>
                    <th className="px-3 py-3">Upsell</th>
                    <th className="px-3 py-3">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-3 py-10 text-center text-muted">
                        ما كاين حتى طلب.
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr
                        key={order.order_id}
                        className="cursor-pointer border-t border-border hover:bg-gold-light/40"
                        onClick={() => setSelected(order)}
                      >
                        <td className="px-3 py-3 font-english font-bold">{order.order_id}</td>
                        <td className="px-3 py-3 text-muted">{formatWhen(order.created_at)}</td>
                        <td className="px-3 py-3 font-bold">
                          {order.customer_name}
                          {!order.is_morocco ? <span className="mr-1 text-[10px] text-rose"> · خارج المغرب</span> : null}
                        </td>
                        <td className="px-3 py-3 font-english" dir="ltr">
                          {formatPhoneDisplay(order.customer_phone)}
                        </td>
                        <td className="px-3 py-3 font-extrabold tabular-nums text-rose">{formatMad(order.grand_total_mad)}</td>
                        <td className="px-3 py-3">
                          {order.upsell_accepted ? <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">نعم</span> : <span className="text-muted">—</span>}
                        </td>
                        <td className="px-3 py-3">
                          <span className={clsx("rounded-full px-2 py-0.5 text-[11px] font-bold", STATUS_META[order.status].tone)}>
                            {STATUS_META[order.status].label}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {totalOrders > 40 ? (
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-muted">صفحة {page}</span>
                <div className="flex gap-2">
                  <button type="button" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="rounded-xl border border-border bg-white px-3 py-1 disabled:opacity-40">
                    السابق
                  </button>
                  <button type="button" disabled={page * 40 >= totalOrders} onClick={() => setPage((p) => p + 1)} className="rounded-xl border border-border bg-white px-3 py-1 disabled:opacity-40">
                    التالي
                  </button>
                </div>
              </div>
            ) : null}
          </Panel>
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
    </div>
  );
}

function Panel({ children }: { children: ReactNode }) {
  return (
    <section className="relative overflow-hidden rounded-[14px] border border-border bg-white p-5 shadow-[0_8px_32px_rgba(28,28,28,0.06)]">
      <span className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-l from-rose via-saffron to-rose" />
      {children}
    </section>
  );
}

function DateBar({
  from,
  to,
  preset,
  onFrom,
  onTo,
  onPreset,
  onCustom,
}: {
  from: string;
  to: string;
  preset: string;
  onFrom: (v: string) => void;
  onTo: (v: string) => void;
  onPreset: (id: string) => void;
  onCustom: () => void;
}) {
  return (
    <div className="mb-1 flex flex-wrap items-end gap-3">
      <div className="flex flex-wrap gap-1.5">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onPreset(p.id)}
            className={clsx(
              "rounded-full px-3 py-1.5 text-xs font-bold",
              preset === p.id ? "bg-ink text-white" : "bg-[#faf8f7] text-muted hover:bg-gold-light"
            )}
          >
            {p.label}
          </button>
        ))}
      </div>
      <label className="text-[13px] text-muted">
        من
        <input
          type="date"
          value={from}
          onChange={(e) => {
            onFrom(e.target.value);
            onCustom();
          }}
          className="mt-1 block min-w-[160px] rounded-[10px] border border-border bg-[#fdfcfc] px-3 py-2 font-english text-sm"
        />
      </label>
      <label className="text-[13px] text-muted">
        إلى
        <input
          type="date"
          value={to}
          onChange={(e) => {
            onTo(e.target.value);
            onCustom();
          }}
          className="mt-1 block min-w-[160px] rounded-[10px] border border-border bg-[#fdfcfc] px-3 py-2 font-english text-sm"
        />
      </label>
    </div>
  );
}

function FeeChips({ form }: { form: EconomicsInput }) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <span className="rounded-full border border-border bg-white px-3 py-1.5 text-[12px] text-muted">
        Leads entered <b className="text-ink">{formatDh(form.lead_cost_mad)}</b>
      </span>
      <span className="rounded-full border border-border bg-white px-3 py-1.5 text-[12px] text-muted">
        Space Seller Fees <b className="text-ink">{formatDh(form.space_seller_fee_mad)}</b>
      </span>
      <span className="rounded-full border border-border bg-white px-3 py-1.5 text-[12px] text-muted">
        Upsell <b className="text-ink">{formatDh(form.upsell_cost_mad)}</b>
      </span>
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

function Kpi({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-[14px] border border-border border-l-[3px] border-l-rose bg-gradient-to-b from-white to-[#faf8f7] p-4 shadow-sm">
      <p className="text-[12px] font-bold text-muted">{label}</p>
      <p className="mt-1 text-[1.45rem] font-extrabold tabular-nums leading-tight text-rose">{value}</p>
      {hint ? <p className="mt-2 text-[11px] leading-5 text-muted">{hint}</p> : null}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  readOnly,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  readOnly?: boolean;
}) {
  return (
    <label className="text-[13px] text-muted">
      {label}
      <input
        type="number"
        min={0}
        step="0.01"
        readOnly={readOnly}
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className={clsx(
          "mt-1 block w-full rounded-[10px] border border-border px-3 py-2 font-english text-sm text-ink outline-none focus:border-rose",
          readOnly ? "bg-[#f0eeec] text-muted" : "bg-[#fdfcfc]"
        )}
      />
    </label>
  );
}

function Out({ label, value, pos }: { label: string; value: string; pos?: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-white p-3">
      <p className="text-[11px] text-muted">{label}</p>
      <p className={clsx("mt-1 text-[1.05rem] font-extrabold tabular-nums", pos === false ? "text-rose" : pos ? "text-emerald-700" : "text-ink")}>
        {value}
      </p>
    </div>
  );
}
