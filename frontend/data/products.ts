export const TIER_PRICES = { 1: 279, 2: 349, 3: 419 } as const;
export const FEMMELIA_TIER_PRICES = { 1: 299, 2: 379, 3: 449 } as const;
export const UPSELL_PRICE_MAD = 150;
export const CROSSSELL_PRICE_MAD = TIER_PRICES[1];

export type ProductSlug = "clarelia" | "femmelia" | "capilys" | "luminora";
export type OfferQty = 1 | 2 | 3;
export type TierPrices = Record<OfferQty, number>;

export function getTierPrices(slug: ProductSlug): TierPrices {
  return slug === "femmelia" ? FEMMELIA_TIER_PRICES : TIER_PRICES;
}

export const PRODUCT_SKUS = {
  clarelia: "SK482917CL",
  femmelia: "SK739405FM",
  capilys: "SK156820CP",
  luminora: "SK904371LM",
} as const satisfies Record<ProductSlug, string>;

export type ProductSection = {
  title: string;
  body: string;
  imageLabel: string;
  image: string;
};

export type Ingredient = { name: string; nameAr: string; benefit: string };
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
  headlineAr: string;
  feelingTitle: string;
  formulaLine: string;
  labNote: string;
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
    feeling:
      "كتزيدي طبقة فوندوتان وكتبدّلي الزاوية فالضو، ولكن البقعة كتبقى باينة. بغيتي ترتاحي قدام المرآة بلا ما تثقلي وجهك بالمكياج.",
  },
  {
    id: "femme",
    slug: "femmelia" as const,
    name: "المناطق الأنثوية",
    feeling:
      "بغيتي تحسي بأنوثتك أوضح، بهدوء فالدار — بلا إحراج وبلا كلام رخيص.",
  },
  {
    id: "hair",
    slug: "capilys" as const,
    name: "سقوط الشعر",
    feeling:
      "كتخبي المشط. كتجمعي الشعر بسرعة قبل ما يدخل شي حد للحمام. المغسل كيوجع أكثر من أي تعليق — وكتبغي تحسي بالخصلة عامرة من جديد.",
  },
  {
    id: "glow",
    slug: "luminora" as const,
    name: "الإشراق من الداخل",
    feeling:
      "حتى فنهار الراحة، الوجه باهت والماسك ما كيبقاش كافي. بغيتي ترجعي تشوفي النضارة فوجهك شوية بشوية.",
  },
] as const;

