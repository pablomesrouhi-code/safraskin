"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Phone, Clock, MapPin, Package, ShieldCheck, Truck, Check } from "lucide-react";
import { firstNameFrom, getCallWindow, parseOrderItems } from "@/lib/orderConfirmation";
import { getProduct, HOME_REVIEWS, PRODUCTS, UPSELL_PRICE_MAD, type ProductSlug } from "@/data/products";
import { getPack } from "@/data/packs";
import { getLinePrice } from "@/lib/pricing";
import { formatPhoneDisplay } from "@/lib/phone";
import { formatPrice } from "@/lib/money";
import BrandLogo from "@/components/BrandLogo";
import ProductImage from "@/components/ProductImage";

const RESULT_COPY: Record<string, string> = {
  clarelia: "أول تجانس كيبان بالأسابيع — مع واقي شمس، وبلا وعود سحرية.",
  femmelia: "الروتين هادئ والتغليف محايد. النتيجة كتحتاج التزام، ماشي دراما.",
  capilys: "الفروة أولاً. التساقط كيقلّ بالصبر، ماشي بليلة.",
  luminora: "كبسولة مع الفطور. الضوء كيرجع شوية شوية.",
};

function qtyLabel(qty: number) {
  if (qty === 1) return "علبة واحدة";
  if (qty === 2) return "علبتين";
  return `${qty} علب`;
}

