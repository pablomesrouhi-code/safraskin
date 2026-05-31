import { TIER_PRICES } from "@/data/products";

export function getTierTotal(uniqueCount: number): number {
  if (uniqueCount <= 0) return 0;
  if (uniqueCount === 1) return TIER_PRICES[1];
  if (uniqueCount === 2) return TIER_PRICES[2];
  return TIER_PRICES[3];
}

export function getSavings(uniqueCount: number): number {
  const fullPrice = uniqueCount * TIER_PRICES[1];
  return fullPrice - getTierTotal(uniqueCount);
}
