export const TIER_PRICES = { 1: 199, 2: 279, 3: 349 } as const;
export const UPSELL_PRICE_SAR = 99;
export const CROSSSELL_PRICE_SAR = 199;

export type ProductSlug = "cyclecalm" | "oralflora" | "clearbalance";

/** Stable SKUs synced with backend — sent to Google Sheets */
export const PRODUCT_SKUS = {
  cyclecalm: "SK847291CY",
  oralflora: "SK295103OR",
  clearbalance: "SK716408CB",
} as const satisfies Record<ProductSlug, string>;

export type ProductSection = {
  title: string;
  body: string;
  image: string;
  /** Badge under section image */
  label?: string;
};

export type Ingredient = { name: string; benefit: string };
export type HowToStep = { step: number; title: string; body: string };
export type ProductFaq = { q: string; a: string };
export type ProductReview = { name: string; city: string; text: string; stars: number };

export type Product = {
  slug: ProductSlug;
  sku: string;
  nameAr: string;
  taglineAr: string;
  shortDescriptionAr: string;
  heroQuote: string;
  problemHook: string;
  problemBody: string;
  mechanismTitle: string;
  mechanismBody: string;
  unitPriceSar: number;
  crossSellSlugs: ProductSlug[];
  upsellAffinity: ProductSlug;
  image: string;
  /** PDP hero (square lifestyle); falls back to image */
  heroImage?: string;
  /** Micro-label on PDP hero image */
  heroLabel?: string;
  rating: number;
  reviewCount: number;
  problemTag: string;
  dailyOrders: number;
  ingredients: Ingredient[];
  howToUse: HowToStep[];
  faqs: ProductFaq[];
  reviews: ProductReview[];
  comparison: { title: string; generic: string; ours: string }[];
  sections: ProductSection[];
};

/** ثلاث مناطق ثقة — مكملات gummies */
export const WELLNESS_ZONES = [
  {
    id: "cycle",
    slug: "cyclecalm" as const,
    name: "هدوء الدورة",
    feeling: "قبل الدورة: انتفاخ · عصبية · تعب — تبغين تكملين يومكِ بشكل طبيعي",
    mechanism: "B6 + Magnesium Glycinate + Chasteberry — gummies يومية",
  },
  {
    id: "oral",
    slug: "oralflora" as const,
    name: "فلورا الفم",
    feeling: "الغسول يرجع · تفكرين في نفسكِ في المجلس — ثقة من الداخل",
    mechanism: "S. salivarius K12 + L. reuteri + Zinc — gummies صباحية",
  },
  {
    id: "skin",
    slug: "clearbalance" as const,
    name: "توازن البشرة",
    feeling: "حب مع التوتر والدورة — بشرة ما تطاوعكِ · ثقة منخفضة",
    mechanism: "Zinc + Probiotic + Algae DHA — دعم بشرة تحت الضغط",
  },
] as const;

