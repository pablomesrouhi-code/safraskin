import { AUTHORITY_PILLARS, COD_STEPS, LAB_INTRO, TRUST_BAR } from "@/data/brand";
import Marquee from "@/components/Marquee";

export function TrustBar() {
  const items = [...TRUST_BAR, ...TRUST_BAR, ...TRUST_BAR];
  const row = (
    <>
      {items.map((item, index) => (
        <span
          key={`${item}-${index}`}
          className="flex shrink-0 items-center gap-4 whitespace-nowrap px-5 text-[11px] font-semibold text-cream sm:px-7 sm:text-xs md:text-sm"
        >
          <span>{item}</span>
          <span className="text-saffron" aria-hidden>
            ✦
          </span>
        </span>
      ))}
    </>
  );

  return (
    <div className="w-full bg-ink py-2.5 md:py-3">
      <Marquee duration={55}>{row}</Marquee>
    </div>
  );
}

export function AuthorityGrid() {
  return (
    <section id="lab" className="mx-auto max-w-container scroll-mt-header px-4 py-12 md:py-16">
      <p className="text-[11px] font-semibold tracking-[0.18em] text-saffron-dark">
        المختبر · {LAB_INTRO.kicker}
      </p>
      <h2 className="mt-3 max-w-2xl text-2xl font-bold leading-[1.45] md:text-3xl">{LAB_INTRO.title}</h2>
      <p className="mt-4 max-w-2xl text-[15px] leading-8 text-muted">{LAB_INTRO.body}</p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {AUTHORITY_PILLARS.map((item) => (
          <article key={item.title} className="min-w-0 rounded-2xl border border-border bg-white p-5">
            <span className="font-english text-xs tracking-[0.16em] text-saffron-dark">{item.icon}</span>
            <h3 className="mt-4 font-bold leading-7">{item.title}</h3>
            <p className="mt-2 text-sm leading-7 text-muted">{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function CodSteps() {
  return (
    <section className="bg-ink text-cream">
      <div className="mx-auto max-w-container px-4 py-12 md:py-16">
        <p className="text-[11px] font-semibold tracking-[0.18em] text-saffron">الطلب</p>
        <h2 className="mt-3 text-2xl font-bold leading-[1.45] md:text-3xl">كيفاش كيمشي الطلب؟</h2>
        <p className="mt-3 max-w-xl text-sm leading-7 text-cream/70">
          ثلاثة خطوات هادئة. الثمن ظاهر من اللولة، والفلوس غير ملي توصّل الطلبيّة.
        </p>
        <div className="mt-8 grid gap-3 md:grid-cols-3 md:gap-4">
          {COD_STEPS.map((step) => (
            <article
              key={step.step}
              className="flex min-w-0 items-start gap-4 rounded-2xl border border-white/15 bg-white/5 p-4 md:block md:p-5"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-saffron font-english text-sm font-bold text-ink">
                {step.step}
              </span>
              <div className="min-w-0">
                <h3 className="font-bold leading-7 md:mt-4">{step.title}</h3>
                <p className="mt-1 text-sm leading-7 text-cream/70 md:mt-2">{step.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
