import type { Product } from "@/data/products";

export default function IngredientsList({ product }: { product: Product }) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-container px-4 py-14">
        <h2 className="text-2xl font-bold">شنو داخل التركيبة؟</h2>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">
          مكونات معلنة. ما كنديروش لائحة سحرية. كل عنصر عندو سبب.
        </p>
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {product.ingredients.map((item) => (
            <li key={item.name} className="rounded-2xl border border-border bg-cream p-5">
              <p className="font-english text-sm font-semibold text-saffron-dark">{item.name}</p>
              <p className="mt-2 text-sm leading-7 text-muted">{item.benefit}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
