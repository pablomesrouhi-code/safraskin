import Link from "next/link";
import { EmptyFrame } from "@/components/ProductImage";
import CollectionProductCard from "@/components/CollectionProductCard";
import { AuthorityGrid, CodSteps, TrustBar } from "@/components/TrustSections";
import { FAQ_ITEMS, HOME_REVIEWS, PROBLEM_ZONES, PRODUCTS } from "@/data/products";
import { LAB_INTRO } from "@/data/brand";
import { Star } from "lucide-react";

export default function HomePage() {
  return (
    <>
      <section className="hero-glow">
        <div className="mx-auto grid max-w-container items-center gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-saffron-dark">
              {LAB_INTRO.kicker} · المغرب
            </p>
            <h1 className="mt-4 text-3xl font-bold leading-snug md:text-5xl">
              عناية مكتوبة لمشكلتكِ — صيغ محدودة، وثمن صريح، والدفع عند الباب.
            </h1>
            <p className="mt-5 max-w-lg text-[15px] leading-8 text-muted">
              كريم الكلف والتصبغات، كريم القوام الأنثوي، سيروم الفروة ضد التساقط، وعناية الإشراق من الداخل.
              كل علبة لمشكلة واحدة. كتخاري العرض، كتعمري الاسم والتيليفون، وكتخلّصي ملي توصّل الطلبيّة.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/collection"
                className="rounded-xl bg-rose px-6 py-3.5 text-sm font-bold text-white hover:bg-rose-dark"
              >
                شوفي الصيغ
              </Link>
              <a
                href="#problems"
                className="rounded-xl border border-border bg-white px-6 py-3.5 text-sm font-bold text-ink"
              >
                اختاري مشكلتك
              </a>
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl md:aspect-[5/4]">
            <EmptyFrame label="صورة الهيرو الرئيسية" className="h-full w-full rounded-3xl" />
          </div>
        </div>
      </section>

      <TrustBar />

      <section id="problems" className="mx-auto max-w-container px-4 py-16">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-saffron-dark">
          المشكلة
        </p>
        <h2 className="mt-3 text-2xl font-bold md:text-3xl">شنو هي اللي كتقلّقك اليوم؟</h2>
        <p className="mt-3 max-w-xl text-sm leading-7 text-muted">
          ما تدوريش فكتالوج عام. دخلي من الباب اللي كيشبه ليكِ — والصيغة مكتوبة لتما.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {PROBLEM_ZONES.map((zone) => (
            <Link
              key={zone.id}
              href={`/products/${zone.slug}`}
              className="rounded-3xl border border-border bg-white p-6 transition-shadow hover:border-rose/30 hover:shadow-sm"
            >
              <p className="text-xs font-semibold text-saffron-dark">المشكلة</p>
              <h3 className="mt-2 text-xl font-bold">{zone.name}</h3>
              <p className="mt-3 text-sm leading-7 text-muted">{zone.feeling}</p>
              <span className="mt-4 inline-block text-sm font-bold text-rose">شوفي الصيغة ←</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-container px-4 py-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-saffron-dark">
                المختبر
              </p>
              <h2 className="mt-2 text-2xl font-bold md:text-3xl">أربع صيغ</h2>
            </div>
            <Link href="/collection" className="text-sm font-semibold text-rose">
              الكل
            </Link>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PRODUCTS.map((product) => (
              <CollectionProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>

      <AuthorityGrid />
      <CodSteps />

      <section className="mx-auto max-w-container px-4 py-16">
        <h2 className="text-2xl font-bold">كلام الزبونات</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {HOME_REVIEWS.map((review) => (
            <article key={review.name + review.product} className="rounded-2xl border border-border bg-white p-5">
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
      </section>

      <section className="mx-auto max-w-container px-4 pb-16">
        <h2 className="text-2xl font-bold">أسئلة سريعة</h2>
        <div className="mt-6 divide-y divide-border rounded-2xl border border-border bg-white">
          {FAQ_ITEMS.map((item) => (
            <details key={item.q} className="px-5 py-4">
              <summary className="cursor-pointer font-semibold">{item.q}</summary>
              <p className="mt-2 text-sm leading-7 text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
