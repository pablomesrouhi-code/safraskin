export type ProfitCosts = {
  confirmed_lead_usd: number;
  delivered_order_usd: number;
  return_usd: number;
  warehouse_fulfill_usd: number;
  sar_usd_rate: number;
};

export type OrderCounts = {
  delivered_revenue_sar: number;
  delivered_count: number;
  confirmed_count: number;
  warehouse_count: number;
  return_count: number;
};

export const DEFAULT_PROFIT_COSTS: ProfitCosts = {
  confirmed_lead_usd: 1.7,
  delivered_order_usd: 4.0,
  return_usd: 1.3,
  warehouse_fulfill_usd: 0.8,
  sar_usd_rate: 3.75,
};

const STORAGE_KEY = "safra_profit_costs";

export function loadProfitCosts(): ProfitCosts {
  if (typeof window === "undefined") return { ...DEFAULT_PROFIT_COSTS };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROFIT_COSTS };
    return { ...DEFAULT_PROFIT_COSTS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_PROFIT_COSTS };
  }
}

export function saveProfitCosts(costs: ProfitCosts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(costs));
}

export function calcProfit(counts: OrderCounts, costs: ProfitCosts) {
  const costConfirmed = counts.confirmed_count * costs.confirmed_lead_usd;
  const costWarehouse = counts.warehouse_count * costs.warehouse_fulfill_usd;
  const costDelivered = counts.delivered_count * costs.delivered_order_usd;
  const costReturns = counts.return_count * costs.return_usd;
  const totalCosts = costConfirmed + costWarehouse + costDelivered + costReturns;
  const revenueUsd = counts.delivered_revenue_sar / costs.sar_usd_rate;
  const netProfitUsd = revenueUsd - totalCosts;
  const aovDelivered =
    counts.delivered_count > 0
      ? counts.delivered_revenue_sar / counts.delivered_count
      : 0;

  return {
    costConfirmed,
    costWarehouse,
    costDelivered,
    costReturns,
    totalCosts,
    revenueUsd,
    netProfitUsd,
    netProfitSar: netProfitUsd * costs.sar_usd_rate,
    margin: revenueUsd ? (netProfitUsd / revenueUsd) * 100 : 0,
    perDelivered: counts.delivered_count ? netProfitUsd / counts.delivered_count : 0,
    aovDelivered,
  };
}
