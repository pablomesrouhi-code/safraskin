import type { Product } from "@/data/products";

export default function ComparisonTable({ product }: { product: Product }) {
  return (
    <section className="mx-auto max-w-container px-4 py-14">
      <h2 className="text-2xl font-bold">علاش هاد الاختيار؟</h2>
      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-white">
        <div className="grid grid-cols-3 bg-ink text-xs font-semibold text-cream">
          <span className="p-3"> </span>
          <span className="p-3">العادي فالسوق</span>
          <span className="p-3">سفراسكين</span>
        </div>
        {product.comparison.map((row) => (
          <div key={row.title} className="grid grid-cols-3 border-t border-border text-sm">
            <span className="p-3 font-semibold">{row.title}</span>
            <span className="p-3 text-muted">{row.generic}</span>
            <span className="p-3 text-ink">{row.ours}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
