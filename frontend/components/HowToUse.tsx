import type { Product } from "@/data/products";

export default function HowToUse({ product }: { product: Product }) {
  return (
    <section className="mx-auto max-w-container px-4 py-14">
      <h2 className="text-2xl font-bold">كيفاش تستعمليه؟</h2>
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
