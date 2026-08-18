"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
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
  formatWhen,
  isAuthError,
  saveEconomics,
  todayMA,
} from "@/lib/adminApi";
import { formatPhoneDisplay } from "@/lib/phone";

type Tab = "overview" | "orders" | "profit";

function dh(n: number, digits = 2) {
  return `${n.toLocaleString("fr-MA", { minimumFractionDigits: digits, maximumFractionDigits: digits })} dh`;
}

function num(n: number, digits = 0) {
  return n.toLocaleString("fr-MA", { maximumFractionDigits: digits });
}

function pct(n: number) {
  return n == null ? "—" : `${n.toLocaleString("fr-MA", { maximumFractionDigits: 2 })} %`;
}

export default function AdminApp() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<Tab>("overview");
  const [from, setFrom] = useState(() => todayMA());
  const [to, setTo] = useState(() => todayMA());
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [q, setQ] = useState("");
  const [qDraft, setQDraft] = useState("");
  const [selected, setSelected] = useState<AdminOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [econForm, setEconForm] = useState<EconomicsInput>(() => emptyEconomicsInput());
  const [scaleLeads, setScaleLeads] = useState(500);
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
        fetchOrders({ from, to, status: status || undefined, q: q || undefined, morocco_only: true, page }),
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
      setError(e instanceof Error ? e.message : "تعذّر تحميل البيانات");
    } finally {
      setLoading(false);
    }
  }, [from, to, status, q, page]);

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

  async function persistEconomics() {
    setSaving(true);
    setError("");
    try {
      await saveEconomics(econForm);
    } catch (e) {
      setError(e instanceof Error ? e.message : "ما تحفظوش");
    } finally {
      setSaving(false);
    }
  }

  const k = metrics?.kpis;
  const avgPieces = k && k.orders ? k.units / k.orders : 1;
  const perLead = computeOkDaba(econForm, k ?? null, 1);
  const atScale = computeOkDaba(econForm, k ?? null, scaleLeads);
  const scaleOps = atScale.lead_spend + atScale.space_spend + atScale.upsell_spend;

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
    <div className="cod-admin">
      <div className="wrap">
        <header className="bar">
          <a className="brand-lockup" href="/" target="_blank" rel="noopener noreferrer">
            <span className="brand-logo-shell">
              <img className="brand-logo" src="/brand/logo.png" alt="سفراسكين · Safraskin" width="320" height="140" />
            </span>
            <span className="brand-text">
              <span className="brand-name-ar">سفراسكين</span>
              <span className="brand-name-en">Safraskin</span>
            </span>
            <span className="badge">لوحة التحكم</span>
          </a>
          <div className="toolbar">
            <div className="tabs">
              <button type="button" className={tab === "overview" ? "active" : ""} onClick={() => setTab("overview")}>
                نظرة عامة
              </button>
              <button type="button" className={tab === "orders" ? "active" : ""} onClick={() => setTab("orders")}>
                الطلبات
                {k?.pending ? (
                  <span className="pill ok" style={{ marginInlineStart: 6, fontSize: ".72rem" }}>
                    {k.pending}
                  </span>
                ) : null}
              </button>
              <button type="button" className={tab === "profit" ? "active" : ""} onClick={() => setTab("profit")}>
                Profit calculator
              </button>
            </div>
            <button
              type="button"
              className="ghost"
              onClick={() => {
                clearToken();
                setReady(false);
              }}
            >
              خروج
            </button>
          </div>
        </header>

        {error ? (
          <p className="panel" style={{ color: "var(--danger)", marginBottom: 14 }}>
            {error}
          </p>
        ) : null}

        {tab === "overview" ? (
          <div className="panel">
            <div className="filters">
              <label className="field">
                من
                <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
              </label>
              <label className="field">
                إلى
                <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
              </label>
              <button type="button" className="primary" onClick={() => void load()}>
                تحديث المؤشرات
              </button>
            </div>
            <div className="grid-kpi">
              <Kpi label="نقرات موثوقة (صفحات)" value={loading && !k ? "—" : num(k?.clicks || 0)} hint="عدّها السيرفر فقط من IP مغربي صالح." />
              <Kpi label="طلبات" value={num(k?.orders || 0)} hint="جميع الطلبات في النطاق الزمني." />
              <Kpi label="معدل التحويل" value={k ? pct(k.cvr) : "—"} hint="طلبات ÷ النقرات الموثوقة." />
              <Kpi label="إيرادات (د.م.)" value={num(k?.gross_value || 0)} hint="مجموع الطلبات." />
              <Kpi label="متوسط قيمة الطلب (AOV)" value={k?.orders ? `${dh(k.aov)}` : "—"} hint="إجمالي الطلب ÷ العدد — يشمل Upsell." />
              <Kpi label="متوسط القطع / طلب" value={k?.orders ? num(avgPieces, 2) : "—"} hint="قطع العرض الأساسي." />
              <Kpi label="Upsell" value={num(k?.upsell_count || 0)} hint={`${pct(k?.upsell_rate || 0)} من الطلبات قبلو العرض الإضافي.`} />
              <Kpi label="Cross-sell" value={num(k?.crosssell_count || 0)} hint={`${pct(k?.crosssell_rate || 0)} طلبات فيها أكثر من منتج.`} />
              <Kpi label="مرفقات Upsell" value={k ? pct(k.upsell_rate) : "—"} hint="نسبة الطلبات التي قبلت العرض الإضافي." />
            </div>
            <FeeChips form={econForm} />
            <footer className="note">
              الزيارات من IP مغربي فقط. Space Seller كتجمع الخدمة كاملة ما عدا تكلفة المنتج.
              {k ? ` · تأكيد ${pct(k.confirmation_rate)} · تسليم ${pct(k.delivery_rate)}` : null}
            </footer>
          </div>
        ) : null}

        {tab === "orders" ? (
          <div className="panel" style={{ marginTop: 16 }}>
            <p className="section-title" style={{ border: "none", padding: 0, marginBottom: 8 }}>
              الطلبات
            </p>
            <div className="filters">
              <label className="field">
                من
                <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
              </label>
              <label className="field">
                إلى
                <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
              </label>
              <label className="field">
                بحث
                <input value={qDraft} onChange={(e) => setQDraft(e.target.value)} placeholder="الاسم، التيليفون، رقم الطلب" />
              </label>
              <label className="field">
                الحالة
                <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid var(--border)", background: "#fdfcfc" }}>
                  <option value="">كل الحالات</option>
                  {STATUS_FLOW.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_META[s].label}
                    </option>
                  ))}
                </select>
              </label>
              <button type="button" className="primary" onClick={() => void load()}>
                تحديث القائمة
              </button>
            </div>
            <p className="note" style={{ marginTop: 0 }}>
              {totalOrders} طلب فهاد الفترة
            </p>
            <div className="table-wrap">
              <table className="data">
                <thead>
                  <tr>
                    <th>الطلب</th>
                    <th>التاريخ</th>
                    <th>العميل</th>
                    <th>الجوال</th>
                    <th>المجموع</th>
                    <th>Upsell</th>
                    <th>الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ color: "var(--muted)" }}>
                        لا توجد طلبات بعد — جرّب طلباً تجريبياً من المتجر.
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order.order_id} onClick={() => setSelected(order)} style={{ cursor: "pointer" }}>
                        <td>{order.order_id}</td>
                        <td>{formatWhen(order.created_at)}</td>
                        <td>
                          {order.customer_name}
                          {!order.is_morocco ? <span className="pill bad" style={{ marginInlineStart: 6 }}>خارج المغرب</span> : null}
                        </td>
                        <td className="mono" dir="ltr">
                          {formatPhoneDisplay(order.customer_phone)}
                        </td>
                        <td>{dh(order.grand_total_mad, 0)}</td>
                        <td>{order.upsell_accepted ? <span className="pill ok">نعم</span> : "—"}</td>
                        <td>
                          <span className="pill">{STATUS_META[order.status].label}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {totalOrders > 40 ? (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, gap: 10, flexWrap: "wrap" }}>
                <span style={{ fontSize: ".82rem", color: "var(--muted)" }}>صفحة {page}</span>
                <div style={{ display: "flex", gap: 8 }}>
                  <button type="button" className="ghost" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                    السابق
                  </button>
                  <button type="button" className="ghost" disabled={page * 40 >= totalOrders} onClick={() => setPage((p) => p + 1)}>
                    التالي
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        {tab === "profit" ? (
          <div className="panel" style={{ marginTop: 16 }}>
            <p className="section-title" style={{ border: "none", padding: 0, marginBottom: 8 }}>
              Profit calculator — Space Seller المغرب
            </p>
            <p style={{ fontSize: ".84rem", color: "var(--muted)", margin: "0 0 12px", lineHeight: 1.5 }}>
              Funnel: <strong>leads</strong> × confirmation → <strong>confirmed</strong> × delivery → <strong>delivered</strong>.
              Space Seller داخلة فيها الخدمة كاملة (Leads entered + Fees + Upsell) ما عدا <strong>تكلفة المنتج</strong>.
            </p>
            <div className="filters" style={{ marginBottom: 12 }}>
              <label className="field">
                من
                <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
              </label>
              <label className="field">
                إلى
                <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
              </label>
              <button type="button" className="primary" onClick={() => void load()}>
                تحديث من الطلبات
              </button>
            </div>
            <div className="calc-banner">
              <strong>Store data ({from} → {to}):</strong> {num(k?.orders || 0)} orders · AOV {dh(k?.aov || 0)} · avg {num(avgPieces, 2)} pcs · upsell {pct(k?.upsell_rate || 0)}
            </div>
            <FeeChips form={econForm} />

            <div className="calc-block">
              <h4>Revenue &amp; product</h4>
              <p className="hint">سعر البيع / AOV من الطلبات. تكلفة المنتج هي الحاجة الوحيدة اللي ما داخلةش فـ Space Seller.</p>
              <div className="calc-grid">
                <Field label="AOV (د.م.)" value={econForm.selling_price_mad || (k?.aov || 0)} onChange={(v) => setEconForm({ ...econForm, selling_price_mad: v })} />
                <Field label="Avg main pieces / order" value={Math.round(avgPieces * 100) / 100} onChange={() => undefined} readOnly />
                <Field label="Product cost / piece (د.م.)" value={econForm.product_cost_mad} onChange={(v) => setEconForm({ ...econForm, product_cost_mad: v })} />
              </div>
            </div>

            <div className="calc-block">
              <h4>Funnel &amp; Space Seller</h4>
              <p className="hint">Confirmation = % of leads that confirm. Delivery = % of confirmed delivered. CPL = إعلانات لكل lead (ماشي Space Seller).</p>
              <div className="calc-grid">
                <Field label="Cost per lead — CPL (د.م.)" value={econForm.cpl_mad} onChange={(v) => setEconForm({ ...econForm, cpl_mad: v })} />
                <Field label="Confirmation rate (%)" value={econForm.assumed_confirmation_rate} onChange={(v) => setEconForm({ ...econForm, assumed_confirmation_rate: v })} />
                <Field label="Delivery rate (% of confirmed)" value={econForm.assumed_delivery_rate} onChange={(v) => setEconForm({ ...econForm, assumed_delivery_rate: v })} />
                <Field label="Leads entered (د.م.)" value={econForm.lead_cost_mad} onChange={(v) => setEconForm({ ...econForm, lead_cost_mad: v })} />
                <Field label="Space Seller Fees (د.م.)" value={econForm.space_seller_fee_mad} onChange={(v) => setEconForm({ ...econForm, space_seller_fee_mad: v })} />
                <Field label="Upsell (د.م.)" value={econForm.upsell_cost_mad} onChange={(v) => setEconForm({ ...econForm, upsell_cost_mad: v })} />
              </div>
            </div>

            <div className="calc-split">
              <div className="calc-block" style={{ marginBottom: 0 }}>
                <h3 className="section-title" style={{ marginTop: 0 }}>
                  1 — Breakeven
                </h3>
                <p className="hint">Per 1 lead: max CPL before you lose money (Space Seller + product cost).</p>
                <div>
                  {perLead.verdict === "ok" ? (
                    <span className="calc-status ok">Profitable per lead — CPL {dh(econForm.cpl_mad)} vs max {dh(perLead.break_even_cpa)}</span>
                  ) : (
                    <span className="calc-status bad">Below breakeven — lower CPL or improve rates/AOV (max {dh(perLead.break_even_cpa)})</span>
                  )}
                </div>
                <button type="button" className="primary" style={{ marginTop: 12 }} onClick={() => void persistEconomics()}>
                  {saving ? "كنحفظو…" : "حفظ / Recalculate breakeven"}
                </button>
                <div className="calc-out">
                  <Out label="Order value" value={dh(perLead.selling_used)} />
                  <Out label="Max CPL (breakeven)" value={dh(perLead.break_even_cpa)} cls={perLead.break_even_cpa > 0 ? "pos" : "neg"} />
                  <Out label="Your CPL" value={dh(econForm.cpl_mad)} cls={econForm.cpl_mad <= perLead.break_even_cpa ? "pos" : "neg"} />
                  <Out label="Space Seller / lead" value={dh(perLead.lead_spend + perLead.space_spend + perLead.upsell_spend)} />
                  <Out label="Product COGS / lead" value={dh(perLead.product_spend)} />
                  <Out label="Profit / lead" value={dh(perLead.profit)} cls={perLead.profit >= 0 ? "pos" : "neg"} />
                  <Out label="Delivered / lead" value={num(perLead.delivered_est, 3)} />
                  <Out label="Cost / delivered" value={dh(perLead.cost_per_delivered)} />
                </div>
              </div>

              <div className="calc-block" style={{ marginBottom: 0 }}>
                <h3 className="section-title" style={{ marginTop: 0 }}>
                  2 — Profit at scale
                </h3>
                <p className="hint">Same assumptions × number of leads (ad spend = leads × CPL). Space Seller داخلة فيها كل الخدمة.</p>
                <label className="field" style={{ marginBottom: 12 }}>
                  Number of leads
                  <input type="number" min={0} step={1} value={scaleLeads} onChange={(e) => setScaleLeads(Number(e.target.value) || 0)} />
                </label>
                <div className="calc-out">
                  <Out label="Leads" value={num(scaleLeads)} />
                  <Out label="Delivered (est.)" value={num(atScale.delivered_est, 1)} />
                  <Out label="Revenue (COD)" value={dh(atScale.revenue)} cls="pos" />
                  <Out label="Ad spend (leads × CPL)" value={dh(scaleLeads * econForm.cpl_mad)} />
                  <Out label="Space Seller (الكل)" value={dh(scaleOps)} />
                  <Out label="— Leads entered" value={dh(atScale.lead_spend)} />
                  <Out label="— Space Seller Fees" value={dh(atScale.space_spend)} />
                  <Out label="— Upsell" value={dh(atScale.upsell_spend)} />
                  <Out label="Product COGS" value={dh(atScale.product_spend)} />
                  <Out label="Total cost" value={dh(scaleLeads * econForm.cpl_mad + scaleOps + atScale.product_spend)} />
                  <Out label="Net profit" value={dh(atScale.profit)} cls={atScale.profit >= 0 ? "pos" : "neg"} />
                  <Out label="Profit / delivered" value={atScale.margin_per_order == null ? "—" : dh(atScale.margin_per_order)} cls={(atScale.margin_per_order || 0) >= 0 ? "pos" : "neg"} />
                </div>
              </div>
            </div>
            <footer className="note" style={{ marginTop: 18 }}>
              Space Seller = Leads entered {dh(econForm.lead_cost_mad)} لكل lead + Fees {dh(econForm.space_seller_fee_mad)} لكل مسلّم + Upsell {dh(econForm.upsell_cost_mad)} لكل إضافة.
              المنتج محسوب وحدو. COGS = confirmed × avg pieces × product cost.
            </footer>
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
    </div>
  );
}

