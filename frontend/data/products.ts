export const TIER_PRICES = { 1: 219, 2: 279, 3: 319 } as const;
export const UPSELL_PRICE_MAD = 120;
export const CROSSSELL_PRICE_MAD = TIER_PRICES[1];

export type ProductSlug = "clarelia" | "femmelia" | "capilys" | "luminora";
export type OfferQty = 1 | 2 | 3;

export const PRODUCT_SKUS = {
  clarelia: "SK-CLAR-01",
  femmelia: "SK-FEMM-02",
  capilys: "SK-CAPI-03",
  luminora: "SK-LUMI-04",
} as const satisfies Record<ProductSlug, string>;

export type ProductSection = {
  title: string;
  body: string;
  imageLabel: string;
  image: string;
};

export type Ingredient = { name: string; benefit: string };
export type HowToStep = { step: number; title: string; body: string };
export type ProductFaq = { q: string; a: string };
export type ProductReview = {
  name: string;
  city: string;
  text: string;
  stars: number;
  photo: string;
};

export type Product = {
  slug: ProductSlug;
  sku: string;
  nameAr: string;
  nameEn: string;
  problemTitle: string;
  taglineAr: string;
  shortDescriptionAr: string;
  heroQuote: string;
  problemHook: string;
  problemBody: string;
  mechanismTitle: string;
  mechanismBody: string;
  unitPriceMad: number;
  crossSellSlugs: ProductSlug[];
  upsellAffinity: ProductSlug;
  image: string;
  heroImage: string;
  heroLabel: string;
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
  gallery: { src: string; label: string }[];
};

export const PROBLEM_ZONES = [
  {
    id: "spots",
    slug: "clarelia" as const,
    name: "التصبغات والكلف",
    feeling: "الكلف كيبان فالصيف، من بعد الحمل، ومن بعد الدورة — والكريمات العامة ما كتكملش الخدمة.",
  },
  {
    id: "femme",
    slug: "femmelia" as const,
    name: "القوام الأنثوي",
    feeling: "بغيتي تحسي براسك أنثى فالمرآة — بلا إحراج وبلا كلام رخيص على التيك توك.",
  },
  {
    id: "hair",
    slug: "capilys" as const,
    name: "سقوط الشعر",
    feeling: "كل مشطة كتخلّي شعر فالمغسل، وكتفكّري واش غادي يرجع الكثافة ولا لا.",
  },
  {
    id: "glow",
    slug: "luminora" as const,
    name: "الإشراق من الداخل",
    feeling: "الماسك كيدوز والوجه باقي باهت. الإشراق ما كيبدا من البرّا بوحدو.",
  },
] as const;

