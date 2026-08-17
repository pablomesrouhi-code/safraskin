import type { Product } from "@/data/products";

export default function HowToUse({ product }: { product: Product }) {
  return (
    <section className="mx-auto max-w-container px-4 py-14 md:py-16">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-saffron-dark">
        الروتين
      </p>
      <h2 className="mt-3 text-2xl font-bold">الروتين اللي يقدر يتعاش فالدار</h2>
      <p className="mt-2 max-w-xl text-sm leading-7 text-muted">
        ما خاصكش إثنى عشر خطوة. خاصك إيقاع تقدري تلتزمي بيه حتى تحسي بالفرق.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {product.howToUse.map((step) => (
          <div key={step.step} className="rounded-2xl border border-border bg-white p-5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose text-sm font-bold text-white">
              {step.step}
            </span>
            <h3 className="mt-4 font-bold">{step.title}</h3>
            <p className="mt-2 text-sm leading-7 text-muted">{step.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
