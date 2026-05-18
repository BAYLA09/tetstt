/** Bundle tier on the product hero (e.g. lamp + serums). */
export type ProductOfferTier = {
  sku: string;
  title: string;
  description: string;
  price: number;
  compareAt?: number;
  saveLabel?: string;
  badge?: string;
  eyebrow?: string;
  default?: boolean;
};

export type Product = {
  sku: string;
  slug: string;
  name: string;
  shortName: string;
  price: number;
  compareAt?: number;
  badge: string;
  headline: string;
  subheading: string;
  story: string;
  notes: string[];
  image?: string;
  cardImage?: string;
  heroPanorama?: boolean;
  /** When false, CommercePanel skips badge/title/headline + first trust row (lamp PDP cleanup). */
  commerceShowIntro?: boolean;
  /** When false, hero image area shows only the photo (no glass caption card). */
  heroMediaShowCaption?: boolean;
  /** Dense hero only: `contain` keeps tall/square art uncropped (merchant-supplied PNG). */
  heroMediaObjectFit?: "cover" | "contain";
  /** When true, hero uses a plain `<img>` (no Next.js image optimization) for pixel-identical /public assets. */
  heroMediaUnmodified?: boolean;
  /** With dense contain hero: use a square frame so 1:1 art fills the slot without tall letterboxing. */
  heroMediaSquareSlot?: boolean;
  /** Hero image + story blocks render above price and add-to-cart. */
  storyBeforeCommerce?: boolean;
  offerTiers?: ProductOfferTier[];
  heroPromoLine?: string;
  beforeAfterStory?: {
    kicker: string;
    title: string;
    body: string;
    beforeSrc: string;
    afterSrc: string;
    beforeLabel: string;
    afterLabel: string;
    /** `warm-left`: under LTR grid, warm “after” photo first (left), cold “before” second (right). */
    layout?: "chronological" | "warm-left";
  };
  insightStrip?: {
    imageSrc: string;
    headline: string;
    subline: string;
    /** Large figure directly under the insight image (optional). */
    statPercent?: string;
  };
  /** Optional three-image row after the insight strip (PDP storytelling). */
  storyGallery?: { src: string; alt: string }[];
  /** Hero bridge: compact pills + headline + body between hero art and offer panel (lamp PDP). */
  heroMarketingBridge?: {
    pills: [title: string, sub: string][];
    headline: string;
    body: string;
  };
};

export type CartItem = {
  sku: string;
  name: string;
  price: number;
  quantity: number;
};