export const PRODUCTS: Product[] = [
  {
    slug: "clarelia",
    sku: PRODUCT_SKUS.clarelia,
    nameAr: "كلاريليا",
    nameEn: "Clarélia",
    problemTitle: "التصبغات والكلف",
    taglineAr: "عناية يومية للكلف والبقع — روتين واضح للبشرة المغربية",
    shortDescriptionAr: "نياسيناميد · أربوتين · مستخلص الزعفران · كريم ليلي/نهاري",
    heroQuote: "الكلف ما كيتخباش تحت الماكياج. كيتتعامل معاه بروتين.",
    problemHook: "كتشوفي البقع فالمرآة، وكتزيدي فوند دو طون… وهو باقي باين؟",
    problemBody:
      "فالمغرب الشمس قوية، والحمل والدورة كيخليو الكلف والتصبغات يرجعو. كلاريليا ماشي تبييض سحري فثلاثة أيام — عناية مركّزة على توحيد اللون وتهدئة البقع، بروتين يومي تقدري تلتزمي بيه.",
    mechanismTitle: "كيفاش كتخدم على البقع؟",
    mechanismBody:
      "نياسيناميد كيهدي مظهر البقع ويدعم حاجز البشرة. ألفا أربوتين كيستهدف التصبغ الظاهر. مشتق فيتامين C كيساعد على إشراق أكثر تجانس. مستخلص الزعفران — لمسة البراند — كيعطي إحساس عناية فاخرة بدون تهويل.",
    unitPriceMad: TIER_PRICES[1],
    crossSellSlugs: ["luminora", "capilys", "femmelia"],
    upsellAffinity: "luminora",
    image: "/products/clarelia.png",
    heroImage: "/products/clarelia/hero.png",
    heroLabel: "صورة المنتج",
    rating: 4.8,
    reviewCount: 186,
    problemTag: "كلف",
    dailyOrders: 14,
    gallery: [
      { src: "/products/clarelia/hero.png", label: "1 · صورة المنتج" },
      { src: "/products/clarelia/1.png", label: "2 · المشكلة" },
      { src: "/products/clarelia/2.png", label: "3 · التركيبة" },
      { src: "/products/clarelia/3.png", label: "4 · الروتين" },
      { src: "/products/clarelia/4.png", label: "5 · النتيجة المتوقعة" },
    ],
    ingredients: [
      { name: "Niacinamide", benefit: "يوحّد المظهر ويهدي الإحمرار الخفيف" },
      { name: "Alpha Arbutin", benefit: "يستهدف البقع الظاهرة بلطف" },
      { name: "Vitamin C derivative", benefit: "إشراق أكثر تجانس مع الوقت" },
      { name: "Saffron extract", benefit: "لمسة عناية فاخرة — هوية سفراسكين" },
    ],
    howToUse: [
      { step: 1, title: "صباح", body: "كمية صغيرة على المناطق اللي فيها بقع، ومن بعد واقي شمس. الشمس كترجع الكلف." },
      { step: 2, title: "ليل", body: "نفس الطبقة على بشرة نظيفة. الالتزام أهم من الكمية." },
      { step: 3, title: "8 أسابيع", body: "البشرة كتبدّل بالدورات. حكمي من بعد شهرين، ماشي من بعد ثلاثة أيام." },
    ],
    faqs: [
      { q: "واش كييّض الوجه؟", a: "لا. كنهدرو على توحيد اللون ومظهر الكلف — ماشي تبييض ولا تغيير لون البشرة." },
      { q: "واش يقدر يتستعمل مع واقي الشمس؟", a: "خاص يتستعمل معاه. بلا SPF الكلف كيرجع بسرعة فالشمس المغربية." },
      { q: "الحمل والرضاعة؟", a: "استشيري طبيبتكِ قبل أي روتين جديد. هاد المنتج عناية تجميلية، ماشي دواء." },
      { q: "متى كيبان الفرق؟", a: "الناس كيحسّو بتجانس تدريجي من 4 لـ 8 أسابيع مع الالتزام. ما كنديروش وعود خيالية." },
      { q: "كيفاش نخلّص؟", a: "الدفع عند الاستلام. كنعيّطو ليكِ باش نأكدو العنوان قبل ما نرسلو." },
    ],
    reviews: [
      { name: "سارة", city: "الدار البيضاء", text: "الكلف ديال الصيف كان باين بزاف. ما تبدّلتش فسبوع، ولكن من بعد شهر الوجه ولا أكثر تجانس.", stars: 5, photo: "/products/clarelia/reviews/1.png" },
      { name: "إيمان", city: "مراكش", text: "مراكش والشمس… كنت كنغطي بالفون. دابا كنخرج بروج خفيف وكنحس براسي مرتاحة.", stars: 5, photo: "/products/clarelia/reviews/2.png" },
      { name: "ندى", city: "الرباط", text: "بعد الحمل بقات ليا بقع. الروتين ساهل وما فيهوش ريحة قوية.", stars: 5, photo: "/products/clarelia/reviews/3.png" },
      { name: "لبنى", city: "فاس", text: "عجبني الصراحة ديالهم: ما قالوش معجزة. قلت نجرّب علبتين والتزمت.", stars: 5, photo: "/products/clarelia/reviews/4.png" },
      { name: "حنان", city: "طنجة", text: "الطلب وصل، خلّصت عند الباب. المكالمة ديال التأكيد عطاتني ثقة.", stars: 5, photo: "/products/clarelia/reviews/5.png" },
    ],
    comparison: [
      { title: "الوعد", generic: "تبييض فأيام", ours: "توحيد تدريجي مع الالتزام" },
      { title: "الاستعمال", generic: "كريم عام لكل شي", ours: "مركّز على الكلف والبقع" },
      { title: "الشمس", generic: "كيتنسى الواقي", ours: "الروتين كيحسب SPF ضروري" },
    ],
    sections: [
      {
        title: "كتشوفي هاد الإحساس؟",
        body: "الضو كيبان البقع. التصويرة كيبان فيها الكلف. وكتبدّلي زاوية وجهك. كلاريليا جات لهاد اللحظة: تعاملي مع الكلف بهدوء، ما تخبيهش غير بالماكياج.",
        imageLabel: "صورة المشكلة",
        image: "/products/clarelia/1.png",
      },
      {
        title: "تركيبة واضحة، بلا تهويل",
        body: "نياسيناميد، أربوتين، فيتامين C لطيف، ومستخلص الزعفران. المكونات مكتوبة. الخدمة كتجي من الالتزام، ماشي من شعار كبير.",
        imageLabel: "صورة التركيبة",
        image: "/products/clarelia/2.png",
      },
      {
        title: "روتين ما كيتعطلش نهارك",
        body: "طبقة الصباح، طبقة الليل. دقيقة. المرأة المغربية ما عندهاش وقت لـ 12 خطوة. عندها وقت لحاجة كتكمّل.",
        imageLabel: "صورة الروتين",
        image: "/products/clarelia/3.png",
      },
      {
        title: "النتيجة اللي كنوعدو بيها بصدق",
        body: "مظهر أكثر تجانس. بقع أقل حضوراً. ثقة قدام المرآة. ما كنوعدوش ببشرة وحدة أخرى — كنوعدو بروتين يقدر يخدم.",
        imageLabel: "صورة الإحساس",
        image: "/products/clarelia/4.png",
      },
    ],
  },
  {
    slug: "femmelia",
    sku: PRODUCT_SKUS.femmelia,
    nameAr: "فيميليا",
    nameEn: "Femmélia",
    problemTitle: "زيادة المناطق الأنثوية",
    taglineAr: "عناية مكثفة للقوام الأنثوي — محترمة، واضحة، بلا إحراج",
    shortDescriptionAr: "كريم عناية للصدر والقوام · ترطيب عميق · روتين ليلي",
    heroQuote: "أنوثتكِ ما محتاجاش إعلان رخيص. محتاجة روتين محترم.",
    problemHook: "كتلبي وكتشوفي راسك، وكتبغي تحسي بالقوام ديالك أوضح… بلا ما تسمعي كلام زايد؟",
    problemBody:
      "فيميليا كريم عناية للمناطق الأنثوية: كيرطّب بعمق وكيساعد على مظهر أكثر امتلاء ونعومة مع الاستعمال اليومي. ماشي وعد طبي، وماشي فيديو مبالغ فيه. عناية كتحتارم جسمكِ وكتعطيكِ روتين تقدري تكمّليه فالدار، براحة.",
    mechanismTitle: "عناية مكثفة، ماشي سحر",
    mechanismBody:
      "التركيبة كتشتغل على ترطيب الطبقات السطحية ودعم مظهر الجلد الأكثر نعومة وامتلاء. زيت نباتي غني، حمض الهيالورونيك، ومستخلصات تقليدية بحال الحلبة فالذاكرة المغربية — بصيغة عناية حديثة. النتيجة كتجي مع التدليك اليومي والالتزام، ماشي من ضربة واحدة.",
    unitPriceMad: TIER_PRICES[1],
    crossSellSlugs: ["clarelia", "luminora", "capilys"],
    upsellAffinity: "clarelia",
    image: "/products/femmelia.png",
    heroImage: "/products/femmelia/hero.png",
    heroLabel: "صورة المنتج",
    rating: 4.7,
    reviewCount: 142,
    problemTag: "قوام",
    dailyOrders: 11,
    gallery: [
      { src: "/products/femmelia/hero.png", label: "1 · صورة المنتج" },
      { src: "/products/femmelia/1.png", label: "2 · المشكلة" },
      { src: "/products/femmelia/2.png", label: "3 · التركيبة" },
      { src: "/products/femmelia/3.png", label: "4 · الروتين" },
      { src: "/products/femmelia/4.png", label: "5 · الإحساس" },
    ],
    ingredients: [
      { name: "Hyaluronic acid", benefit: "امتلاء ظاهري ونعومة اللمس" },
      { name: "Shea & plant oils", benefit: "تغذية بدون إحساس دهني مزعج" },
      { name: "Fenugreek extract", benefit: "ذاكرة عناية مغربية، بصيغة حديثة" },
      { name: "Peptide care complex", benefit: "يدعم مظهر الجلد مع التدليك اليومي" },
    ],
    howToUse: [
      { step: 1, title: "ليل", body: "بعد الدوش، كمية على المناطق المعنية. دلّكي بلطف من الأسفل للأعلى." },
      { step: 2, title: "يومياً", body: "نفس الحركة كل ليلة. التدليك جزء من النتيجة، ماشي غير الكريم." },
      { step: 3, title: "8 إلى 12 أسبوع", body: "القوام ما كيتحوّلش فسيمانة. اللي كيلتزم كيشوف الفرق فاللمس والمظهر." },
    ],
    faqs: [
      { q: "واش هادشي دواء؟", a: "لا. عناية تجميلية للمظهر واللمس. ما كتعوّضش استشارة طبية." },
      { q: "واش الاستعمال محرج؟", a: "لا. التغليف محايد، والطلب كيتأكّد بالتيليفون بلا ما نذكرو التفاصيل قدام العائلة." },
      { q: "الحمل؟", a: "استشيري طبيبتكِ. ما كنصحوش بالتجريب من راسكِ فهاد الفترة." },
      { q: "علاش 3 علب؟", a: "الروتين كياخد أسابيع. علبة وحدة كتكمّل التجربة، والثلاث كيعطيو وقت كافي للنتيجة." },
      { q: "كيفاش نخلّص؟", a: "عند الاستلام. الاسم والتيليفون كافيين دابا — العنوان كنأكّدوه فالمكالمة." },
    ],
    reviews: [
      { name: "مريم", city: "الدار البيضاء", text: "عجبني أن الموقع ما تكلّمش رخيص. جرّبت بروتين ليلي وبقيت عليه.", stars: 5, photo: "/products/femmelia/reviews/1.png" },
      { name: "أمينة", city: "أكادير", text: "اللمس تبدّل قبل المظهر. حسّيت براسي مهتمّة بجسمي بلا دراما.", stars: 5, photo: "/products/femmelia/reviews/2.png" },
      { name: "ياسمين", city: "سلا", text: "التغليف محترم. والولد ما قراش والو على الكرتون.", stars: 5, photo: "/products/femmelia/reviews/3.png" },
      { name: "إكرام", city: "وجدة", text: "طلبت علبتين. المكالمة كانت سريعة ووصلت الطلبيّة.", stars: 4, photo: "/products/femmelia/reviews/4.png" },
      { name: "خديجة", city: "مكناس", text: "ماشي معجزة، ولكن الإحساس فالمرآة ولا أهدى.", stars: 5, photo: "/products/femmelia/reviews/5.png" },
    ],
    comparison: [
      { title: "الأسلوب", generic: "إعلانات محرجة", ours: "عناية محترمة وواضحة" },
      { title: "الوعد", generic: "نتيجة فثلاثة أيام", ours: "روتين أسابيع مع تدليك" },
      { title: "الخصوصية", generic: "كرتون باين", ours: "تغليف محايد + مكالمة هادئة" },
    ],
    sections: [
      {
        title: "هاد الموضوع ما محتاجش ضحك",
        body: "بزاف ديال الإعلانات كيهضرو على جسم المرأة برخص. فيميليا جات من جهة أخرى: عناية، خصوصية، وروتين تقدري تديريه فالدار بلا ما تحسي براسك سلعة.",
        imageLabel: "صورة المشكلة",
        image: "/products/femmelia/1.png",
      },
      {
        title: "التركيب كيدعم المظهر، ما كيبدّلش الطب",
        body: "ترطيب عميق، لمسة امتلاء، وجلد أنعم. كنقولو شنو نقدروا نوعدو، وشنو ما نقدروش. هاد الصراحة هي اللي كتخلي الزبونات يكملو الطلب حتى للتوصيل.",
        imageLabel: "صورة التركيبة",
        image: "/products/femmelia/2.png",
      },
      {
        title: "خمس دقايق قبل النعاس",
        body: "ما كاينش جهاز، ما كاينش موعد. كريم + تدليك لطيف. المرأة اللي عندها دار وخدامة محتاجة روتين بحال هاكا.",
        imageLabel: "صورة الروتين",
        image: "/products/femmelia/3.png",
      },
      {
        title: "الثقة اللي كترجع فالمرحاض، ماشي غير فالريل",
        body: "الهدف ماشي تصويرة للإعلان. الهدف تحسي براسك مرتاحة فقندورتك، فالحمام، وقدّام راسك.",
        imageLabel: "صورة الإحساس",
        image: "/products/femmelia/4.png",
      },
    ],
  },
  {
    slug: "capilys",
    sku: PRODUCT_SKUS.capilys,
    nameAr: "كابيليس",
    nameEn: "Capilys",
    problemTitle: "سقوط الشعر",
    taglineAr: "سيروم لكثافة المظهر — ضد التساقط اليومي اللي كيبان فالمشط",
    shortDescriptionAr: "كافيين · إكليل الجبل · بيوتين موضعي · سيروم فروة",
    heroQuote: "الشعرة اللي فالمغسل كتهضر قبل ما تهضري نتي.",
    problemHook: "كل مغسل، كل مشطة، وكتشوفي شعر أكثر مما كنتي كتحسبي؟",
    problemBody:
      "التساقط كيجي من التوتر، بعد الولادة، من الفصول، ومن نقص العناية بالفروة. كابيليس سيروم خفيف كيتدهن على الفروة: كافيين، إكليل الجبل، وبيوتين موضعي — باش المظهر يرجع أكثر كثافة مع الوقت، وما تبقيش غير تبدّلي الشامبوان كل سيمانة.",
    mechanismTitle: "الفروة أولاً، الشعر من بعد",
    mechanismBody:
      "الكافيين كينشّط مظهر الفروة. إكليل الجبل تقليد معروف عند النساء هنا، بصيغة سيروم ما كيلصقش. العناية الموضعية كتكمّل التغذية من الداخل — إلا بغيتي الإشراق من الداخل، لومينورا كتمشي معاه.",
    unitPriceMad: TIER_PRICES[1],
    crossSellSlugs: ["luminora", "clarelia", "femmelia"],
    upsellAffinity: "luminora",
    image: "/products/capilys.png",
    heroImage: "/products/capilys/hero.png",
    heroLabel: "صورة المنتج",
    rating: 4.8,
    reviewCount: 209,
    problemTag: "شعر",
    dailyOrders: 16,
    gallery: [
      { src: "/products/capilys/hero.png", label: "1 · صورة المنتج" },
      { src: "/products/capilys/1.png", label: "2 · المشكلة" },
      { src: "/products/capilys/2.png", label: "3 · التركيبة" },
      { src: "/products/capilys/3.png", label: "4 · الروتين" },
      { src: "/products/capilys/4.png", label: "5 · الكثافة" },
    ],
    ingredients: [
      { name: "Caffeine", benefit: "ينشّط مظهر الفروة ويخفّف الإحساس بالخمول" },
      { name: "Rosemary extract", benefit: "عناية تقليدية بصيغة خفيفة" },
      { name: "Topical biotin complex", benefit: "يدعم مظهر الشعرة من الجذر" },
      { name: "Niacinamide", benefit: "فروة أكثر هدوء وأقل تهيّج" },
    ],
    howToUse: [
      { step: 1, title: "على الفروة", body: "شعر ناشف أو رطب خفيف. قطّري على الخطوط، وماشي غير على الأطراف." },
      { step: 2, title: "دلّكي دقيقة", body: "أطراف الصبع، بلطف. الدورة الدموية جزء من الروتين." },
      { step: 3, title: "90 يوم", body: "دورة الشعر بطيئة. علبة واحدة للبداية، و3 علب للبروتوكول الكامل." },
    ],
    faqs: [
      { q: "واش كيرجع الشعر من الصفر؟", a: "كنهدرو على مظهر الكثافة وتقليل التساقط اليومي. الصلع المرضي خاصو طبيب." },
      { q: "واش كيلصق الشعر؟", a: "السيروم خفيف. كيتدهن على الفروة، ماشي كاس من الزيت الثقيل." },
      { q: "بعد الولادة؟", a: "التساقط بعد الولادة شائع. الروتين ك يساعد، ومع ذلك استشيري طبيبتكِ إلا كان التساقط حاد." },
      { q: "رجال يقدروا يستعملوه؟", a: "البراند موجّه للمرأة، والتركيبة تقدر تناسب فروة الرجل — القرار ليكِ." },
      { q: "التوصيل للمدينة ديالي؟", a: "كنوصلو لجميع المدن المغربية. العنوان كنأكّدوه فالمكالمة." },
    ],
    reviews: [
      { name: "فاطمة", city: "الدار البيضاء", text: "المغسل كان كيخوفني. من بعد شهر حسّيت التساقط قلّ، والشعر ولا أهدى.", stars: 5, photo: "/products/capilys/reviews/1.png" },
      { name: "سلمى", city: "تطوان", text: "بعد الولادة طاح لي بزاف. ما رجعش بحال الأول بسرعة، ولكن الكثافة بدات تبان.", stars: 5, photo: "/products/capilys/reviews/2.png" },
      { name: "هدى", city: "القنيطرة", text: "الريحة خفيفة وما كيلصقش. هاد الشي اللي خلّاني نكمل.", stars: 5, photo: "/products/capilys/reviews/3.png" },
      { name: "نورة", city: "الجديدة", text: "طلبت 3 علب من اللولة. عرفت أن الشعر كياخد وقت.", stars: 5, photo: "/products/capilys/reviews/4.png" },
      { name: "أسماء", city: "فاس", text: "الولد عيط، أكّدت العنوان، ووصلات الطلبيّة نقية.", stars: 5, photo: "/products/capilys/reviews/5.png" },
    ],
    comparison: [
      { title: "التركيز", generic: "شامبوان يتبدّل كل سيمانة", ours: "سيروم فروة بروتين ثابت" },
      { title: "الوقت", generic: "وعد فسبوعة", ours: "دورة شعر: أسابيع إلى 90 يوم" },
      { title: "اللمس", generic: "زيت ثقيل", ours: "سيروم خفيف على الفروة" },
    ],
    sections: [
      {
        title: "الشعرة فالمغسل كتوجع أكثر من أي تعليق",
        body: "كتخبي المشط. كتجمعي الشعر بسرعة قبل ما يدخل راجلك للحمام. كابيليس جات لهاد الإحساس اليومي، ماشي غير لريل قبل/بعد.",
        imageLabel: "صورة المشكلة",
        image: "/products/capilys/1.png",
      },
      {
        title: "الفروة هي الأرض",
        body: "إلا الأرض ضعيفة، الشعر كيبان خاوي. السيروم كيتدهن فين كاين الجذر. بسيطة، وهاد البساطة هي اللي كتخلي الناس يلتزمو.",
        imageLabel: "صورة التركيبة",
        image: "/products/capilys/2.png",
      },
      {
        title: "دقيقة بعد الدوش",
        body: "ما كاينش موعد عند الكوافورة كل سيمانة باش يخدم. كاين روتين فالدار، كل ليلة، بلا دراما.",
        imageLabel: "صورة الروتين",
        image: "/products/capilys/3.png",
      },
      {
        title: "الكثافة اللي كترجع فالگُوفّة",
        body: "الهدف شعر كيملا الخصلة، ماشي سحر طول فسبوع. إلا بغيتي تدعمي من الداخل، زيدِ لومينورا من السلة.",
        imageLabel: "صورة الكثافة",
        image: "/products/capilys/4.png",
      },
    ],
  },
  {
    slug: "luminora",
    sku: PRODUCT_SKUS.luminora,
    nameAr: "لومينورا",
    nameEn: "Luminora",
    problemTitle: "فقدان الإشراق من الداخل",
    taglineAr: "إشراق من الداخل — لما الماسك ما عادش كيكفي",
    shortDescriptionAr: "كولاجين · فيتامين C · زنك · روتين يومي من الداخل",
    heroQuote: "الضو اللي كينقص من الوجه، غالباً ما كينقصش من الكريم بوحدو.",
    problemHook: "كتديري ماسك، كتشوفي وجهك باهت، وكتقولي: واش أنا تعبانة ولا البشرة هي اللي طافات؟",
    problemBody:
      "الإشراق كيتأثر بالسهر، التوتر، الغذاء، والدورة. لومينورا مكمل عناية من الداخل: كولاجين، فيتامين C، وزنك — باش الوجه يرجع فيه ضوء، والبشرة تحس براسها مغذّية من تحت الماكياج. كيتكامل مع كلاريليا من البرّا.",
    mechanismTitle: "من الداخل كيوصل لفين الكريم ما كيوصلش",
    mechanismBody:
      "الكولاجين كيدعم مظهر التماسك. فيتامين C كيلعب دور فالإشراق الظاهر. الزنك كيدعم البشرة اللي تحت الضغط. هادشي مكمل غذائي / عناية، ماشي دواء، وما كيبدّلش النوم والغذا.",
    unitPriceMad: TIER_PRICES[1],
    crossSellSlugs: ["clarelia", "capilys", "femmelia"],
    upsellAffinity: "clarelia",
    image: "/products/luminora.png",
    heroImage: "/products/luminora/hero.png",
    heroLabel: "صورة المنتج",
    rating: 4.9,
    reviewCount: 174,
    problemTag: "إشراق",
    dailyOrders: 13,
    gallery: [
      { src: "/products/luminora/hero.png", label: "1 · صورة المنتج" },
      { src: "/products/luminora/1.png", label: "2 · المشكلة" },
      { src: "/products/luminora/2.png", label: "3 · التركيبة" },
      { src: "/products/luminora/3.png", label: "4 · الروتين" },
      { src: "/products/luminora/4.png", label: "5 · الإشراق" },
    ],
    ingredients: [
      { name: "Collagen peptides", benefit: "مظهر تماسك ونعومة من الداخل" },
      { name: "Vitamin C", benefit: "إشراق ودعم مضاد للأكسدة" },
      { name: "Zinc", benefit: "بشرة تحت الضغط اليومي" },
      { name: "Saffron micronutrients", benefit: "توقيع سفراسكين — لمسة دافئة" },
    ],
    howToUse: [
      { step: 1, title: "صباح", body: "الجرعة اليومية مع كاس ماء، بعد الفطور إلا كان معدتك حساسة." },
      { step: 2, title: "كل يوم", body: "الإشراق من الداخل كيبان بالالتزام، ماشي نهار وناقص نهار." },
      { step: 3, title: "مع كلاريليا", body: "برّا وداخل. هاد الزوج هو الأكثر منطقية لبنات اللي عندهم بقع وبهتان." },
    ],
    faqs: [
      { q: "واش هادشي دواء؟", a: "لا. مكمل / عناية من الداخل. ما كيعالجش مرض. استشيري طبيبكِ فالحمل أو الأمراض المزمنة." },
      { q: "واش يغني على الكريم؟", a: "لا. كيكمل العناية الخارجية. كلاريليا من البرّا + لومينورا من الداخل." },
      { q: "الريحة والطعم؟", a: "صيغة يومية سهلة. التفاصيل الدقيقة غادي تبان على العلبة ملي تصوّري المنتج." },
      { q: "متى نحس بالفرق؟", a: "غالباً من 3 لـ 6 أسابيع على مستوى الإحساس بالبشرة والضوء فالوجه." },
      { q: "الدفع؟", a: "عند الاستلام، بعد مكالمة التأكيد." },
    ],
    reviews: [
      { name: "إيناس", city: "الرباط", text: "الوجه كان باهت حتى فالويكاند. من بعد شهر حسّيت بالضوء رجع شوية شوية.", stars: 5, photo: "/products/luminora/reviews/1.png" },
      { name: "سناء", city: "الدار البيضاء", text: "خدّامة وسهر. الماسك ما بقاش كيكفي. لومينورا ولا فطوري.", stars: 5, photo: "/products/luminora/reviews/2.png" },
      { name: "غيثة", city: "مراكش", text: "جمّعتها مع كلاريليا. منطقي: بقع من البرّا وضوء من الداخل.", stars: 5, photo: "/products/luminora/reviews/3.png" },
      { name: "وفاء", city: "طنجة", text: "ما حسيتش بجوع ولا غثيان. ساهلة فالاستعمال.", stars: 4, photo: "/products/luminora/reviews/4.png" },
      { name: "رجاء", city: "أكادير", text: "COD واضح. عيطو، أكّدت، ووصلت. بلا تعقيد.", stars: 5, photo: "/products/luminora/reviews/5.png" },
    ],
    comparison: [
      { title: "المدخل", generic: "ماسك كل ليلة وبس", ours: "عناية من الداخل + روتين خارجي" },
      { title: "الوعد", generic: "تبييض فوري", ours: "ضوء تدريجي وصدق فالكلام" },
      { title: "الالتزام", generic: "نهار نزيد نهار ننسى", ours: "جرعة يومية واضحة" },
    ],
    sections: [
      {
        title: "البشرة البااهتة ما كتكذبش",
        body: "الناس كيقولو تعبانة. نتي كتعرفي راسك ناعسة غير شوية. الإشراق كيمشي مع الإيقاع ديال الحياة، وما كيرجعش غير بالكونسيلر.",
        imageLabel: "صورة المشكلة",
        image: "/products/luminora/1.png",
      },
      {
        title: "شنو كدخل، كيبان فالوجه",
        body: "كولاجين، فيتامين C، زنك. مكتوبين. بلا قائمة سحرية من 40 مكون ما كتعرفيش شنو كيديرو.",
        imageLabel: "صورة التركيبة",
        image: "/products/luminora/2.png",
      },
      {
        title: "كس ديال الماء، وخلاص",
        body: "ما كاينش طبخ ولا عصير معقّد. جرعة مع الفطور. المرأة اللي كتسوق الولاد للمدراسة محتاجة هاد المستوى من السهولة.",
        imageLabel: "صورة الروتين",
        image: "/products/luminora/3.png",
      },
      {
        title: "الضوء اللي كيرجع فالتصويرة بلا فيلتر",
        body: "ما كنطلبوش فيلتر جديد. كنطلبو وجه كيشبه ليكِ نهار تكوني مرتاحة. هاد هو الإشراق.",
        imageLabel: "صورة الإشراق",
        image: "/products/luminora/4.png",
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
    q: "واش سفراسكين متجر عام؟",
    a: "لا. أربعة حلول واضحة: الكلف، القوام الأنثوي، سقوط الشعر، والإشراق من الداخل. كل منتج لمشكلة واحدة.",
  },
  {
    q: "كيفاش نخلّص؟",
    a: "الدفع عند الاستلام فقط. ما كاينش تحويل بنكي فالطلب. كنعيّطو ليكِ باش نأكدو العنوان، ومن بعد كنرسلو.",
  },
  {
    q: "علاش كتعيطو قبل التوصيل؟",
    a: "باش العنوان يكون صحيح والطلب يوصل. اللي كتجاوب على التيليفون، الطلبيّة ديالها كتمشي. اللي ما كتجاوبش، كانأخّرو الإرسال.",
  },
  {
    q: "واش كتوصلو لجميع المدن؟",
    a: "نعم — الدار البيضاء، الرباط، مراكش، فاس، طنجة، أكادير، وجميع المدن المغربية.",
  },
  {
    q: "واش التغليف باين شنو داخل؟",
    a: "التغليف محايد. ما كنبانوش المشكلة على الكرتون الخارجي.",
  },
  {
    q: "واش هادشي دواء؟",
    a: "لا. منتجات عناية تجميلية / مكمل عناية. ما كتعالجش الأمراض. استشيري طبيبتكِ فالحمل أو إذا كنتي كتاخدي دواء.",
  },
  {
    q: "شنو ندير إلا ما ناسبنيش؟",
    a: "تواصلي معنا بعد الاستلام. كنفضّلو حل محترم على جدال. التفاصيل فصفحة الإرجاع.",
  },
];

export const HOME_REVIEWS = [
  { name: "سارة", city: "الدار البيضاء", text: "كلاريليا — الكلف ولا أقل حضوراً من بعد شهر.", stars: 5, product: "كلاريليا" },
  { name: "فاطمة", city: "فاس", text: "كابيليس — المغسل ما عادش كيفجّعني كل صباح.", stars: 5, product: "كابيليس" },
  { name: "إيناس", city: "الرباط", text: "لومينورا — الوجه رجع فيه ضوء، بشوية.", stars: 5, product: "لومينورا" },
  { name: "مريم", city: "أكادير", text: "فيميليا — عناية محترمة، بلا إحراج فالكرتون.", stars: 5, product: "فيميليا" },
  { name: "حنان", city: "طنجة", text: "عيطو، أكّدت، وخلّصت عند الباب. ساهل.", stars: 5, product: "سفراسكين" },
];
