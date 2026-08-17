import { EmptyFrame } from "@/components/ProductImage";
import { Star } from "lucide-react";
import type { Product } from "@/data/products";

export default function ProductReviews({ product }: { product: Product }) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-container px-4 py-14">
        <h2 className="text-2xl font-bold">شنو قالت اللي جرّبات</h2>
        <p className="mt-2 text-sm leading-7 text-muted">آراء هادئة من نساء جرّبو الصيغة والتزمو بالروتين.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {product.reviews.map((review) => (
            <article key={review.name + review.city} className="rounded-2xl border border-border bg-cream p-5">
              <div className="flex items-center gap-3">
                <div className="relative h-14 w-14 overflow-hidden rounded-full">
                  <EmptyFrame label="صورة" className="h-full w-full rounded-full" />
                </div>
                <div>
                  <p className="font-semibold">{review.name}</p>
                  <p className="text-xs text-muted">{review.city}</p>
                </div>
                <div className="mr-auto flex text-saffron">
                  {Array.from({ length: review.stars }).map((_, i) => (
                    <Star key={i} size={14} className="fill-saffron" />
                  ))}
                </div>
              </div>
              <p className="mt-3 text-sm leading-7 text-muted">{review.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
