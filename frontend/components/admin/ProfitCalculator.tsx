"use client";

import { useEffect, useMemo, useState } from "react";
import type { Metrics } from "@/lib/adminApi";
import {
  calcProfit,
  loadProfitCosts,
  saveProfitCosts,
  type ProfitCosts,
} from "@/lib/profitCalc";

function CostInput({
  label,
  value,
  count,
  onChange,
}: {
  label: string;
  value: number;
  count: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs text-gray-500">{label}</span>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-gray-400 text-sm">$</span>
        <input
          type="number"
          step="0.01"
          min="0"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="w-full border border-border rounded-lg px-3 py-2 text-sm"
        />
        <span className="text-xs text-gray-400 whitespace-nowrap">× {count}</span>
      </div>
    </label>
  );
}

export default function ProfitCalculator({ metrics }: { metrics: Metrics }) {
  const { order_counts: counts, funnel } = metrics;
  const [costs, setCosts] = useState<ProfitCosts>(() => loadProfitCosts());

  useEffect(() => {
    saveProfitCosts(costs);
  }, [costs]);

  const result = useMemo(() => calcProfit(counts, costs), [counts, costs]);

  const setCost = (key: keyof ProfitCosts, val: number) =>
    setCosts((c) => ({ ...c, [key]: val }));

  return (
    <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">حاسبة الربح COD</h2>
          <p className="text-sm text-gray-500">
            التكاليف تُحفظ في المتصفح · الإيراد من المُسلّم فقط
          </p>
        </div>
        <div className="text-left">
          <p
            className={`text-3xl font-bold tabular-nums ${
              result.netProfitUsd >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            ${result.netProfitUsd.toFixed(2)}
          </p>
          <p className="text-sm text-gray-500">{result.netProfitSar.toFixed(0)} ر.س صافي</p>
          <p className="text-xs text-gray-400">هامش {result.margin.toFixed(1)}%</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">تكلفة لكل وحدة</h3>
          <CostInput
            label="Confirmed lead"
            value={costs.confirmed_lead_usd}
            count={counts.confirmed_count}
            onChange={(v) => setCost("confirmed_lead_usd", v)}
          />
          <CostInput
            label="Warehouse fulfill"
            value={costs.warehouse_fulfill_usd}
            count={counts.warehouse_count}
            onChange={(v) => setCost("warehouse_fulfill_usd", v)}
          />
          <CostInput
            label="Delivered order"
            value={costs.delivered_order_usd}
            count={counts.delivered_count}
            onChange={(v) => setCost("delivered_order_usd", v)}
          />
          <CostInput
            label="Return"
            value={costs.return_usd}
            count={counts.return_count}
            onChange={(v) => setCost("return_usd", v)}
          />
          <label className="block">
            <span className="text-xs text-gray-500">سعر الصرف ر.س → $</span>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={costs.sar_usd_rate}
              onChange={(e) => setCost("sar_usd_rate", parseFloat(e.target.value) || 3.75)}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm mt-1"
            />
          </label>
        </div>

        <div className="space-y-3 text-sm">
          <h3 className="font-semibold text-gray-700">تفصيل التكاليف</h3>
          <Row label="Confirmed leads" value={`$${result.costConfirmed.toFixed(2)}`} sub={`${counts.confirmed_count} مؤكد`} />
          <Row label="Warehouse" value={`$${result.costWarehouse.toFixed(2)}`} sub={`${counts.warehouse_count} شحن`} />
          <Row label="Delivered" value={`$${result.costDelivered.toFixed(2)}`} sub={`${counts.delivered_count} تسليم`} />
          <Row label="Returns" value={`$${result.costReturns.toFixed(2)}`} sub={`${counts.return_count} رجوع`} />
          <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold">
            <span>إجمالي التكاليف</span>
            <span className="text-red-600">${result.totalCosts.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>إيرادات مُسلّمة</span>
            <span>
              {counts.delivered_revenue_sar} ر.س
              <span className="text-gray-400 text-xs mr-1">(${result.revenueUsd.toFixed(2)})</span>
            </span>
          </div>
          <div className="flex justify-between font-semibold text-green-700">
            <span>ربح / طلب مُسلّم</span>
            <span>${result.perDelivered.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>AOV (مُسلّم)</span>
            <span>{result.aovDelivered.toFixed(0)} ر.س</span>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100 grid grid-cols-2 md:grid-cols-5 gap-3 text-center text-xs">
        <FunnelChip label="Leads" value={funnel.leads_valid} sub={`${funnel.leads_total} كلي`} />
        <FunnelChip label="Pending" value={funnel.pending_confirmation} />
        <FunnelChip label="Confirmed" value={funnel.confirmed} />
        <FunnelChip label="Delivered" value={funnel.delivered} color="green" />
        <FunnelChip label="Returns" value={funnel.returned} color="amber" />
      </div>
    </div>
  );
}

function Row({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-600">
        {label}
        {sub && <span className="text-gray-400 text-xs mr-1">({sub})</span>}
      </span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  );
}

function FunnelChip({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: number;
  sub?: string;
  color?: "green" | "amber";
}) {
  return (
    <div className="bg-gray-50 rounded-xl py-2 px-1">
      <p className="text-gray-500">{label}</p>
      <p
        className={`text-lg font-bold ${
          color === "green" ? "text-green-600" : color === "amber" ? "text-amber-600" : "text-gray-900"
        }`}
      >
        {value}
      </p>
      {sub && <p className="text-gray-400">{sub}</p>}
    </div>
  );
}
