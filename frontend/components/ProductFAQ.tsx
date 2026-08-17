import type { Product } from "@/data/products";

export default function ProductFAQ({ product }: { product: Product }) {
  return (
    <section className="mx-auto max-w-container px-4 py-14">
        <h2 className="text-2xl font-bold">أسئلة كتجي قبل الطلب</h2>
      <div className="mt-6 divide-y divide-border rounded-2xl border border-border bg-white">
        {product.faqs.map((item) => (
          <details key={item.q} className="group px-5 py-4">
            <summary className="cursor-pointer list-none font-semibold text-ink">
              {item.q}
            </summary>
            <p className="mt-2 text-sm leading-7 text-muted">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