export default function ThankYouView({ orderId }: { orderId: string }) {
  const searchParams = useSearchParams();
  const windowInfo = useMemo(() => getCallWindow(), []);
  const name = searchParams.get("name") || "";
  const phone = searchParams.get("phone") || "";
  const total = searchParams.get("total") || "";
  const upsell = searchParams.get("upsell");
  const items = parseOrderItems(searchParams.get("items") || undefined);
  const firstName = firstNameFrom(name);
  const displayPhone = phone ? formatPhoneDisplay(phone) : "";
  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  const orderedSlugs = items.map((item) => item.slug);
  const extras = PRODUCTS.filter((product) => !orderedSlugs.includes(product.slug) && product.slug !== upsell);

  const proof = useMemo(() => {
    const fromOrder = items
      .map((item) => getProduct(item.slug)?.reviews[0])
      .filter((review): review is NonNullable<typeof review> => Boolean(review));
    if (fromOrder.length >= 2) return fromOrder.slice(0, 3);
    return HOME_REVIEWS.slice(0, 3);
  }, [items]);

  const resultLines = items
    .map((item) => {
      const product = getProduct(item.slug);
      const copy = RESULT_COPY[item.slug];
      if (!product || !copy) return null;
      return { title: product.headlineAr, copy };
    })
    .filter((line): line is { title: string; copy: string } => line !== null);

  return (
    <div className="mx-auto max-w-xl px-4 py-10 pb-16">
      <div className="mb-8 flex justify-center">
        <BrandLogo />
      </div>

      <div
        className={
          windowInfo.isOpen
            ? "rounded-3xl bg-rose px-5 py-6 text-white shadow-xl shadow-rose/30"
            : "rounded-3xl bg-ink px-5 py-6 text-white shadow-xl"
        }
      >
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/80">{windowInfo.badge}</p>
        {firstName ? (
          <p className="mt-2 text-sm font-semibold text-white/90">{firstName}، الطلب تسجّل.</p>
        ) : (
          <p className="mt-2 text-sm font-semibold text-white/90">الطلب تسجّل.</p>
        )}
        <h1 className="mt-1 text-2xl font-extrabold leading-snug md:text-[1.7rem]">{windowInfo.headline}</h1>
        <p className="mt-3 text-sm leading-7 text-white/90">{windowInfo.subline}</p>
        {displayPhone ? (
          <div className="mt-4 rounded-2xl bg-white/12 px-4 py-3">
            <p className="text-xs text-white/75">غنعيّطو على هذا الرقم لتأكيد العنوان</p>
            <p className="mt-1 font-english text-xl font-bold tracking-wide" dir="ltr">
              {displayPhone}
            </p>
          </div>
        ) : null}
        <div className="mt-4 flex items-start gap-3 rounded-2xl bg-black/15 px-4 py-3">
          <Phone className="mt-0.5 shrink-0" size={20} />
          <p className="text-sm leading-7">
            إلا ما جاوبتيش، ما نقدروش نأكدو العنوان. الطلب كيتأخّر أو كيتلغى. هاد المكالمة هي اللي كتخلي العلبة توصّل.
          </p>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-ink">شنو غادي يوقع دابا</h2>
        <ol className="mt-4 space-y-3">
          <li className="flex gap-3 rounded-2xl border border-border bg-white p-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose text-sm font-bold text-white">
              1
            </span>
            <div>
              <p className="font-bold text-ink">مكالمة قصيرة</p>
              <p className="mt-1 text-sm leading-7 text-muted">
                كنأكدو السمية، التيليفون، والعنوان. الرقم جديد — جاوبي حتى إلا ما عرفتيهش.
              </p>
            </div>
          </li>
          <li className="flex gap-3 rounded-2xl border border-border bg-white p-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose text-sm font-bold text-white">
              2
            </span>
            <div>
              <p className="font-bold text-ink">كنرسلو بعد التأكيد</p>
              <p className="mt-1 text-sm leading-7 text-muted">ما كاينش تحويل دابا. التغليف محايد، والعلبة ما كتهضرش.</p>
            </div>
          </li>
          <li className="flex gap-3 rounded-2xl border border-border bg-white p-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose text-sm font-bold text-white">
              3
            </span>
            <div>
              <p className="font-bold text-ink">كتشوفي وكتخلّصي عند الباب</p>
              <p className="mt-1 text-sm leading-7 text-muted">الدفع عند الاستلام. كتشوفي الطلب، عاد كتخلّصي.</p>
            </div>
          </li>
        </ol>
      </section>

      <section className="mt-8 rounded-3xl border border-border bg-white p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-saffron-dark">ملخص الطلب</p>
        <p className="mt-2 font-english text-sm text-muted">رقم الطلب</p>
        <p className="font-english text-lg font-bold text-ink">{orderId}</p>

        {(name || displayPhone) && (
          <div className="mt-5 rounded-2xl bg-cream p-4">
            {name ? <p className="font-bold text-ink">لـ {name}</p> : null}
            {displayPhone ? (
              <p className="mt-1 text-sm text-muted">
                رقم التأكيد:{" "}
                <span className="font-english font-semibold text-ink" dir="ltr">
                  {displayPhone}
                </span>
              </p>
            ) : null}
          </div>
        )}

        <ul className="mt-5 divide-y divide-border">
          {items.map((item) => {
            const product = getProduct(item.slug);
            const pack = getPack(item.slug);
            const title = pack?.title || product?.headlineAr || item.slug;
            const price = getLinePrice(item);
            return (
              <li key={item.slug} className="flex items-start justify-between gap-4 py-4 first:pt-0">
                <div className="min-w-0 text-right">
                  <p className="font-semibold leading-7 text-ink">{title}</p>
                  <p className="mt-1 text-sm text-muted">{qtyLabel(item.qty)}</p>
                </div>
                <p className="shrink-0 pt-0.5 text-left text-sm font-bold tabular-nums text-ink">{formatPrice(price)}</p>
              </li>
            );
          })}
          {upsell ? (
            <li className="flex items-start justify-between gap-4 py-4">
              <div className="min-w-0 text-right">
                <p className="font-semibold leading-7 text-ink">{getProduct(upsell)?.headlineAr || upsell}</p>
                <p className="mt-1 text-sm text-muted">إضافة لنفس الطلب</p>
              </div>
              <p className="shrink-0 pt-0.5 text-left text-sm font-bold tabular-nums text-ink">
                {formatPrice(UPSELL_PRICE_MAD)}
              </p>
            </li>
          ) : null}
        </ul>

        {total ? (
          <div className="mt-2 flex items-end justify-between border-t border-border pt-4">
            <div className="text-right">
              <p className="font-bold text-ink">المجموع</p>
              <p className="mt-1 text-xs text-muted">الدفع عند الاستلام</p>
            </div>
            <p className="text-2xl font-extrabold tabular-nums text-rose">{formatPrice(Number(total))}</p>
          </div>
        ) : null}
      </section>

      {resultLines.length > 0 && (
        <section className="mt-8 rounded-3xl bg-gold-light/40 p-5">
          <h2 className="text-lg font-bold text-ink">شنو تستنّي من الروتين</h2>
          <p className="mt-2 text-sm leading-7 text-muted">
            النتيجة كتجي بالالتزام. المكالمة غير كتأكّد العنوان — العلبة هي اللي كتبدأ القصة.
          </p>
          <ul className="mt-4 space-y-3">
            {resultLines.map((line) => (
              <li key={line.title} className="rounded-2xl bg-white p-4">
                <p className="font-bold text-ink">{line.title}</p>
                <p className="mt-1 text-sm leading-7 text-muted">{line.copy}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-8">
        <h2 className="text-lg font-bold text-ink">نساء أكّدو، واستلمو</h2>
        <div className="mt-4 space-y-3">
          {proof.map((review) => (
            <blockquote key={`${review.name}-${review.city}`} className="rounded-2xl border border-border bg-white p-4">
              <p className="text-sm leading-7 text-ink">“{review.text}”</p>
              <p className="mt-2 text-xs font-semibold text-saffron-dark">
                {review.name} · {review.city}
              </p>
            </blockquote>
          ))}
        </div>
      </section>

      {extras.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-bold text-ink">بغيتي تزيدي لنفس التوصيل؟</h2>
          <p className="mt-2 text-sm leading-7 text-muted">
            قوليها للبنت فال مكالمة. كيتزاد لنفس الطلبيّة، وبلا توصيل زايد.
          </p>
          <div className="mt-4 space-y-3">
            {extras.map((product) => (
              <div key={product.slug} className="flex items-center gap-3 rounded-2xl border border-border bg-white p-3">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-cream">
                  <ProductImage src={product.image} alt={product.headlineAr} fill emptyLabel={product.headlineAr} />
                </div>
                <div className="min-w-0 flex-1 text-right">
                  <p className="font-bold text-ink">{product.headlineAr}</p>
                  <p className="mt-1 line-clamp-2 text-xs leading-6 text-muted">{product.problemHook}</p>
                </div>
                <Link
                  href={`/products/${product.slug as ProductSlug}`}
                  className="shrink-0 rounded-xl bg-rose px-3 py-2 text-xs font-bold text-white hover:bg-rose-dark"
                >
                  شوفي
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mt-8 grid grid-cols-2 gap-3 text-center text-xs text-muted">
        <div className="rounded-2xl bg-cream p-3">
          <Clock className="mx-auto mb-1 text-rose" size={18} />
          من 9 الصباح لـ 9 العشية
        </div>
        <div className="rounded-2xl bg-cream p-3">
          <MapPin className="mx-auto mb-1 text-rose" size={18} />
          العنوان فالمكالمة
        </div>
        <div className="rounded-2xl bg-cream p-3">
          <Package className="mx-auto mb-1 text-rose" size={18} />
          تغليف محايد
        </div>
        <div className="rounded-2xl bg-cream p-3">
          <Truck className="mx-auto mb-1 text-rose" size={18} />
          كل المدن
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-border bg-white p-5">
        <h2 className="text-lg font-bold text-ink">أسئلة قبل ما يعيّطو</h2>
        <dl className="mt-4 space-y-4 text-sm leading-7">
          <div>
            <dt className="font-bold text-ink">علاش الرقم ما معروفش؟</dt>
            <dd className="mt-1 text-muted">كنعيّطو من خط العمل. ماشي إعلان، وماشي بنك. غير تأكيد العنوان.</dd>
          </div>
          <div>
            <dt className="font-bold text-ink">واش خاص نخلّص دابا؟</dt>
            <dd className="mt-1 text-muted">لا. الفلوس عند الباب، ملي تشوفي العلبة.</dd>
          </div>
          <div>
            <dt className="font-bold text-ink">إلا ضيّعت المكالمة؟</dt>
            <dd className="mt-1 text-muted">نعاودو. ولكن كل رنّة ضايعة كتأخّر الإرسال.</dd>
          </div>
        </dl>
        <ul className="mt-5 space-y-2 text-sm text-muted">
          <li className="flex gap-2">
            <Check size={16} className="mt-0.5 shrink-0 text-rose" />
            ما كاينش بطاقة، ما كاينش تحويل
          </li>
          <li className="flex gap-2">
            <ShieldCheck size={16} className="mt-0.5 shrink-0 text-rose" />
            كنأكدو قبل ما تخرج الطلبيّة
          </li>
        </ul>
      </section>

      {wa ? (
        <a
          href={`https://wa.me/${wa.replace(/\D/g, "")}`}
          className="mt-6 flex w-full items-center justify-center rounded-2xl border-2 border-rose py-3.5 font-bold text-rose"
        >
          واتساب إلا بغيتي تبدّلي شي حاجة
        </a>
      ) : (
        <Link
          href="/contact"
          className="mt-6 flex w-full items-center justify-center rounded-2xl border-2 border-rose py-3.5 font-bold text-rose"
        >
          تواصلي معنا
        </Link>
      )}

      <Link href="/collection" className="mt-3 flex w-full items-center justify-center py-3 text-sm text-muted">
        رجعي للمجموعة
      </Link>
    </div>
  );
}
