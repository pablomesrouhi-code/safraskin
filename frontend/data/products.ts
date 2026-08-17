export const TIER_PRICES = { 1: 219, 2: 279, 3: 319 } as const;
export const UPSELL_PRICE_MAD = 120;
export const CROSSSELL_PRICE_MAD = TIER_PRICES[1];

export type ProductSlug = "clarelia" | "femmelia" | "capilys" | "luminora";
export type OfferQty = 1 | 2 | 3;

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
      "كتزيدي طبقة فوندو، وكتعاودي الزاوية فالضو، والبقعة باقة ثمّا. الكلف ما كيحشم من الماكياج — وكتبغي تحسي براسكِ مرتاحة قدام المرآة، بلا ما تثقلي الوجه.",
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
      "الناس كيقولو تعبانة. نتي كتعرفي راسكِ. الوجه باهت حتى نهار الراحة، والماسك كيدوز وما كيبدّل والو. الضوء كينقص من الداخل.",
  },
] as const;

export const PRODUCTS: Product[] = [
  {
    slug: "clarelia",
    sku: PRODUCT_SKUS.clarelia,
    nameAr: "كلاريليا",
    nameEn: "Clarélia",
    headlineAr: "كريم تفتيح الوجه",
    feelingTitle: "الكلف ما كيتخباش تحت الفوندو",
    formulaLine: "نياسيناميد · ألفا أربوتين · فيتامين C · مستخلص الزعفران",
    labNote:
      "للكلف اللي كيبان بعد الشمس، الحمل، والدورة. كتهدّي مظهر البقع، ما كتبدّلش لون الوجه.",
    problemTitle: "التصبغات والكلف",
    taglineAr: "كتشوفي البقع قبل الوجه. كتزيدي فوندو، وكتعاودي الزاوية — وهو باقي باين.",
    shortDescriptionAr: "كريم تفتيح الوجه · نياسيناميد وأربوتين",
    heroQuote: "الكلف ما كيتخباش تحت الفوندو. كيتتعامل معاه بصيغة، وبواقي شمس، وبصبر.",
    problemHook: "كتشوفي البقع فالمرآة، وكتزيدي طبقة ماكياج… وهو باقي باين؟",
    problemBody:
      "الضو كيبان البقع قبل ما يبان الوجه. كتبدّلي الزاوية فالتصويرة، وكتثقلي الفوندو، وهو باقي ثمّا. الشمس والحمل والدورة كيرجعوه حتى من بعد ما تظنّي مشى. هاد الإحساس هو اللي جات ليه الصيغة: تهدّي مظهر الكلف، وترجعي ترتاحي قدام المرآة.",
    mechanismTitle: "شنو كيقع للبقعة؟",
    mechanismBody:
      "نياسيناميد كيهدي الإحمرار ويدعم الحاجز. أربوتين كيستهدف التصبغ الظاهر. فيتامين C كيعاون على تجانس الضوء مع الوقت. طبقة رقيقة: الصباح قبل الواقي، والليل على بشرة نظيفة. بلا واقي، الكلف كيرجع أسرع من أي كريم.",
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
      { q: "واش كييّض الوجه؟", a: "كنهدرو على تفتيح وتوحيد المظهر — ماشي تغيير لون البشرة. النتيجة تدريجية مع الواقي." },
      { q: "واش يتستعمل مع واقي الشمس؟", a: "خاص يتستعمل معاه. بلا SPF الكلف كيرجع بسرعة تحت الشمس." },
      { q: "الحمل والرضاعة؟", a: "استشيري طبيبتكِ قبل أي روتين جديد. هاد المنتج عناية تجميلية، ماشي دواء." },
      { q: "متى كيبان الفرق؟", a: "غالباً من 4 لـ 8 أسابيع. البقعة ما كتمشيش فثلاثة أيام." },
    ],
    reviews: [
      { name: "سارة", city: "الدار البيضاء", text: "كلف الصيف كان باين بزاف. ما تبدّلتش فسبوع، ولكن من بعد شهر الوجه ولا أكثر تجانس.", stars: 5, photo: "/products/clarelia/reviews/1.png" },
      { name: "إيمان", city: "مراكش", text: "مراكش والشمس… كنت كنغطي بالفون. دابا كنخرج بروج خفيف وكنحس براسي مرتاحة.", stars: 5, photo: "/products/clarelia/reviews/2.png" },
      { name: "ندى", city: "الرباط", text: "بعد الحمل بقات ليا بقع. الروتين ساهل وما فيهوش ريحة قوية.", stars: 5, photo: "/products/clarelia/reviews/3.png" },
      { name: "لبنى", city: "فاس", text: "ما بقاتش أول حاجة كنشوفها فالضو. هاد الشي اللي كنت باغاه.", stars: 5, photo: "/products/clarelia/reviews/4.png" },
      { name: "حنان", city: "طنجة", text: "كنت كنخبي الزاوية فالتيليفون. دابا كنصوّر عادي.", stars: 5, photo: "/products/clarelia/reviews/5.png" },
    ],
    comparison: [
      { title: "الوعد", generic: "تبييض فأيام", ours: "توحيد تدريجي مع الالتزام والواقي" },
      { title: "الصيغة", generic: "كريم عام لكل شي", ours: "مركّزة على الكلف والبقع الظاهرة" },
      { title: "الشمس", generic: "الواقي كيتنسى", ours: "الروتين كيحسب SPF ضروري" },
    ],
    sections: [
      {
        title: "الضو كيبان البقع قبل الوجه",
        body: "التصويرة كتخون. كتبدّلي الزاوية. وكتزيدي طبقة. البقعة ما كتحشم من الماكياج. اللي بغيتيه هو ترتاحي فالضو الطبيعي، بلا ما تثقلي الوجه.",
        imageLabel: "صورة المشكلة",
        image: "/products/clarelia/1.png",
      },
      {
        title: "كل مكوّن على البقعة",
        body: "نياسيناميد للحاجز. أربوتين للتصبغ الظاهر. فيتامين C للتجانس. زعفران للمسّة الدافئة. الخدمة كتجي من الطبقة كل نهار، ماشي من كثرة المنتجات.",
        imageLabel: "صورة التركيبة",
        image: "/products/clarelia/2.png",
      },
      {
        title: "دقيقة الصباح، دقيقة الليل",
        body: "طبقة قبل الواقي. طبقة قبل النعاس. الكلف كيرجع إلا نسيتي الشمس. الالتزام أهم من الكمية.",
        imageLabel: "صورة الروتين",
        image: "/products/clarelia/3.png",
      },
      {
        title: "تجانس كيبان، ماكياج أقل",
        body: "البقع أقل حضوراً تحت الضوء. الوجه أقرب ليكِ نهار تكوني مرتاحة. من 4 لـ 8 أسابيع، مع الواقي.",
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
    headlineAr: "زيادة المناطق الأنثوية · 60 كبسولة",
    feelingTitle: "بغيتي تحسي بأنوثتكِ أوضح… بلا إحراج",
    formulaLine: "حلبة · ماكا · زيت زهرة الربيع · عناية بالببتيدات",
    labNote:
      "60 كبسولة لعناية أنثوية من الداخل. للمظهر، ماشي دواء.",
    problemTitle: "المناطق الأنثوية",
    taglineAr: "بغيتي تحسي بأنوثتك أوضح… بهدوء، فالدار، بلا إحراج.",
    shortDescriptionAr: "60 كبسولة · عناية للمناطق الأنثوية · روتين يومي",
    heroQuote: "أنوثتكِ ما محتاجاش إعلان. محتاجة عناية هادئة تلتزمي بيها.",
    problemHook: "بغيتي تحسي بالمناطق الأنثوية أوضح… بلا كلام زايد وبلا إحراج؟",
    problemBody:
      "هاد الموضوع كيجي بهدوء: بغيتي تحسي براسكِ أنثوية أكثر، قدام راسك، بلا ما يولّي كلام رخيص. 60 كبسولة، كبسولتين مع الأكل، وأسابيع من الالتزام. الإحساس كيبني شوية شوية — ماشي فثلاثة أيام.",
    mechanismTitle: "عناية من الداخل للمظهر",
    mechanismBody:
      "الحلبة ذاكرة عناية أنثوية معروفة. الماكا كتدعم الحيوية اليومية. زهرة الربيع عناية هادئة. الببتيدات كيكملو الصيغة. كبسولتين فالنهار، والعلبة تكفي شهراً تقريباً.",
    unitPriceMad: TIER_PRICES[1],
    crossSellSlugs: ["clarelia", "luminora", "capilys"],
    upsellAffinity: "clarelia",
    image: "/products/femmelia.png",
    heroImage: "/products/femmelia/hero.png",
    heroLabel: "صورة المنتج",
    rating: 4.7,
    reviewCount: 142,
    problemTag: "أنوثة",
    dailyOrders: 11,
    gallery: [
      { src: "/products/femmelia/hero.png", label: "1 · صورة المنتج" },
      { src: "/products/femmelia/1.png", label: "2 · المشكلة" },
      { src: "/products/femmelia/2.png", label: "3 · التركيبة" },
      { src: "/products/femmelia/3.png", label: "4 · الروتين" },
      { src: "/products/femmelia/4.png", label: "5 · الإحساس" },
    ],
    ingredients: [
      { name: "Fenugreek extract", nameAr: "مستخلص الحلبة", benefit: "ذاكرة عناية أنثوية تقليدية، مكتوبة بصيغة كبسولة هادئة." },
      { name: "Maca", nameAr: "ماكا", benefit: "يدعم الإحساس بالحيوية اليومية مع الالتزام." },
      { name: "Evening primrose", nameAr: "زيت زهرة الربيع", benefit: "عناية أنثوية من الداخل، بلا تهويل." },
      { name: "Peptide care complex", nameAr: "مركّب عناية بالببتيدات", benefit: "يكمل الصيغة لدعم المظهر مع الروتين الثابت." },
    ],
    howToUse: [
      { step: 1, title: "كبسولتين مع الأكل", body: "كل يوم، مع الفطور أو الغداء، وكاس ماء. الثبات أهم من الزيادة." },
      { step: 2, title: "60 كبسولة", body: "العلبة تكفي شهراً تقريباً بروتين كبسولتين فالنهار." },
      { step: 3, title: "8 إلى 12 أسبوع", body: "المظهر ما كيتحوّلش فسيمانة. اللي كيلتزم كيشوف الفرق بالأسابيع." },
    ],
    faqs: [
      { q: "واش هادشي دواء؟", a: "لا. مكمل عناية للمظهر الأنثوي. ما كيعوّضش استشارة طبية." },
      { q: "الحمل؟", a: "استشيري طبيبتكِ. ما كنصحوش بالتجريب من راسكِ فهاد الفترة." },
      { q: "علاش 3 علب؟", a: "الإحساس كياخد أسابيع. علبة للبداية، والثلاث كيعطيو وقت كافي." },
    ],
    reviews: [
      { name: "مريم", city: "الدار البيضاء", text: "ما حسّيتش براسي سلعة. بقيت على الروتين بهدوء.", stars: 5, photo: "/products/femmelia/reviews/1.png" },
      { name: "أمينة", city: "أكادير", text: "كبسولة ساهلة. حسّيت براسي مهتمّة بأنوثتي بلا دراما.", stars: 5, photo: "/products/femmelia/reviews/2.png" },
      { name: "ياسمين", city: "سلا", text: "هاد الموضوع كان كيحرجني حتى مع راسي. دابا كملت بلا توتر.", stars: 5, photo: "/products/femmelia/reviews/3.png" },
      { name: "إكرام", city: "وجدة", text: "طلبت علبتين. من بعد أسابيع الإحساس ولا أوضح.", stars: 4, photo: "/products/femmelia/reviews/4.png" },
      { name: "خديجة", city: "مكناس", text: "ماشي معجزة، ولكن الإحساس ولا أهدى من بعد أسابيع.", stars: 5, photo: "/products/femmelia/reviews/5.png" },
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
        image: "/products/femmelia/1.png",
      },
      {
        title: "الحلبة والماكا للمظهر",
        body: "حلبة، ماكا، وزهرة الربيع بصيغة كبسولة. كيدعمو المظهر الأنثوي مع الالتزام. ما كيبدّلوش الطب، وما كيعوّضوش الصبر.",
        imageLabel: "صورة التركيبة",
        image: "/products/femmelia/2.png",
      },
      {
        title: "كبسولتين مع الأكل",
        body: "مع الفطور أو الغداء، كاس ماء. ما كاينش جهاز ولا موعد. الثبات هو اللي كيبني الإحساس.",
        imageLabel: "صورة الروتين",
        image: "/products/femmelia/3.png",
      },
      {
        title: "الثقة اللي كترجع ليكِ",
        body: "الهدف تحسي براسكِ مرتاحة قدام راسك. هاد الإحساس كيبني بالأسابيع، ماشي بتصويرة.",
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
    headlineAr: "زيت تساقط الشعر · 60 مل",
    feelingTitle: "كل مشطة، وشعركِ فالمغسل",
    formulaLine: "كافيين · إكليل الجبل · بيوتين · زيوت عناية بالفروة",
    labNote:
      "زيت 60 مل مكتوب للفروة أولاً: كيتدهن فين كاين الجذر. الكثافة كترجع بالروتين، ماشي بتبديل الشامبوان.",
    problemTitle: "سقوط الشعر",
    taglineAr: "التساقط كيبان كل صباح. الزيت كيتدهن على الفروة، ماشي غير على الأطراف — باش تحسي بالخصلة أهدى وأكثف مع الأسابيع.",
    shortDescriptionAr: "زيت فروة 60 مل · كافيين وإكليل الجبل",
    heroQuote: "الشعرة اللي فالمغسل كتهضر قبل أي تعليق. العناية خاصها تبدا من الجذر.",
    problemHook: "كل مغسل، كل مشطة، وكتشوفي شعر أكثر مما كنتي كتحسبي؟",
    problemBody:
      "كتخبي المشط. كتجمعي الشعر قبل ما يدخل شي حد للحمام. المغسل كيوجع أكثر من أي تعليق. التساقط كيجي من التوتر، بعد الولادة، من الفصول، ومن فروة تعبات وهي كتستنى غير شامبوان جديد. الزيت كيتدهن على الجذر — فين كيبان الخوف كل صباح.",
    mechanismTitle: "الفروة هي الأرض. الشعر كينبت منها.",
    mechanismBody:
      "إلا الفروة ضعيفة، الخصلة كيبان خاوية مهما بدّلتي الشامبوان. الكافيين كينشّط مظهر الفروة. إكليل الجبل عناية معروفة على الجذر. البيوتين كيدعم مظهر الشعرة. دقيقة دلّك بعد الدوش — هاد الدقيقة جزء من الروتين.",
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
      { name: "فاطمة", city: "الدار البيضاء", text: "المغسل كان كيخوفني. من بعد شهر حسّيت التساقط قلّ، والشعر ولا أهدى.", stars: 5, photo: "/products/capilys/reviews/1.png" },
      { name: "سلمى", city: "تطوان", text: "بعد الولادة طاح لي بزاف. ما رجعش بحال الأول بسرعة، ولكن الكثافة بدات تبان.", stars: 5, photo: "/products/capilys/reviews/2.png" },
      { name: "هدى", city: "القنيطرة", text: "الريحة خفيفة والزيت على الفروة ساهل. هاد الشي اللي خلّاني نكمل.", stars: 5, photo: "/products/capilys/reviews/3.png" },
      { name: "نورة", city: "الجديدة", text: "طلبت 3 علب من اللولة. عرفت أن الشعر كياخد وقت.", stars: 5, photo: "/products/capilys/reviews/4.png" },
      { name: "أسماء", city: "فاس", text: "ما بقاتش كل مشطة كتخوفني بحال الأول.", stars: 5, photo: "/products/capilys/reviews/5.png" },
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
        image: "/products/capilys/1.png",
      },
      {
        title: "الكافيين وإكليل الجبل على الجذر",
        body: "كافيين، إكليل الجبل، بيوتين، وزيوت عناية. كلهم كيمشيو للفروة. الكثافة كترجع بالأسابيع، ماشي بشامبوان جديد كل سيمانة.",
        imageLabel: "صورة التركيبة",
        image: "/products/capilys/2.png",
      },
      {
        title: "دقيقة بعد الدوش",
        body: "قطرات على الخطوط. دلّكي. كمّلي ليلتك. الشعر كياخد وقت — الروتين خاصو يكون ساهل باش تكمّليه.",
        imageLabel: "صورة الروتين",
        image: "/products/capilys/3.png",
      },
      {
        title: "الخصلة اللي كترجع عامرة",
        body: "الهدف شعر كيملا الگوفة، ماشي سحر طول. ملي التساقط كيقلّ، كتبداي تحسي بالخصلة من جديد.",
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
    headlineAr: "كولاجين بحري · 30 كبسولة",
    feelingTitle: "الماسك كيدوز… والوجه باقي باهت",
    formulaLine: "كولاجين بحري · فيتامين C · زنك · عناصر دقيقة من الزعفران",
    labNote:
      "30 كبسولة كولاجين بحري. كتكمّل الكريم، ما كتعوّضوش — عناية من الداخل للوجه اللي الماسك ما عادش كيكفيه.",
    problemTitle: "الإشراق من الداخل",
    taglineAr: "التعب كيبان فالوجه قبل ما يبان فالكلام. كبسولة مع الفطور باش الضوء يرجع من الداخل — مكمل عناية، ماشي دواء.",
    shortDescriptionAr: "كولاجين بحري 30 كبسولة · فيتامين C وزنك",
    heroQuote: "الضو اللي كينقص من الوجه غالباً ما كينقصش من الكريم بوحدو.",
    problemHook: "كتديري ماسك، كتشوفي وجهك باهت، وكتقولي: واش أنا تعبانة ولا البشرة هي اللي طافات؟",
    problemBody:
      "الناس كيقولو تعبانة. نتي كتعرفي راسكِ. الوجه باهت حتى نهار الراحة، والماسك كيدوز وما كيبدّل والو. السهر والتوتر والدورة كياخدوا الضوء من الداخل — والكونسيلر ما كيرجعوش.",
    mechanismTitle: "من الداخل كيوصل لفين الطبقة ما كتوصلش",
    mechanismBody:
      "الكولاجين البحري كيدعم مظهر النعومة والتماسك. فيتامين C للضوء الظاهر. الزنك للبشرة اللي تحت السهر والإيقاع. كبسولة مع الفطور، كل يوم. العلبة 30 كبسولة.",
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
      { q: "واش هادشي دواء؟", a: "لا. مكمل / عناية من الداخل. ما كيعالجش مرض. استشيري طبيبكِ فالحمل أو الأمراض المزمنة." },
      { q: "واش يغني على الكريم؟", a: "لا. كيكمل العناية الخارجية. كريم تفتيح الوجه من البرّا + الكولاجين البحري من الداخل." },
      { q: "الريحة والطعم؟", a: "صيغة يومية سهلة. التفاصيل الدقيقة كتكون على العلبة." },
      { q: "متى نحس بالفرق؟", a: "غالباً من 3 لـ 6 أسابيع على مستوى الإحساس بالبشرة والضوء فالوجه." },
    ],
    reviews: [
      { name: "إيناس", city: "الرباط", text: "الوجه كان باهت حتى فالويكاند. من بعد شهر حسّيت بالضوء رجع شوية شوية.", stars: 5, photo: "/products/luminora/reviews/1.png" },
      { name: "سناء", city: "الدار البيضاء", text: "خدّامة وسهر. الماسك ما بقاش كيكفي. هاد الجرعة ولاات فطوري.", stars: 5, photo: "/products/luminora/reviews/2.png" },
      { name: "غيثة", city: "مراكش", text: "جمّعتها مع كريم التفتيح. منطقي: بقع من البرّا وضوء من الداخل.", stars: 5, photo: "/products/luminora/reviews/3.png" },
      { name: "وفاء", city: "طنجة", text: "ما حسيتش بجوع ولا غثيان. ساهلة فالاستعمال.", stars: 4, photo: "/products/luminora/reviews/4.png" },
      { name: "رجاء", city: "أكادير", text: "ما بقاتش أول كلمة كسمعها: تعبانة.", stars: 5, photo: "/products/luminora/reviews/5.png" },
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
        image: "/products/luminora/1.png",
      },
      {
        title: "كولاجين وفيتامين C من الداخل",
        body: "كولاجين بحري للتماسك. فيتامين C للضوء. زنك للبشرة اللي تحت السهر. 30 كبسولة — شهر مع الفطور.",
        imageLabel: "صورة التركيبة",
        image: "/products/luminora/2.png",
      },
      {
        title: "كبسولة مع الفطور",
        body: "كاس ماء، وخلاص. الإشراق من الداخل كيبان بالثبات، ماشي نهار وناقص نهار.",
        imageLabel: "صورة الروتين",
        image: "/products/luminora/3.png",
      },
      {
        title: "وجه كيشبه ليكِ نهار الراحة",
        body: "الضوء كيرجع شوية شوية. إلا كانت البقع جزء من القصة، كريم التفتيح من البرّا كيكمل هاد الإحساس.",
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
  { name: "سارة", city: "الدار البيضاء", text: "كنت كنغطي الكلف بالفون حتى فالدار. ما تبدّلتش فسبوع، ولكن من بعد شهر حسّيت بالوجه أهدى فالضو.", stars: 5, product: "كلف" },
  { name: "فاطمة", city: "فاس", text: "المغسل كان كيخوفني. الزيت على الفروة، ومن بعد أسابيع التساقط ولا أقل.", stars: 5, product: "شعر" },
  { name: "إيناس", city: "الرباط", text: "الناس كانو كيقولو تعبانة. كبسولة الكولاجين مع الفطور، والضوء رجع شوية شوية.", stars: 5, product: "إشراق" },
  { name: "مريم", city: "أكادير", text: "عجبني الهدوء. التغليف ما هضرش، والكبسولة خلّاتني نكمّل بلا إحراج.", stars: 5, product: "أنوثة" },
  { name: "حنان", city: "طنجة", text: "عيطو، أكّدت، وخلّصت عند الباب. حسّيت بالطلب محترم بحال العلبة.", stars: 5, product: "COD" },
];
