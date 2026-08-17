import { Star } from "lucide-react";
import type { Product } from "@/data/products";

export default function ProductReviews({ product }: { product: Product }) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-container px-4 py-14">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-saffron-dark">
          الإحساس بعد الالتزام
        </p>
        <h2 className="mt-3 text-2xl font-bold md:text-3xl">شنو قالت اللي جرّبات</h2>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">
          ماشي قبل/بعد مبالغ فيه. كلام نساء التزمو بالروتين، وحسّو بالفرق فالدار.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {product.reviews.map((review) => (
            <article key={review.name + review.city} className="rounded-2xl border border-border bg-cream p-5">
              <div className="flex items-center gap-2 text-saffron">
                {Array.from({ length: review.stars }).map((_, i) => (
                  <Star key={i} size={14} className="fill-saffron" />
                ))}
              </div>
              <p className="mt-3 text-sm leading-7 text-muted">{review.text}</p>
              <p className="mt-3 text-sm font-semibold">
                {review.name} · {review.city}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
