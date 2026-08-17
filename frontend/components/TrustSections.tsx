import { AUTHORITY_PILLARS, COD_STEPS, LAB_INTRO, TRUST_BAR } from "@/data/brand";

export function TrustBar() {
  return (
    <div className="border-y border-border bg-white">
      <ul className="mx-auto flex max-w-container flex-wrap justify-center gap-3 px-4 py-4 text-xs font-medium text-muted md:gap-8">
        {TRUST_BAR.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export function AuthorityGrid() {
  return (
    <section className="mx-auto max-w-container px-4 py-16">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-saffron-dark">
        {LAB_INTRO.kicker}
      </p>
      <h2 className="mt-3 max-w-2xl text-2xl font-bold leading-snug md:text-3xl">{LAB_INTRO.title}</h2>
      <p className="mt-4 max-w-2xl text-[15px] leading-8 text-muted">{LAB_INTRO.body}</p>
      <div className="mt-10 grid gap-4 md:grid-cols-4">
        {AUTHORITY_PILLARS.map((item) => (
          <article key={item.title} className="rounded-2xl border border-border bg-white p-5">
            <span className="font-english text-xs tracking-[0.16em] text-saffron-dark">{item.icon}</span>
            <h3 className="mt-4 font-bold">{item.title}</h3>
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
      <div className="mx-auto max-w-container px-4 py-16">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-saffron">الطلب</p>
        <h2 className="mt-3 text-2xl font-bold md:text-3xl">كيفاش كيمشي الطلب؟</h2>
        <p className="mt-3 max-w-xl text-sm leading-7 text-cream/70">
          ثلاثة خطوات هادئة. الثمن ظاهر من اللولة، والفلوس غير ملي توصّل الطلبيّة.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {COD_STEPS.map((step) => (
            <article key={step.step} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <span className="font-english text-sm text-saffron">0{step.step}</span>
              <h3 className="mt-3 font-bold">{step.title}</h3>
              <p className="mt-2 text-sm leading-7 text-cream/70">{step.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