export const PRODUCTS: Product[] = [
  {
    slug: "cyclecalm",
    sku: PRODUCT_SKUS.cyclecalm,
    nameAr: "هدوء الدورة",
    taglineAr: "دعم أيام الدورة · 60 gummy · شهر كامل",
    shortDescriptionAr: "2 gummies يومياً · B6 · Mag Glycinate · Vitex · sugar-free",
    heroQuote: "أيام الدورة ما لازم توقفين حياتك.",
    problemHook: "قبل الدورة… انتفاخ · عصبية · تعب — وتبغين تختفيين؟",
    problemBody:
      "هدوء الدورة gummies تجمع B6 وMagnesium Glycinate وChasteberry (Vitex) في جرعة يومية سهلة — لدعم راحة الجسم والمزاج في أيام الدورة. مو حبوب موعد · مو مكمل نوم عام — صُممت لهذه الأيام فقط.",
    mechanismTitle: "كيف تشتغل التركيبة؟",
    mechanismBody:
      "B6 يدعم توازن المزاج والأعراض المرتبطة بالدورة. Magnesium Glycinate يساعد على الاسترخاء العضلي والتقلصات الخفيفة. Chasteberry (Vitex) تقليدياً يُستخدم لدعم توازن الدورة. معاً: روتين بسيط قبل وأثناء الدورة.",
    unitPriceSar: 199,
    crossSellSlugs: ["oralflora", "clearbalance"],
    upsellAffinity: "clearbalance",
    image: "/products/cyclecalm.png",
    heroImage: "/products/cyclecalm/hero.png",
    heroLabel: "ثقة من الداخل",
    rating: 4.9,
    reviewCount: 634,
    problemTag: "دورة",
    dailyOrders: 38,
    ingredients: [
      { name: "Vitamin B6", benefit: "25–50 mg — دعم المزاج أيام الدورة" },
      { name: "Magnesium Glycinate", benefit: "100–200 mg — استرخاء · تقلصات" },
      { name: "Chasteberry (Vitex)", benefit: "20–40 mg extract — توازن الدورة" },
      { name: "Vitamin E", benefit: "اختياري — دعم عام" },
    ],
    howToUse: [
      { step: 1, title: "قبل الدورة", body: "ابدئي 5–7 أيام قبل — 2 gummies مع الماء." },
      { step: 2, title: "أثناء الدورة", body: "استمري يومياً طوال الأيام الثقيلة." },
      { step: 3, title: "30 يوم", body: "60 gummy = شهر — الالتزام يفرق." },
    ],
    faqs: [
      { q: "هل يغني عن مسكن؟", a: "لا — مكمل غذائي يدعم الراحة. للألم الشديد استشيري طبيبكِ." },
      { q: "هل فيه حديد أو ميلاتونين؟", a: "لا — تركيبة مخصصة للدورة فقط." },
      { q: "حمل ورضاعة؟", a: "لا يُنصح بدون استشارة طبية." },
      { q: "Halal؟", a: "نعم — pectin · vegan · halal-aligned." },
      { q: "ضمان؟", a: "14 يوم استرداد إذا ما ناسبكِ." },
    ],
    reviews: [
      { name: "نورة", city: "الرياض", text: "أيامي قبل الدورة صارت أهدى — ما عاد ألغي خطط.", stars: 5 },
      { name: "مها", city: "جدة", text: "gummies أسهل من الكبسولات — التزمت شهر.", stars: 5 },
      { name: "العنود", city: "الدمام", text: "الانتفاخ خف — والمزاج أحسن.", stars: 5 },
    ],
    comparison: [
      { title: "التركيز", generic: "مولتي فيتامين عام", ours: "B6 + Mag + Vitex للدورة" },
      { title: "الشكل", generic: "كبسولات", ours: "Gummies لذيذة · sugar-free" },
      { title: "الوعد", generic: "معجزة هرمونية", ours: "يدعم راحة أيام الدورة" },
    ],
    sections: [
      {
        title: "تعرفين هذا الشعور؟",
        body: "تبغين تبكين بلا سبب · بطن ممتلئ · تعب — وتخبّين الناس ما يفهمون. هدوء الدورة: روتين يدعمكِ في هذه الأيام.",
        image: "/products/cyclecalm/feeling.png",
      },
      {
        title: "جرعتكِ اليومية",
        body: "2 gummies · صباحاً · 60 يوم. مكونات مُعلنة — بدون حديد يسبب غثيان الدورة.",
        image: "/products/cyclecalm/routine.png",
        label: "روتين يومي",
      },
    ],
  },
  {
    slug: "oralflora",
    sku: PRODUCT_SKUS.oralflora,
    nameAr: "فلورا الفم",
    taglineAr: "بروبيوتيك فموي · 60 gummy · ثقة من الداخل",
    shortDescriptionAr: "K12 + L. reuteri + Zinc + D3 · xylitol · 2 gummies يومياً",
    heroQuote: "ثقة الكلام تبدأ من فم متوازن — مو من علكة كل ساعة.",
    problemHook: "غسول الفم ويرجع… وتفكرين: هل لاحظوا؟",
    problemBody:
      "فلورا الفم gummies تدعم توازن البكتيريا النافعة في الفم من الداخل — Streptococcus salivarius K12 وLactobacillus reuteri مع Zinc وVitamin D3. مو بديل فرشاة — بروتوكول يومي بجانب نظافتكِ المعتادة.",
    mechanismTitle: "بروبيوتيك للفم — كيف؟",
    mechanismBody:
      "K12 يستقر في تجويف الفم ويدعم التوازن ضد البكتيريا المسببة للرائحة. L. reuteri يدعم صحة اللثة. Zinc وD3 يدعمان الصحة الفموية العامة. Xylitol في القاعدة يقلل نشاط البكتيريا الحامضية.",
    unitPriceSar: 199,
    crossSellSlugs: ["cyclecalm", "clearbalance"],
    upsellAffinity: "cyclecalm",
    image: "/products/oralflora.png",
    heroImage: "/products/oralflora/hero.png",
    heroLabel: "ثقة من الداخل",
    rating: 4.8,
    reviewCount: 521,
    problemTag: "فم",
    dailyOrders: 31,
    ingredients: [
      { name: "S. salivarius K12", benefit: "1–3B CFU — فلورا الفم" },
      { name: "L. reuteri (oral)", benefit: "100M–1B CFU — لثة · توازن" },
      { name: "Zinc bisglycinate", benefit: "5–8 mg — دعم فموي" },
      { name: "Vitamin D3", benefit: "400–800 IU — صحة الفم" },
    ],
    howToUse: [
      { step: 1, title: "صباحاً", body: "2 gummies بعد تنظيف الأسنان — امضغي ثم ابتلاعي." },
      { step: 2, title: "يومياً", body: "روتين ثابت — النتائج تتراكم مع الالتزام." },
      { step: 3, title: "60 يوم", body: "شهرين عادة كافية لتقييم الفرق." },
    ],
    faqs: [
      { q: "هل يغني عن الفرشاة؟", a: "لا — يكمّل العناية اليومية · لا يستبدلها." },
      { q: "رجال أيضاً؟", a: "نعم — مناسب للجنسين." },
      { q: "تخزين؟", a: "مكان بارد وجاف · بعيد عن الشمس." },
      { q: "Halal؟", a: "نعم — vegan pectin gummies." },
      { q: "ضمان؟", a: "14 يوم." },
    ],
    reviews: [
      { name: "سارة", city: "جدة", text: "بطّلت أعتمد على العلكة كل شوي — روتين صباح واحد.", stars: 5 },
      { name: "هيفاء", city: "الرياض", text: "ثقتي في الكلام في الشغل رجعت.", stars: 5 },
      { name: "ريم", city: "الخبر", text: "gummies سهلة — ما في طعم دواء.", stars: 5 },
    ],
    comparison: [
      { title: "الآلية", generic: "غسول — سطحي", ours: "بروبيوتيك فموي من الداخل" },
      { title: "الاستخدام", generic: "كل ساعتين", ours: "مرتين gummies يومياً" },
      { title: "الشكل", generic: "سبراي/غسول", ours: "Gummy ممتعة" },
    ],
    sections: [
      {
        title: "الإحراج اللي ما يُقال",
        body: "تبتسمين من بعيد · تتجنبين القرب — لأن الرائحة ترجع. فلورا الفم: دعم علمي للفم · مو تغطية 20 دقيقة.",
        image: "/products/oralflora/feeling.png",
      },
      {
        title: "ثقة في المجلس",
        body: "2 gummies · K12 · Reuteri · Zinc — للمرأة والرجل في السعودية اللي يبغون ثقة اجتماعية.",
        image: "/products/oralflora/routine.png",
        label: "بروتوكول صباحي",
      },
    ],
  },
  {
    slug: "clearbalance",
    sku: PRODUCT_SKUS.clearbalance,
    nameAr: "توازن البشرة",
    taglineAr: "بشرة تحت الضغط · 60 gummy · 8 أسابيع",
    shortDescriptionAr: "Zinc + Probiotic + Algae DHA · بلا تبييض · 2 gummies يومياً",
    heroQuote: "بشرتكِ تتأثر بالتوتر — ادعميها من الداخل.",
    problemHook: "حب جديد مع الضغط أو الدورة؟ — وتبغين تختبئين؟",
    problemBody:
      "توازن البشرة gummies تجمع Zinc عالي الامتصاص مع بروبيوتيك محور gut-skin وAlgae DHA للالتهاب الخفيف. مو تبييض · مو وعد بشرة جديدة في أسبوع — دعم متوازن للبشرة الدهنية والمعرضة للحب مع التوتر.",
    mechanismTitle: "محور الأمعاء والبشرة",
    mechanismBody:
      "Zinc يدعم التهاب الحب وتنظيم الدهون. L. rhamnosus / L. acidophilus يدعمان توازناً قد ينعكس على البشرة. Algae DHA (أوميغا-3 نباتي) يدعم الالتهاب المرتبط بالبشرة. Beta-carotene كمصدر آمن لفيتامين A.",
    unitPriceSar: 199,
    crossSellSlugs: ["cyclecalm", "oralflora"],
    upsellAffinity: "oralflora",
    image: "/products/clearbalance.png",
    heroImage: "/products/clearbalance/hero.png",
    heroLabel: "ثقة من الداخل",
    rating: 4.8,
    reviewCount: 712,
    problemTag: "بشرة",
    dailyOrders: 42,
    ingredients: [
      { name: "Zinc picolinate", benefit: "15–25 mg — حب · التهاب" },
      { name: "L. rhamnosus + L. acidophilus", benefit: "2–5B CFU — gut-skin" },
      { name: "Algae DHA", benefit: "100–200 mg — أوميغا-3 نباتي" },
      { name: "Beta-carotene", benefit: "Vit A آمن — دعم البشرة" },
    ],
    howToUse: [
      { step: 1, title: "يومياً", body: "2 gummies مع وجبة — امتصاص أفضل." },
      { step: 2, title: "8 أسابيع", body: "البشرة تحتاج وقتاً — التزمي 60 يوم قبل الحكم." },
      { step: 3, title: "مع روتينكِ", body: "استمري غسولكِ — هاد دعم داخلي مو بديل عناية خارجية." },
    ],
    faqs: [
      { q: "هل يبيّض؟", a: "لا — لا glutathione تبييض · لا وعود لون بشرة." },
      { q: "هل في biotin شعر؟", a: "لا — تركيز بشرة · مو شعر." },
      { q: "حبوب دواء؟", a: "لا يستبدل علاج طبيب الجلدية." },
      { q: "حمل؟", a: "استشيري طبيبكِ قبل الاستخدام." },
      { q: "ضمان؟", a: "14 يوم." },
    ],
    reviews: [
      { name: "لمى", city: "الدمام", text: "حب التوتر خف بعد شهرين — بشرتي أهدى.", stars: 5 },
      { name: "دانة", city: "الرياض", text: "أخيراً مكمل بشرة بدون وعود تبييض.", stars: 5 },
      { name: "شهد", city: "جدة", text: "gummies لذيذة — التزمت 8 أسابيع.", stars: 5 },
    ],
    comparison: [
      { title: "الوعد", generic: "تبييض · معجزة", ours: "دعم بشرة تحت الضغط" },
      { title: "المكون", generic: "Collagen عام", ours: "Zinc + Probiotic + DHA" },
      { title: "الشكل", generic: "سيروم خارجي فقط", ours: "من الداخل · gummy" },
    ],
    sections: [
      {
        title: "تركيبة مدروسة",
        body: "Zinc · Probiotic · Algae DHA — 60 gummy · sugar-free · halal-aligned. مكونات واضحة · بدون وعود تبييض.",
        image: "/products/clearbalance/feeling.png",
      },
      {
        title: "بشرة التوتر حقيقية",
        body: "امتحان · شغل · دورة — البثور تطلع. توازن البشرة: يدعم جسدكِ من الداخل · باحترام · بلا إحراج.",
        image: "/products/clearbalance/routine.png",
        label: "8 أسابيع التزام",
      },
    ],
  },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductOrThrow(slug: string): Product {
  const product = getProduct(slug);
  if (!product) throw new Error(`Product not found: ${slug}`);
  return product;
}

export const FAQ_ITEMS = [
  {
    q: "هل سفرا جلد متجر عام؟",
    a: "لا — ثلاثة مكملات gummies متخصصة: دورة · فم · بشرة. كل SKU يحل مشكلة واحدة بوضوح.",
  },
  {
    q: "هل المنتجات halal؟",
    a: "نعم — pectin vegan gummies · halal-aligned · مكونات مُعلنة في كل صفحة.",
  },
  {
    q: "كيف الدفع والتوصيل؟",
    a: "الدفع عند الاستلام. نراجع طلبكِ. التوصيل 2–4 أيام داخل المملكة.",
  },
  { q: "هل التغليف سري؟", a: "نعم — صندوق محايد بدون ذكر المشكلة على الغلاف الخارجي." },
  {
    q: "أي منتج أبدأ فيه؟",
    a: "هدوء الدورة إذا PMS · فلورا الفم إذا ثقة الكلام · توازن البشرة إذا حب التوتر. الطقم الكامل 349 ر.س.",
  },
  {
    q: "هل هذا دواء؟",
    a: "لا — مكملات غذائية. لا تعالج أمراضاً. استشيري طبيبكِ عند الحمل أو الأدوية المزمنة.",
  },
];

export const REVIEWS = [
  { name: "نورة", city: "الرياض", text: "هدوء الدورة — أخيراً أيام أهدى.", stars: 5, product: "هدوء الدورة" },
  { name: "سارة", city: "جدة", text: "فلورا الفم — ثقة في المجلس رجعت.", stars: 5, product: "فلورا الفم" },
  { name: "لمى", city: "الدمام", text: "توازن البشرة — بدون هراء تبييض.", stars: 5, product: "توازن البشرة" },
  { name: "هيفاء", city: "مكة", text: "طقم الاتزان — ثلاث مشاكل · حل واضح.", stars: 5, product: "طقم الاتزان" },
  { name: "ريم", city: "الرياض", text: "gummies سهلة — التزام شهر فعلاً سهل.", stars: 5, product: "سفرا جلد" },
  { name: "دانة", city: "الخبر", text: "مكونات واضحة · COD سري.", stars: 5, product: "سفرا جلد" },
];

/** @deprecated use WELLNESS_ZONES */
export const CONFIDENCE_ZONES = WELLNESS_ZONES;