function FeeChips({ form }: { form: EconomicsInput }) {
  return (
    <div className="calc-fees" aria-label="Space Seller fees">
      <span>
        Leads entered <b>{dh(form.lead_cost_mad)}</b>
      </span>
      <span>
        Space Seller Fees <b>{dh(form.space_seller_fee_mad)}</b>
      </span>
      <span>
        Upsell <b>{dh(form.upsell_cost_mad)}</b>
      </span>
      <span>
        الخدمة كاملة ما عدا المنتج
      </span>
    </div>
  );
}

function Kpi({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="kpi">
      <div className="label">{label}</div>
      <div className="value">{value}</div>
      {hint ? <div className="hint">{hint}</div> : null}
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
    <label className="field">
      {label}
      <input
        type="number"
        min={0}
        step="0.01"
        readOnly={readOnly}
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
      />
    </label>
  );
}

function Out({ label, value, cls }: { label: string; value: string; cls?: string }) {
  return (
    <div className={`out${cls ? ` ${cls}` : ""}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function pickEconomics(e: DashboardMetrics["economics"]): EconomicsInput {
  const defaults = emptyEconomicsInput();
  return {
    product_cost_mad: e.product_cost_mad ?? defaults.product_cost_mad,
    packaging_mad: 0,
    delivery_cost_mad: 0,
    return_cost_mad: 0,
    cod_fee_pct: 0,
    selling_price_mad: e.selling_price_mad ?? defaults.selling_price_mad,
    ad_spend_mad: 0,
    lead_cost_mad: e.lead_cost_mad ?? defaults.lead_cost_mad,
    space_seller_fee_mad: e.space_seller_fee_mad ?? defaults.space_seller_fee_mad,
    upsell_cost_mad: e.upsell_cost_mad ?? defaults.upsell_cost_mad,
    cpl_mad: e.cpl_mad ?? defaults.cpl_mad,
    assumed_confirmation_rate: e.assumed_confirmation_rate ?? defaults.assumed_confirmation_rate,
    assumed_delivery_rate: e.assumed_delivery_rate ?? defaults.assumed_delivery_rate,
  };
}