export const PRODUCTS: Product[] = [
  {
    slug: "clarelia",
    sku: PRODUCT_SKUS.clarelia,
    nameAr: "كلاريليا",
    nameEn: "Clarélia",
    headlineAr: "كريم تفتيح الوجه",
    feelingTitle: "الكلف ما كيتغطّاش بالفوندوتان",
    formulaLine: "نياسيناميد · ألفا أربوتين · فيتامين C · مستخلص الزعفران",
    labNote:
      "للكلف اللي كيبان بعد الشمس، الحمل، والدورة. كتهدّي مظهر البقع، ما كتبدّلش لون الوجه.",
    problemTitle: "التصبغات والكلف",
    taglineAr: "البقع كتبان قبل ملامحك. عناية يومية باش يولي لون الوجه أكثر تجانساً مع الوقت.",
    shortDescriptionAr: "كريم تفتيح الوجه · نياسيناميد وأربوتين",
    heroQuote: "الكلف ما كيتغطّاش بالفوندوتان. خاصو روتين ثابت، واقي شمس، وشوية ديال الصبر.",
    problemHook: "كتشوفي البقع قبل ملامح وجهك، وحتى المكياج ما كيغطيهاش مزيان؟",
    problemBody:
      "فالضو الطبيعي، البقع كتشد العين قبل ملامح الوجه. الشمس والتغيّرات الهرمونية يقدرو يزيدو يبيّنوها. كلاريليا داخلة فروتين بسيط كيساعد على توحيد المظهر تدريجياً، مع واقي الشمس والاستعمال المنتظم.",
    mechanismTitle: "شنو كيقع للبقعة؟",
    mechanismBody:
      "نياسيناميد كيهدي الإحمرار ويدعم الحاجز. أربوتين كيستهدف التصبغ الظاهر. فيتامين C كيعاون على تجانس الضوء مع الوقت. طبقة رقيقة: الصباح قبل الواقي، والليل على بشرة نظيفة. بلا واقي، الكلف كيرجع أسرع من أي كريم.",
    unitPriceMad: TIER_PRICES[1],
    crossSellSlugs: ["luminora", "capilys", "femmelia"],
    upsellAffinity: "luminora",
    image: "/products/home/clarelia.webp",
    heroImage: "/products/clarelia/hero.webp",
    heroLabel: "صورة المنتج",
    rating: 4.8,
    reviewCount: 186,
    problemTag: "كلف",
    dailyOrders: 14,
    gallery: [
      { src: "/products/clarelia/hero.webp", label: "1 · قبل وبعد" },
      { src: "/products/clarelia/1.webp", label: "2 · المشكلة" },
      { src: "/products/clarelia/2.webp", label: "3 · النتيجة" },
      { src: "/products/clarelia/3.webp", label: "4 · المنتج" },
    ],
    ingredients: [
      { name: "Niacinamide", nameAr: "نياسيناميد", benefit: "يوحّد المظهر، يهدي الإحمرار الخفيف، ويدعم حاجز البشرة." },
      { name: "Alpha Arbutin", nameAr: "ألفا أربوتين", benefit: "يستهدف البقع الظاهرة بلطف، بلا قساوة على الجلد." },
      { name: "Vitamin C derivative", nameAr: "مشتق فيتامين C", benefit: "إشراق أكثر تجانس مع الالتزام، مناسب للاستعمال اليومي." },
      { name: "Saffron extract", nameAr: "مستخلص الزعفران", benefit: "لمسة عناية دافئة على البشرة، بلا قساوة." },
    ],
    howToUse: [
      { step: 1, title: "صباح", body: "كمية صغيرة على مناطق الكلف. من بعد واقي شمس. الشمس كترجع البقع أسرع من أي حاجة أخرى." },
      { step: 2, title: "ليل", body: "نفس الطبقة على بشرة نظيفة. الالتزام أهم من الكمية — ما تكثّريش باش تسرّعي النتيجة." },
      { step: 3, title: "من 4 إلى 8 أسابيع", body: "البشرة كتبدّل بالدورات. حكمي من بعد شهرين بروتين ثابت، ماشي من بعد ثلاثة أيام." },
    ],
    faqs: [
      { q: "واش كيفتح الوجه؟", a: "كيعاون على توحيد مظهر البشرة وتخفيف شكل البقع، ماشي تغيير لونها الطبيعي. النتيجة تدريجية مع واقي الشمس." },
      { q: "واش يتستعمل مع واقي الشمس؟", a: "خاص يتستعمل معاه. بلا SPF الكلف كيرجع بسرعة تحت الشمس." },
      { q: "الحمل والرضاعة؟", a: "استشيري طبيبتكِ قبل أي روتين جديد. هاد المنتج عناية تجميلية، ماشي دواء." },
      { q: "متى كيبان الفرق؟", a: "غالباً من 4 لـ 8 أسابيع. البقعة ما كتمشيش فثلاثة أيام." },
    ],
    reviews: [
      { name: "سارة", city: "الدار البيضاء", text: "كلف الصيف كان باين بزاف. ما تبدّلش فسبوع، ولكن من بعد شهر حسّيت لون وجهي ولا أكثر تجانساً.", stars: 5, photo: "/products/clarelia/reviews/1.webp" },
      { name: "إيمان", city: "مراكش", text: "كنت كنحاول نغطي البقع بالفوندوتان. دابا كنكتفي بمكياج خفيف وكنحس براسي مرتاحة أكثر.", stars: 5, photo: "/products/clarelia/reviews/2.webp" },
      { name: "ندى", city: "الرباط", text: "بعد الحمل بقات ليا بقع. الروتين ساهل وما فيهوش ريحة قوية.", stars: 5, photo: "/products/clarelia/reviews/3.webp" },
      { name: "لبنى", city: "فاس", text: "ما بقاتش أول حاجة كنشوفها فالضو. هاد الشي اللي كنت باغاه.", stars: 5, photo: "/products/clarelia/reviews/4.webp" },
      { name: "حنان", city: "طنجة", text: "كنت كنخبي الزاوية فالتيليفون. دابا كنصوّر عادي.", stars: 5, photo: "/products/clarelia/reviews/5.webp" },
    ],
    comparison: [
      { title: "الوعد", generic: "تبييض فأيام", ours: "توحيد تدريجي مع الالتزام والواقي" },
      { title: "الصيغة", generic: "كريم عام لكل شي", ours: "مركّزة على الكلف والبقع الظاهرة" },
      { title: "الشمس", generic: "الواقي كيتنسى", ours: "واقي الشمس جزء ضروري من الروتين" },
    ],
    sections: [
      {
        title: "الضو كيبان البقع قبل الوجه",
        body: "فالتصويرة والضو الطبيعي، البقعة كتبقى باينة مهما زدتي من الفوندوتان. الهدف هو ترجعي مرتاحة بوجه أخف ومظهر أكثر تجانساً.",
        imageLabel: "صورة المشكلة",
        image: "/products/clarelia/1.webp",
      },
      {
        title: "كل مكوّن على البقعة",
        body: "نياسيناميد للحاجز. أربوتين للتصبغ الظاهر. فيتامين C للتجانس. زعفران للمسّة الدافئة. الخدمة كتجي من الطبقة كل نهار، ماشي من كثرة المنتجات.",
        imageLabel: "صورة التركيبة",
        image: "/products/clarelia/3.webp",
      },
      {
        title: "دقيقة الصباح، دقيقة الليل",
        body: "طبقة قبل الواقي. طبقة قبل النعاس. الكلف كيرجع إلا نسيتي الشمس. الالتزام أهم من الكمية.",
        imageLabel: "صورة الروتين",
        image: "/products/clarelia/3.webp",
      },
      {
        title: "تجانس كيبان، ماكياج أقل",
        body: "البقع أقل حضوراً تحت الضوء. الوجه أقرب ليكِ نهار تكوني مرتاحة. من 4 لـ 8 أسابيع، مع الواقي.",
        imageLabel: "صورة الإحساس",
        image: "/products/clarelia/2.webp",
      },
    ],
  },
  {
    slug: "femmelia",
    sku: PRODUCT_SKUS.femmelia,
    nameAr: "فيميليا",
    nameEn: "Femmélia",
    headlineAr: "زيادة المناطق الأنثوية · 60 كبسولة",
    feelingTitle: "عناية بأنوثتك، بهدوء وبلا إحراج",
    formulaLine: "حلبة · ماكا · زيت زهرة الربيع · عناية بالببتيدات",
    labNote:
      "60 كبسولة لعناية أنثوية من الداخل. للمظهر، ماشي دواء.",
    problemTitle: "المناطق الأنثوية",
    taglineAr: "روتين يومي بسيط للمظهر الأنثوي، بخصوصية وبدون كلام زايد.",
    shortDescriptionAr: "60 كبسولة · عناية للمناطق الأنثوية · روتين يومي",
    heroQuote: "أنوثتكِ ما محتاجاش إعلان. محتاجة عناية هادئة تلتزمي بيها.",
    problemHook: "بغيتي تهتمي بمظهرك الأنثوي بخصوصية، بلا إحراج وبلا وعود مبالغ فيها؟",
    problemBody:
      "هاد النوع ديال العناية خاصو الخصوصية والوضوح. فيميليا فيها 60 كبسولة لروتين يومي ساهل، والنتيجة كتحتاج الاستمرار لأسابيع، ماشي وعود سريعة فثلاثة أيام.",
    mechanismTitle: "عناية من الداخل للمظهر",
    mechanismBody:
      "الصيغة كتجمع الحلبة، الماكا وزهرة الربيع فمكمل يومي للمظهر الأنثوي والحيوية. خدي الجرعة المكتوبة على العلبة مع الأكل وكاس ماء.",
    unitPriceMad: FEMMELIA_TIER_PRICES[1],
    crossSellSlugs: ["clarelia", "luminora", "capilys"],
    upsellAffinity: "clarelia",
    image: "/products/home/femmelia.webp",
    heroImage: "/products/femmelia/hero.webp",
    heroLabel: "صورة المنتج",
    rating: 4.7,
    reviewCount: 142,
    problemTag: "أنوثة",
    dailyOrders: 11,
    gallery: [
      { src: "/products/femmelia/hero.webp", label: "1 · قبل وبعد" },
      { src: "/products/femmelia/1.webp", label: "2 · المشكلة" },
      { src: "/products/femmelia/2.webp", label: "3 · النتيجة" },
      { src: "/products/femmelia/3.webp", label: "4 · المنتج" },
    ],
    ingredients: [
      { name: "Fenugreek extract", nameAr: "مستخلص الحلبة", benefit: "ذاكرة عناية أنثوية تقليدية، مكتوبة بصيغة كبسولة هادئة." },
      { name: "Maca", nameAr: "ماكا", benefit: "يدعم الإحساس بالحيوية اليومية مع الالتزام." },
      { name: "Evening primrose", nameAr: "زيت زهرة الربيع", benefit: "عناية أنثوية من الداخل، بلا تهويل." },
      { name: "Peptide care complex", nameAr: "مركّب عناية بالببتيدات", benefit: "يكمل الصيغة لدعم المظهر مع الروتين الثابت." },
    ],
    howToUse: [
      { step: 1, title: "مع الأكل", body: "خدي من 1 حتى 2 كبسولات يومياً حسب الجرعة المكتوبة على العلبة، مع كاس ماء." },
      { step: 2, title: "60 كبسولة", body: "العلبة فيها 60 كبسولة، ومدة الاستعمال كتختلف حسب الجرعة اليومية." },
      { step: 3, title: "8 إلى 12 أسبوع", body: "المظهر ما كيتحوّلش فسيمانة. اللي كيلتزم كيشوف الفرق بالأسابيع." },
    ],
    faqs: [
      { q: "واش هادشي دواء؟", a: "لا. مكمل عناية للمظهر الأنثوي. ما كيعوّضش استشارة طبية." },
      { q: "الحمل؟", a: "استشيري طبيبتكِ. ما كنصحوش بالتجريب من راسكِ فهاد الفترة." },
      { q: "علاش 3 علب؟", a: "العناية كتحتاج أسابيع من الاستمرار. علبة للبداية، وثلاث علب كيعطيو مدة أطول للروتين." },
    ],
    reviews: [
      { name: "مريم", city: "الدار البيضاء", text: "ما حسّيتش براسي سلعة. بقيت على الروتين بهدوء.", stars: 5, photo: "/products/femmelia/reviews/1.webp" },
      { name: "أمينة", city: "أكادير", text: "كبسولة ساهلة. حسّيت براسي مهتمّة بأنوثتي بلا دراما.", stars: 5, photo: "/products/femmelia/reviews/2.webp" },
      { name: "ياسمين", city: "سلا", text: "هاد الموضوع كان كيحرجني حتى مع راسي. دابا كملت بلا توتر.", stars: 5, photo: "/products/femmelia/reviews/3.webp" },
      { name: "إكرام", city: "وجدة", text: "طلبت علبتين. من بعد أسابيع الإحساس ولا أوضح.", stars: 4, photo: "/products/femmelia/reviews/4.webp" },
      { name: "خديجة", city: "مكناس", text: "ماشي معجزة، ولكن الإحساس ولا أهدى من بعد أسابيع.", stars: 5, photo: "/products/femmelia/reviews/5.webp" },
    ],
    comparison: [
      { title: "الأسلوب", generic: "كلام محرج", ours: "عناية هادئة قدام راسك" },
      { title: "الوعد", generic: "نتيجة فثلاثة أيام", ours: "روتين أسابيع بالكبسولة" },
      { title: "الإحساس", generic: "ضغط وتصوير", ours: "ثقة تبنى شوية شوية" },
    ],
    sections: [
      {
        title: "هاد الموضوع يستاهل هدوء",
        body: "بغيتي تحسي بأنوثتك أوضح، بلا ما يولّي الموضوع رخيص. الخصوصية هنا هي الإحساس: كتكميلي فالدار، قدام راسك، بلا دراما.",
        imageLabel: "صورة المشكلة",
        image: "/products/femmelia/1.webp",
      },
      {
        title: "الحلبة والماكا للمظهر",
        body: "حلبة، ماكا، وزهرة الربيع بصيغة كبسولة. كيدعمو المظهر الأنثوي مع الالتزام. ما كيبدّلوش الطب، وما كيعوّضوش الصبر.",
        imageLabel: "صورة التركيبة",
        image: "/products/femmelia/3.webp",
      },
      {
        title: "مع الأكل وكاس ماء",
        body: "خدي الجرعة المكتوبة على العلبة مع الفطور أو الغداء. روتين بسيط باش تقدري تواصلي عليه.",
        imageLabel: "صورة الروتين",
        image: "/products/femmelia/3.webp",
      },
      {
        title: "الثقة اللي كترجع ليكِ",
        body: "الهدف تحسي براسكِ مرتاحة قدام راسك. هاد الإحساس كيبني بالأسابيع، ماشي بتصويرة.",
        imageLabel: "صورة الإحساس",
        image: "/products/femmelia/2.webp",
      },
    ],
  },
  {
    slug: "capilys",
    sku: PRODUCT_SKUS.capilys,
    nameAr: "كابيليس",
    nameEn: "Capilys",
    headlineAr: "زيت تساقط الشعر · 60 مل",
    feelingTitle: "كل مشطة كتخلّي شعر أكثر فالمغسل",
    formulaLine: "كافيين · إكليل الجبل · بيوتين · زيوت عناية بالفروة",
    labNote:
      "زيت 60 مل مكتوب للفروة أولاً: كيتدهن فين كاين الجذر. الكثافة كترجع بالروتين، ماشي بتبديل الشامبوان.",
    problemTitle: "سقوط الشعر",
    taglineAr: "زيت للفروة والجذور، باش تعتني بمظهر الكثافة وتخففي إحساس التساقط مع الاستمرار.",
    shortDescriptionAr: "زيت فروة 60 مل · كافيين وإكليل الجبل",
    heroQuote: "الشعرة اللي فالمغسل كتهضر قبل أي تعليق. العناية خاصها تبدا من الجذر.",
    problemHook: "كتشوفي الشعر فالمشط والمغسل أكثر من قبل، وولات الكثافة كاتقلقك؟",
    problemBody:
      "التساقط يقدر يزيد مع التوتر، تبدّل الفصول أو بعد الولادة. والعناية ما خاصهاش تبقى غير فالشامبوان والأطراف. كابيليس كيتستعمل مباشرة على الفروة والجذور بروتين ثابت وساهل.",
    mechanismTitle: "الفروة هي الأرض. الشعر كينبت منها.",
    mechanismBody:
      "إلا الفروة ضعيفة، الخصلة كيبان خاوية مهما بدّلتي الشامبوان. الكافيين كينشّط مظهر الفروة. إكليل الجبل عناية معروفة على الجذر. البيوتين كيدعم مظهر الشعرة. دقيقة دلّك بعد الدوش — هاد الدقيقة جزء من الروتين.",
    unitPriceMad: TIER_PRICES[1],
    crossSellSlugs: ["luminora", "clarelia", "femmelia"],
    upsellAffinity: "luminora",
    image: "/products/home/capilys.webp",
    heroImage: "/products/capilys/hero.webp",
    heroLabel: "صورة المنتج",
    rating: 4.8,
    reviewCount: 209,
    problemTag: "شعر",
    dailyOrders: 16,
    gallery: [
      { src: "/products/capilys/hero.webp", label: "1 · قبل وبعد" },
      { src: "/products/capilys/1.webp", label: "2 · المشكلة" },
      { src: "/products/capilys/2.webp", label: "3 · النتيجة" },
      { src: "/products/capilys/3.webp", label: "4 · المنتج" },
    ],
    ingredients: [
      { name: "Caffeine", nameAr: "كافيين", benefit: "ينشّط مظهر الفروة ويخفّف الإحساس بالخمول عند الجذر." },
      { name: "Rosemary extract", nameAr: "مستخلص إكليل الجبل", benefit: "عناية تقليدية معروفة، بصيغة زيت على الفروة." },
      { name: "Topical biotin complex", nameAr: "بيوتين", benefit: "يدعم مظهر الشعرة من الجذر مع الاستعمال الثابت." },
      { name: "Scalp care oils", nameAr: "زيوت عناية بالفروة", benefit: "يحمل الصيغة للجذر ويخلي التدليك ساهل كل ليلة." },
    ],
    howToUse: [
      { step: 1, title: "على الفروة", body: "شعر ناشف أو رطب خفيف. قطرات على الخطوط، وماشي غير على طول الشعر. القارورة 60 مل." },
      { step: 2, title: "دلّكي دقيقة", body: "أطراف الصبع، بلطف. الدورة الدموية جزء من الروتين بحال الزيت." },
      { step: 3, title: "90 يوم", body: "دورة الشعر بطيئة. قارورة للبداية، و3 للبروتوكول الكامل." },
    ],
    faqs: [
      { q: "واش كيرجع الشعر من الصفر؟", a: "كنهدرو على مظهر الكثافة وتقليل التساقط اليومي. الصلع المرضي خاصو طبيب." },
      { q: "واش كيثقّل الشعر؟", a: "الزيت كيتدهن على الفروة بقطرات. ما تغرقيش الخصلة — الكمية الصغيرة كافية." },
      { q: "بعد الولادة؟", a: "التساقط بعد الولادة شائع. الروتين كيساعد، ومع ذلك استشيري طبيبتكِ إلا كان التساقط حاد." },
      { q: "واش للمرأة فقط؟", a: "الصيغة موجّهة لعناية المرأة وفروة متعبة. القرار ليكِ." },
    ],
    reviews: [
      { name: "فاطمة", city: "الدار البيضاء", text: "المغسل كان كيخوفني. من بعد شهر حسّيت التساقط قلّ، والشعر ولا أهدى.", stars: 5, photo: "/products/capilys/reviews/1.webp" },
      { name: "سلمى", city: "تطوان", text: "بعد الولادة طاح لي بزاف. ما رجعش بحال الأول بسرعة، ولكن الكثافة بدات تبان.", stars: 5, photo: "/products/capilys/reviews/2.webp" },
      { name: "هدى", city: "القنيطرة", text: "الريحة خفيفة والزيت على الفروة ساهل. هاد الشي اللي خلّاني نكمل.", stars: 5, photo: "/products/capilys/reviews/3.webp" },
      { name: "نورة", city: "الجديدة", text: "طلبت 3 علب من اللولة. عرفت أن الشعر كياخد وقت.", stars: 5, photo: "/products/capilys/reviews/4.webp" },
      { name: "أسماء", city: "فاس", text: "ما بقاتش كل مشطة كتخوفني بحال الأول.", stars: 5, photo: "/products/capilys/reviews/5.webp" },
    ],
    comparison: [
      { title: "التركيز", generic: "شامبوان يتبدّل كل سيمانة", ours: "زيت فروة 60 مل بروتين ثابت" },
      { title: "الوقت", generic: "وعد فسبوعة", ours: "دورة شعر: أسابيع إلى 90 يوم" },
      { title: "الاستعمال", generic: "كمية كبيرة على الخصلة", ours: "قطرات على الجذر وتدليك" },
    ],
    sections: [
      {
        title: "الشعرة فالمغسل كتوجع أكثر من أي تعليق",
        body: "كتخبي المشط. كتجمعي الشعر بسرعة قبل ما يدخل شي حد للحمام. التساقط كيبان كل صباح — والفروة هي اللي كتستاهل العناية، ماشي غير الأطراف.",
        imageLabel: "صورة المشكلة",
        image: "/products/capilys/1.webp",
      },
      {
        title: "الكافيين وإكليل الجبل على الجذر",
        body: "كافيين، إكليل الجبل، بيوتين، وزيوت عناية. كلهم كيمشيو للفروة. الكثافة كترجع بالأسابيع، ماشي بشامبوان جديد كل سيمانة.",
        imageLabel: "صورة التركيبة",
        image: "/products/capilys/3.webp",
      },
      {
        title: "دقيقة بعد الدوش",
        body: "قطرات على الخطوط. دلّكي. كمّلي ليلتك. الشعر كياخد وقت — الروتين خاصو يكون ساهل باش تكمّليه.",
        imageLabel: "صورة الروتين",
        image: "/products/capilys/3.webp",
      },
      {
        title: "الخصلة اللي كترجع عامرة",
        body: "الهدف هو يبان الشعر أكثر كثافة وتولي الخصلة عامرة مع الوقت. النتيجة كتحتاج روتين ثابت وصبر على دورة نمو الشعر.",
        imageLabel: "صورة الكثافة",
        image: "/products/capilys/2.webp",
      },
    ],
  },
  {
    slug: "luminora",
    sku: PRODUCT_SKUS.luminora,
    nameAr: "لومينورا",
    nameEn: "Luminora",
    headlineAr: "كولاجين بحري · 30 كبسولة",
    feelingTitle: "الماسك كيدوز والوجه باقي باهت",
    formulaLine: "كولاجين بحري · فيتامين C · زنك · عناصر دقيقة من الزعفران",
    labNote:
      "30 كبسولة كولاجين بحري. كتكمّل الكريم، ما كتعوّضوش — عناية من الداخل للوجه اللي الماسك ما عادش كيكفيه.",
    problemTitle: "الإشراق من الداخل",
    taglineAr: "كولاجين بحري مع فيتامين C والزنك، لعناية يومية بالنضارة من الداخل.",
    shortDescriptionAr: "كولاجين بحري 30 كبسولة · فيتامين C وزنك",
    heroQuote: "الضو اللي كينقص من الوجه غالباً ما كينقصش من الكريم بوحدو.",
    problemHook: "كتديري ماسك ولكن وجهك باقي باهت، وحتى نهار الراحة ما كتبانش فيه النضارة؟",
    problemBody:
      "السهر والتوتر والإيقاع اليومي يقدرو يخلّيو الوجه باهت. العناية الخارجية مهمة، ولكن الروتين من الداخل يقدر يكملها. لومينورا كتدخل بسهولة مع الفطور: كبسولة وكاس ماء كل يوم.",
    mechanismTitle: "من الداخل كيوصل لفين الطبقة ما كتوصلش",
    mechanismBody:
      "الكولاجين البحري كيدعم مظهر النعومة والتماسك. فيتامين C للضوء الظاهر. الزنك للبشرة اللي تحت السهر والإيقاع. كبسولة مع الفطور، كل يوم. العلبة 30 كبسولة.",
    unitPriceMad: TIER_PRICES[1],
    crossSellSlugs: ["clarelia", "capilys", "femmelia"],
    upsellAffinity: "clarelia",
    image: "/products/home/luminora.webp",
    heroImage: "/products/luminora/hero.webp",
    heroLabel: "صورة المنتج",
    rating: 4.9,
    reviewCount: 174,
    problemTag: "إشراق",
    dailyOrders: 13,
    gallery: [
      { src: "/products/luminora/hero.webp", label: "1 · قبل وبعد" },
      { src: "/products/luminora/1.webp", label: "2 · المشكلة" },
      { src: "/products/luminora/2.webp", label: "3 · النتيجة" },
      { src: "/products/luminora/3.webp", label: "4 · المنتج" },
    ],
    ingredients: [
      { name: "Marine collagen", nameAr: "كولاجين بحري", benefit: "مظهر تماسك ونعومة كيتغذى من الداخل مع الالتزام." },
      { name: "Vitamin C", nameAr: "فيتامين C", benefit: "إشراق ظاهر ودعم مضاد للأكسدة للبشرة المتعبة." },
      { name: "Zinc", nameAr: "زنك", benefit: "عناية بالبشرة اللي تحت ضغط السهر والإيقاع اليومي." },
      { name: "Saffron micronutrients", nameAr: "عناصر دقيقة من الزعفران", benefit: "دفء هادئ فالعناية من الداخل." },
    ],
    howToUse: [
      { step: 1, title: "كبسولة مع الفطور", body: "كل يوم مع كاس ماء. إلا معدتك حساسة، بعد الأكل أهدى. العلبة 30 كبسولة." },
      { step: 2, title: "كل يوم", body: "الإشراق من الداخل كيبان بالثبات، ماشي نهار وناقص نهار." },
      { step: 3, title: "مع كريم التفتيح", body: "برّا وداخل. منطقي لبنات اللي عندهم بقع وبهتان في نفس الوقت." },
    ],
    faqs: [
      { q: "واش هادشي دواء؟", a: "لا. مكمل غذائي للعناية من الداخل، وما كيعالج حتى مرض. استشيري طبيبكِ فالحمل أو الأمراض المزمنة." },
      { q: "واش يغني على الكريم؟", a: "لا. كيكمل العناية الخارجية. كريم تفتيح الوجه من البرّا + الكولاجين البحري من الداخل." },
      { q: "الريحة والطعم؟", a: "صيغة يومية سهلة. التفاصيل الدقيقة كتكون على العلبة." },
      { q: "متى نحس بالفرق؟", a: "غالباً من 3 لـ 6 أسابيع على مستوى الإحساس بالبشرة والضوء فالوجه." },
    ],
    reviews: [
      { name: "إيناس", city: "الرباط", text: "الوجه كان باهت حتى فالويكاند. من بعد شهر حسّيت بالضوء رجع شوية شوية.", stars: 5, photo: "/products/luminora/reviews/1.webp" },
      { name: "سناء", city: "الدار البيضاء", text: "خدمة وسهر، والماسك ما بقاش كافي. الكبسولة ولات جزء من فطوري كل صباح.", stars: 5, photo: "/products/luminora/reviews/2.webp" },
      { name: "غيثة", city: "مراكش", text: "جمّعتها مع كريم التفتيح. منطقي: بقع من البرّا وضوء من الداخل.", stars: 5, photo: "/products/luminora/reviews/3.webp" },
      { name: "وفاء", city: "طنجة", text: "ما حسيتش بجوع ولا غثيان. ساهلة فالاستعمال.", stars: 4, photo: "/products/luminora/reviews/4.webp" },
      { name: "رجاء", city: "أكادير", text: "ما بقاتش أول كلمة كسمعها: تعبانة.", stars: 5, photo: "/products/luminora/reviews/5.webp" },
    ],
    comparison: [
      { title: "المدخل", generic: "ماسك كل ليلة وبس", ours: "عناية من الداخل + روتين خارجي" },
      { title: "الوعد", generic: "تبييض فوري", ours: "ضوء تدريجي وصدق فالكلام" },
      { title: "الالتزام", generic: "نهار نزيد نهار ننسى", ours: "جرعة يومية واضحة مع الفطور" },
    ],
    sections: [
      {
        title: "البشرة الباهتة ما كتكذبش",
        body: "الناس كيقولو تعبانة. الوجه باهت حتى نهار الراحة. الماسك كيدوز، والكونسيلر كيغطي، والضوء باقي ناقص من الداخل.",
        imageLabel: "صورة المشكلة",
        image: "/products/luminora/1.webp",
      },
      {
        title: "كولاجين وفيتامين C من الداخل",
        body: "كولاجين بحري للتماسك. فيتامين C للضوء. زنك للبشرة اللي تحت السهر. 30 كبسولة — شهر مع الفطور.",
        imageLabel: "صورة التركيبة",
        image: "/products/luminora/3.webp",
      },
      {
        title: "كبسولة مع الفطور",
        body: "كاس ماء، وخلاص. الإشراق من الداخل كيبان بالثبات، ماشي نهار وناقص نهار.",
        imageLabel: "صورة الروتين",
        image: "/products/luminora/3.webp",
      },
      {
        title: "وجه كيشبه ليكِ نهار الراحة",
        body: "الضوء كيرجع شوية شوية. إلا كانت البقع جزء من القصة، كريم التفتيح من البرّا كيكمل هاد الإحساس.",
        imageLabel: "صورة الإشراق",
        image: "/products/luminora/2.webp",
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
    q: "شنو الفرق بين الروتينات؟",
    a: "الروتين الكامل فيه الأربع صيغ بـ 699 درهم مغربي. روتين الوجه والشعر فيه التفتيح والتساقط والكولاجين بـ 549 درهم مغربي — بلا كبسول المناطق الأنثوية.",
  },
  {
    q: "كيفاش نخلّص؟",
    a: "الدفع عند الاستلام. كنعيّطو ليكِ باش نأكدو العنوان، ومن بعد كنرسلو.",
  },
  {
    q: "علاش كتعيطو قبل التوصيل؟",
    a: "باش العنوان يكون صحيح والطلب يوصل.",
  },
  {
    q: "واش كتوصلو لجميع المدن؟",
    a: "نعم. العنوان كنأكّدوه فالمكالمة قبل الإرسال.",
  },
  {
    q: "واش هادشي دواء؟",
    a: "لا. عناية تجميلية / مكمل عناية. استشيري طبيبتكِ فالحمل.",
  },
];

export const HOME_REVIEWS = [
  { name: "سارة", city: "الدار البيضاء", text: "كنت كنغطي الكلف بالفوندوتان حتى فالدار. ما تبدّلش فسبوع، ولكن من بعد شهر حسّيت وجهي أكثر تجانساً فالضو.", stars: 5, product: "كلف" },
  { name: "فاطمة", city: "فاس", text: "المغسل كان كيخوفني. الزيت على الفروة، ومن بعد أسابيع التساقط ولا أقل.", stars: 5, product: "شعر" },
  { name: "إيناس", city: "الرباط", text: "الناس كانو كيقولو تعبانة. كبسولة الكولاجين مع الفطور، والضوء رجع شوية شوية.", stars: 5, product: "إشراق" },
  { name: "مريم", city: "أكادير", text: "عجبني الهدوء. التغليف ما هضرش، والكبسولة خلّاتني نكمّل بلا إحراج.", stars: 5, product: "أنوثة" },
  { name: "حنان", city: "طنجة", text: "عيطو، أكّدت، وخلّصت عند الباب. حسّيت بالطلب محترم بحال العلبة.", stars: 5, product: "COD" },
];
