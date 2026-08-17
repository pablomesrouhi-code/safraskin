import Link from "next/link";
import { EmptyFrame } from "@/components/ProductImage";
import CollectionProductCard from "@/components/CollectionProductCard";
import HomePacks from "@/components/HomePacks";
import LogoMarquee from "@/components/LogoMarquee";
import { AuthorityGrid, CodSteps, TrustBar } from "@/components/TrustSections";
import { FAQ_ITEMS, HOME_REVIEWS, PROBLEM_ZONES, PRODUCTS } from "@/data/products";
import { LAB_INTRO } from "@/data/brand";
import { Star } from "lucide-react";

export default function HomePage() {
  return (
    <>
      <section className="hero-glow">
        <div className="mx-auto max-w-container px-4 pt-6 md:pt-12">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-border md:aspect-[16/10]">
            <EmptyFrame className="h-full w-full rounded-3xl" />
          </div>
        </div>
      </section>

      <LogoMarquee />

      <section className="hero-glow">
        <div className="mx-auto max-w-container px-4 py-8 md:py-12">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-saffron-dark">
            {LAB_INTRO.kicker} · المغرب
          </p>
          <h1 className="mt-3 max-w-3xl text-[1.7rem] font-bold leading-[1.5] md:mt-4 md:text-5xl">
            شنو هي اللي كتقلّقك قدام المرآة؟
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-8 text-muted">
            الكلف تحت الفوندو. الشعر فالمغسل. الوجه الباهت. أو جسمكِ اللي بغيتي تحسي بيه بهدوء.
            أربع مشاكل. أربع صيغ. كتخلّصي ملي توصّل الطلبيّة.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#problems"
              className="rounded-xl bg-rose px-5 py-3.5 text-sm font-bold text-white hover:bg-rose-dark"
            >
              اختاري مشكلتك
            </a>
            <Link
              href="/collection"
              className="rounded-xl border border-border bg-white px-5 py-3.5 text-sm font-bold text-ink"
            >
              شوفي الصيغ
            </Link>
          </div>
        </div>
      </section>

      <TrustBar />

      <section id="problems" className="mx-auto max-w-container scroll-mt-header px-4 py-12 md:py-16">
        <p className="text-[11px] font-semibold tracking-[0.18em] text-saffron-dark">
          المشكلة · الإحساس
        </p>
        <h2 className="mt-3 text-2xl font-bold leading-[1.45] md:text-3xl">دخلي من الباب اللي كيشبه ليكِ</h2>
        <p className="mt-3 max-w-xl text-sm leading-7 text-muted">
          ما تدوريش فكتالوج عام. كل صيغة مكتوبة لإحساس واحد كتعرفيه فالدار، قدام المرآة، أو فالمغسل.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {PROBLEM_ZONES.map((zone) => (
            <Link
              key={zone.id}
              href={`/products/${zone.slug}`}
              className="min-w-0 rounded-3xl border border-border bg-white p-5 transition-shadow hover:border-rose/30 hover:shadow-sm md:p-7"
            >
              <p className="text-xs font-semibold text-saffron-dark">{zone.name}</p>
              <p className="mt-3 text-sm leading-7 text-muted">{zone.feeling}</p>
              <span className="mt-4 inline-block text-sm font-bold text-rose">شوفي الصيغة ←</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-container px-4 py-12 md:py-16">
          <div className="flex items-end justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold tracking-[0.18em] text-saffron-dark">
                الصيغ
              </p>
              <h2 className="mt-2 text-2xl font-bold leading-[1.45] md:text-3xl">أربع مشاكل. أربع علب.</h2>
            </div>
            <Link href="/collection" className="shrink-0 text-sm font-semibold text-rose">
              الكل
            </Link>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {PRODUCTS.map((product) => (
              <CollectionProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>

      <AuthorityGrid />
      <CodSteps />

      <section className="mx-auto max-w-container px-4 py-12 md:py-16">
        <p className="text-[11px] font-semibold tracking-[0.18em] text-saffron-dark">
          الإحساس بعد الالتزام
        </p>
        <h2 className="mt-3 text-2xl font-bold leading-[1.45] md:text-3xl">كلام الزبونات</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {HOME_REVIEWS.map((review) => (
            <article key={review.name + review.product} className="min-w-0 rounded-2xl border border-border bg-white p-5 md:p-6">
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

      <section className="mx-auto max-w-container px-4 pb-8">
        <h2 className="text-2xl font-bold leading-[1.45] md:text-3xl">أسئلة سريعة</h2>
        <div className="mt-6 divide-y divide-border rounded-2xl border border-border bg-white">
          {FAQ_ITEMS.map((item) => (
            <details key={item.q} className="px-4 py-4 md:px-5">
              <summary className="cursor-pointer font-semibold leading-7">{item.q}</summary>
              <p className="mt-2 text-sm leading-7 text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <HomePacks />
    </>
  );
}
