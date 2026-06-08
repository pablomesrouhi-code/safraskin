"use client";

import type { Metrics } from "@/lib/adminApi";

export default function LeadFunnel({ funnel }: { funnel: Metrics["funnel"] }) {
  const steps = [
    { label: "بدء الدفع", value: funnel.checkout_starts, pct: 100 },
    { label: "Leads (طلبات)", value: funnel.leads_valid, pct: funnel.checkout_starts ? (funnel.leads_valid / funnel.checkout_starts) * 100 : 0 },
    { label: "مؤكد", value: funnel.confirmed + funnel.shipped + funnel.delivered, pct: funnel.leads_valid ? ((funnel.confirmed + funnel.shipped + funnel.delivered) / funnel.leads_valid) * 100 : 0 },
    { label: "مُسلّم", value: funnel.delivered, pct: funnel.leads_valid ? (funnel.delivered / funnel.leads_valid) * 100 : 0 },
  ];

  return (
    <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
      <h2 className="font-semibold mb-4">قمع الـ Leads</h2>
      <div className="space-y-3">
        {steps.map((s) => (
          <div key={s.label}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-700">{s.label}</span>
              <span className="font-medium">
                {s.value}
                <span className="text-gray-400 text-xs mr-1">({s.pct.toFixed(1)}%)</span>
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-sage rounded-full transition-all"
                style={{ width: `${Math.min(s.pct, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-4">
        {funnel.leads_total - funnel.leads_valid} lead خارج KSA/VPN · {funnel.returned} رجوع/ملغي
      </p>
    </div>
  );
}