/** Full catalog for lookups (cart, related SKU, orders). */
const catalogProducts: Product[] = [
  {
    sku: "LB-BUNDLE-299",
    slug: "luxury-bundle",
    name: "باقة ليالي بيوتي الفاخرة",
    shortName: "الباقة الفاخرة",
    price: 299,
    badge: "الأكثر طلباً اليوم",
    headline: "طلب واضح بالدفع عند الاستلام، تأكيد قبل الشحن، وتجربة فاخرة تطمنج من أول نقرة.",
    subheading:
      "الباقة الرئيسية للي تبي منتج يبان مثل علامة راقية: تغليف أنيق، رائحة أنثوية، ودفع عند الاستلام بدون أي دفع الحين.",
    story:
      "مو منتجات عادية تنضاف للسلة؛ هذي طقوس عناية بسيطة تضيف ليومج لمسة فخامة هادئة وتقلّل ترددج مع وضوح الطلب والتأكيد قبل الشحن.",
    notes: ["الدفع عند الاستلام", "تأكيد قبل الشحن", "تجهيز أنيق للطلب"],
  },
  {
    sku: "LB-SERUM-MUSK-59",
    slug: "white-rain-musk-serum",
    name: "سيروم مسك المطر الأبيض",
    shortName: "مسك المطر الأبيض",
    price: 59,
    badge: "نعومة يومية",
    headline: "إضافة خفيفة تكمل طلبج وتخلي الرائحة النظيفة معاج أكثر.",
    subheading: "لمسة مسك هادئة لمحبات الرائحة النظيفة والأنثوية بدون مبالغة، مثالية كإضافة للسلة.",
    story:
      "اختيار خفيف وراقي يضيف إحساساً مرتباً لروتينج اليومي حسب طريقة الاستعمال.",
    notes: ["رائحة نظيفة", "مناسب للروتين اليومي", "إحساس أنثوي هادئ"],
  },
  {
    sku: "LB-SERUM-OUD-69",
    slug: "dubai-palace-oud-serum",
    name: "سيروم عود قصر دبي",
    shortName: "عود قصر دبي",
    price: 199,
    compareAt: 249,
    badge: "ترطيب فوري · بشرة الخليج",
    headline:
      "عود قصر دبي يلمّع وجهج بعد المكيف: ترطيب يتشرب بسرعة، نعومة، ولمعة أنثوية — بدون ثقل ولا وعود طبية.",
    subheading:
      "روتين 100مل للبشرة الجافة والمشدودة من المكيف والحر: يعيد إحساس الرطوبة والملمس الحريري مع رائحة عود دافئة.",
    story:
      "مكيف السيارة، المكتب، والبيت يخلّون البشرة «تشرب» أي ترطيب بسرعة وتبقى باهتة. عود قصر دبي يعطيج طقس فاخر: رطوبة حسّية، لمعان خفيف، ورائحة عربية راقية بعد الاستحمام أو قبل النوم.",
    insightStrip: {
      imageSrc: "/products/layali-essential-oil-studio.png",
      headline: "من أول الأيام: ملمس أنعم، إحساس أقل تشنج مع المكيف، ورائحة تفتح المزاج.",
      subline: "ملاحظات فريق ليالي بيوتي من تجارب العميلات — النتائج تختلف.",
    },
    notes: ["لإحساس الجفاف والشد", "100مل", "رائحة عود دافئة", "دفع عند الاستلام"],
    heroPromoLine: "اختاري الكمية المناسبة: عبوة، عبوتين، أو ثلاث عبوات بسعر أوفر",
    offerTiers: [
      {
        sku: "LB-OUD-ONE-199",
        title: "وحدة عود قصر دبي",
        description: "عبوة واحدة 100مل — مناسبة لتجربة الروتين لأول مرة.",
        price: 199,
        compareAt: 249,
        eyebrow: "ابدئي روتين الجفاف",
        default: true,
      },
      {
        sku: "LB-OUD-TWO-279",
        title: "عبوتين عود قصر دبي",
        description: "عبوتان 100مل — وحدة لج ووحدة للاحتياط أو الهدية.",
        price: 279,
        compareAt: 398,
        saveLabel: "وفّري 119 درهماً",
        badge: "الأكثر اختياراً",
      },
      {
        sku: "LB-OUD-THREE-349",
        title: "ثلاثة عود قصر دبي",
        description: "ثلاث عبوات 100مل — أفضل قيمة لروتين مستمر ضد إحساس الجفاف.",
        price: 349,
        compareAt: 597,
        saveLabel: "وفّري 248 درهماً",
        badge: "الأكثر توفيراً",
      },
    ],
    image: "/products/layali-essential-oil-studio.png",
    cardImage: "/products/layali-oud-home-card.png",
  },
  {
    sku: "LB-SERUM-SET-99",
    slug: "serum-refill-set",
    name: "ثنائي السيروم الفاخر",
    shortName: "ثنائي السيروم",
    price: 99,
    compareAt: 128,
    badge: "أفضل إضافة للسلة",
    headline: "أفضل إضافة لرفع قيمة الطلب: مسك ناعم وعود راقٍ بسعر أوفر.",
    subheading: "أضيفي الثنائي مع طلبج بدل 128 درهم وخذيهما بـ 99 درهم عشان ما تحتاجين تطلبين تعبئة بعد أيام.",
    story:
      "اختيار عملي لزيادة قيمة طلبج وتجربة رائحتين مختلفتين تناسب يومج ومناسباتج.",
    notes: ["وفر 29 درهم", "الأكثر إضافة مع الباقة", "رائحتان في طلب واحد"],
  },
  {
    sku: "LB-LAMP-189",
    slug: "aroma-flame-lamp",
    name: "موقد الجو الجاف — ليالي بيوتي",
    shortName: "موقد الجو الجاف",
    price: 299,
    badge: "جو الغرفة · نوم أعمق",
    headline:
      "حوّلي غرفتك الليلة: ضباب بارد خفيف، ضوء لهب دافي، وعود يلفّ المكان — إحساس موقد فاخر بدون نار حقيقية.",
    subheading:
      "موقد إلكتروني من ليالي بيوتي يشتغل مع الزيت العطري ليخفّف جفاف المكيف على الهوى والبشرة، ويعطيج طقس ليلي أنيق داخل بيت الخليج.",
    story:
      "مو بس «فواحة»: نبني أجواء — أقل جفاف في الهوى حول الوجه، رائحة عود ناعمة، ونوم أعمق بعد يوم طويل تحت المكيف.",
    notes: ["ضباب بارد", "لجو المكيف", "رائحة عود", "دفع عند الاستلام"],
    heroPromoLine: "اختاري الموقد وحده أو مع عود قصر دبي لروتين الجفاف الكامل",
    offerTiers: [
      {
        sku: "LB-LAMP-189",
        title: "موقد الجو الجاف فقط",
        description: "جهاز ليالي بيوتي بضباب بارد — بداية مناسبة لروتين جو المكيف الجاف",
        price: 299,
        eyebrow: "ابدئي بتلطيف الجو",
      },
      {
        sku: "LB-LAMP-OUD-379",
        title: "الموقد + عود قصر دبي",
        description: "موقد الجو الجاف + عود قصر دبي 100مل — روتين الجو والبشرة في باقة واحدة",
        price: 379,
        compareAt: 498,
        saveLabel: "وفّري 119 درهماً",
        badge: "الأكثر اختياراً",
        default: true,
      },
      {
        sku: "LB-LAMP-TRIPLE-449",
        title: "الموقد + عبوتين عود قصر دبي",
        description:
          "موقد الجو الجاف + عبوتان من عود قصر دبي 100مل — للروتين المستمر مع المكيف والحرارة.",
        price: 449,
        compareAt: 697,
        saveLabel: "وفّري 248 درهماً",
        badge: "الأكثر توفيراً",
      },
    ],
    image: "/products/layali-flame-lamp-hero.png",
    cardImage: "/products/layali-flame-lamp-hero.png",
    heroPanorama: true,
    heroMediaObjectFit: "contain",
    heroMediaUnmodified: true,
    heroMediaShowCaption: false,
    commerceShowIntro: false,
    storyBeforeCommerce: true,
    heroMarketingBridge: {
      pills: [
        ["ضباب بارد", "يلطّف الهوى"],
        ["ضوء لهب", "بدون نار"],
        ["رائحة عود", "تغطّي المكيف"],
        ["الإمارات", "دفع عند الاستلام"],
      ],
      headline: "جفاف المكيف باين على بشرتج — السبب مو «كريم زايد» بس",
      body:
        "الهوى حول الوجه ينشف مع التكييف. موقد الجو الجاف من ليالي بيوتي يرطّب الجو بلطف، يهدّي الليل بضوء دافي، وبوخور عود — بدون إبر ولا جلسات فيتامين سي.",
    },
    insightStrip: {
      imageSrc: "/products/aroma-stat-woman.jpg",
      headline:
        "ليالي بيوتي تركّز على تجربة الغرفة: أقل جفاف في الهواء، نوم أهدأ، وطقس عود راقي يشبه فيلات دبي الأنيقة.",
      subline: "ملاحظات من فريق التجربة · الإمارات، ٢٠٢٤",
      statPercent: "٧٨٪",
    },
    storyGallery: [
      {
        src: "/products/layali-flame-lamp-angle.png",
        alt: "موقد الجو الجاف — زاوية جانبية على سطح خشبي",
      },
      {
        src: "/products/layali-flame-lamp-hero.png",
        alt: "موقد الجو الجاف — واجهة أمامية مع تأثير اللهب والضباب",
      },
      {
        src: "/products/layali-oud-home-card.png",
        alt: "سيروم عود قصر دبي — صورة العرض للاستعمال مع الموقد",
      },
    ],
  },
];

