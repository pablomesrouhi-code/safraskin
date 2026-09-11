import { Star } from "lucide-react";
import type { Product } from "@/data/products";
import ProductImage from "@/components/ProductImage";

export default function ProductReviews({ product }: { product: Product }) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-container px-4 py-14 md:py-16">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-saffron-dark">
          الإحساس بعد الالتزام
        </p>
        <h2 className="mt-3 text-2xl font-bold md:text-3xl">شنو قالت اللي جرّبات</h2>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">
          ماشي قبل/بعد مبالغ فيه. كلام نساء التزمو بالروتين، وحسّو بالفرق فالدار.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {product.reviews.map((review, index) => (
            <article
              key={review.name + review.city}
              className={`overflow-hidden rounded-2xl border border-border bg-cream ${
                index === 0 ? "sm:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-white md:aspect-[5/4]">
                <ProductImage
                  src={review.photo}
                  alt={`تجربة ${review.name} مع ${product.nameAr}`}
                  fill
                  emptyLabel="صورة التجربة"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
                  priority={index === 0}
                />
              </div>
              <div className="p-5 md:p-6">
                <div className="flex items-center gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">
                      {review.name} · {review.city}
                    </p>
                    <div className="mt-1 flex items-center gap-1 text-saffron">
                      {Array.from({ length: review.stars }).map((_, i) => (
                        <Star key={i} size={14} className="fill-saffron" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-7 text-muted md:text-[15px] md:leading-8">{review.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
