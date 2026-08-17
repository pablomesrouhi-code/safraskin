import type { Product } from "@/data/products";

export default function ProductProblem({ product }: { product: Product }) {
  return (
    <section className="mx-auto max-w-container px-4 py-14 md:py-16">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-saffron-dark">
        المشكلة · الإحساس
      </p>
      <h2 className="mt-3 max-w-3xl text-2xl font-bold leading-snug md:text-3xl">
        {product.problemHook}
      </h2>
      <p className="mt-5 max-w-3xl text-[15px] leading-8 text-muted">{product.problemBody}</p>
      <div className="mt-8 max-w-3xl rounded-3xl border border-border bg-white p-6 md:p-8">
        <p className="text-xs font-semibold text-saffron-dark">{product.mechanismTitle}</p>
        <p className="mt-3 text-sm leading-8 text-muted">{product.mechanismBody}</p>
      </div>
    </section>
  );
}
