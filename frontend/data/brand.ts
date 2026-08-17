export const BRAND_NAME_AR = "سفراسكين";
export const BRAND_NAME_EN = "Safraskin";
export const BRAND_TAGLINE = "عناية أنثوية · للدفع عند الاستلام";
export const BRAND_SLOGAN = "أربعة حلول. روتين واحد واضح.";

/** Flip to true after dropping real photos in /public */
export const ASSETS_READY = false;

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://safraskin.online";

export const TRUST_BAR = [
  "الدفع عند الاستلام",
  "توصيل لجميع المدن",
  "تغليف محترم",
  "مكالمة تأكيد قبل الإرسال",
] as const;

export const AUTHORITY_PILLARS = [
  {
    icon: "1",
    title: "مشكلة واحدة لكل منتج",
    body: "ما كنديروش خلطة عامة. كل علبة محلولة لمشكلة واضحة، باش تعرفي شنو كتشري.",
  },
  {
    icon: "2",
    title: "عناية محترمة",
    body: "كنهضرو على الألم الحقيقي ديال المرأة — بلا تهويل وبلا وعود رخيصة.",
  },
  {
    icon: "3",
    title: "COD سهل",
    body: "كتختاري العرض، كتعمري الاسم والتيليفون، وكتخلّصي ملي توصّل الطلبيّة.",
  },
  {
    icon: "4",
    title: "تأكيد قبل الإرسال",
    body: "كنعيّطو ليكِ باش نأكدو العنوان. هاد الشي كيخلّي التوصيل يوصل، وما يضيعش.",
  },
] as const;

export const COD_STEPS = [
  {
    step: "1",
    title: "اختاري العرض",
    body: "علبة، علبتين، أولا 3 علب. الثمن واضح قبل ما تضيفي للسلة.",
  },
  {
    step: "2",
    title: "الاسم والتيليفون",
    body: "جوج خانات بصح. رقم مغربي صحيح، ومن بعد كنعيّطو ليكِ.",
  },
  {
    step: "3",
    title: "خلّصي ملي توصّل",
    body: "ما كاينش تحويل، ما كاينش بطاقة. الفلوس كتتحسب عند الباب.",
  },
] as const;
