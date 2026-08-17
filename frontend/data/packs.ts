import type { ProductSlug } from "@/data/products";

export type PackId = "pack-4" | "pack-3";

export type Pack = {
  id: PackId;
  sku: string;
  title: string;
  subtitle: string;
  slugs: ProductSlug[];
  price: number;
};

export const PACKS: Record<PackId, Pack> = {
  "pack-4": {
    id: "pack-4",
    sku: "SK618204P4",
    title: "الروتين الكامل",
    subtitle: "لللي كتقلّقها أكثر من حاجة: الوجه، الشعر، الكولاجين، والمناطق الأنثوية.",
    slugs: ["clarelia", "femmelia", "capilys", "luminora"],
    price: 699,
  },
  "pack-3": {
    id: "pack-3",
    sku: "SK275839P3",
    title: "روتين الوجه والشعر",
    subtitle: "تفتيح + تساقط + كولاجين بحري — بلا كبسول المناطق الأنثوية.",
    slugs: ["clarelia", "capilys", "luminora"],
    price: 549,
  },
};

export const PACK_LIST = [PACKS["pack-4"], PACKS["pack-3"]];

export function isPackId(slug: string): slug is PackId {
  return slug === "pack-4" || slug === "pack-3";
}

export function getPack(slug: string): Pack | undefined {
  if (!isPackId(slug)) return undefined;
  return PACKS[slug];
}

export const PACK_SKUS: Record<string, PackId> = {
  [PACKS["pack-4"].sku]: "pack-4",
  [PACKS["pack-3"].sku]: "pack-3",
};
