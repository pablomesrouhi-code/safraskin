import type { Product } from "@/data/products";

export default function IngredientsList({ product }: { product: Product }) {
  return (
    <section className="bg-white">
        <div className="mx-auto max-w-container px-4 py-14 md:py-16">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-saffron-dark">
          التركيبة
        </p>
        <h2 className="text-2xl font-bold">هاد المكوّنات جاؤ لهاد المشكلة</h2>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">كل عنصر مكتوب، وعندو شغل على هاد المشكل.</p>
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {product.ingredients.map((item) => (
            <li key={item.name} className="rounded-2xl border border-border bg-cream p-5">
              <p className="font-bold text-ink">{item.nameAr}</p>
              <p className="mt-1 font-english text-xs tracking-wide text-saffron-dark">{item.name}</p>
              <p className="mt-3 text-sm leading-7 text-muted">{item.benefit}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