/** Only these `/products/[slug]` pages are built and reachable. Expand when relaunching the full store. */
const STOREFRONT_SLUG_ALLOWLIST = new Set<string>(["aroma-flame-lamp", "dubai-palace-oud-serum"]);

/** Listed on home/collections and passed to `generateStaticParams`. */
export const products: Product[] = catalogProducts.filter((p) => STOREFRONT_SLUG_ALLOWLIST.has(p.slug));

/** After checkout, skip the one-time upsell modal and go straight to thank-you (single-product test flow). */
export const SKIP_POST_ORDER_UPSELL_MODAL = true;

export const upsells: Product[] = [
  {
    sku: "LB-UPSELL-MUSK-39",
    slug: "white-rain-musk-serum",
    name: "سيروم مسك المطر الأبيض - عرض خاص",
    shortName: "مسك المطر الأبيض",
    price: 39,
    badge: "يظهر مرة واحدة",
    headline: "أضيفي سيروم إضافي بـ 39 درهم فقط.",
    subheading: "عرض خاص بعد تأكيد الطلب، ولا يظهر داخل المتجر.",
    story: "خصم خاص مع طلبج الحالي بس.",
    notes: ["سعر خاص", "مرة وحدة", "مع طلبج الحالي"],
  },
  {
    sku: "LB-UPSELL-OUD-39",
    slug: "dubai-palace-oud-serum",
    name: "سيروم عود قصر دبي - عرض خاص",
    shortName: "عود قصر دبي",
    price: 39,
    badge: "يظهر مرة واحدة",
    headline: "أضيفي لمسة عود فاخرة بـ 39 درهم فقط.",
    subheading: "عرض خاص بعد تأكيد الطلب، ولا يظهر داخل المتجر.",
    story: "خصم خاص مع طلبج الحالي بس.",
    notes: ["سعر خاص", "مرة وحدة", "مع طلبج الحالي"],
  },
];

export const PRODUCTS = products;

export function getProduct(slug: string) {
  if (!STOREFRONT_SLUG_ALLOWLIST.has(slug)) return undefined;
  return catalogProducts.find((product) => product.slug === slug);
}

export function getProductBySku(sku: string) {
  return [...catalogProducts, ...upsells].find((product) => product.sku === sku);
}

export function money(value: number) {
  return `${value} درهم`;
}

export function resolveDefaultOfferTier(product: Product): ProductOfferTier | null {
  const tiers = product.offerTiers;
  if (!tiers?.length) return null;
  return tiers.find((t) => t.default) ?? tiers[0] ?? null;
}

export function productSnapshotForOfferTier(base: Product, tier: ProductOfferTier): Product {
  const lampBaseSubmit = base.slug === "aroma-flame-lamp" && tier.sku.startsWith("LB-LAMP-");
  return {
    ...base,
    sku: lampBaseSubmit ? "LB-LAMP-189" : tier.sku,
    name: tier.title,
    shortName: tier.title,
    price: tier.price,
    compareAt: tier.compareAt,
  };
}
