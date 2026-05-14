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
      "الباقة الرئيسية للمرأة التي تريد منتجاً يبدو مملوكاً لعلامة راقية: تغليف أنيق، رائحة أنثوية، ودفع عند الاستلام بدون أي دفع الآن.",
    story:
      "هذه ليست منتجات عادية تُضاف للسلة؛ إنها طقوس عناية صغيرة تمنح يومك لمسة فخامة هادئة وتقلل ترددك بوضوح الطلب والتأكيد قبل الشحن.",
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
      "اختيار خفيف وراقي يضيف إحساساً مرتباً لروتينك اليومي حسب طريقة الاستعمال.",
    notes: ["رائحة نظيفة", "مناسب للروتين اليومي", "إحساس أنثوي هادئ"],
  },
  {
    sku: "LB-SERUM-OUD-69",
    slug: "dubai-palace-oud-serum",
    name: "سيروم عود قصر دبي",
    shortName: "عود قصر دبي",
    price: 199,
    compareAt: 249,
    badge: "لجفاف بشرة الإمارات",
    headline: "سيروم عود فاخر للبشرة الجافة التي تتعب من مكيفات الإمارات وحرارة الجو اليومية.",
    subheading:
      "عود قصر دبي 100مل يمنح البشرة إحساس ترطيب ونعومة مع رائحة خشبية دافئة، مناسب بعد الاستحمام أو قبل النوم.",
    story:
      "المكيفات، الشمس، والمشاوير اليومية في الإمارات تخلي البشرة باهتة ومشدودة. عود قصر دبي صُمم كطقس عناية بسيط يعطي إحساس نعومة ورائحة فاخرة بدون تعقيد.",
    notes: ["لإحساس الجفاف والشد", "100مل", "رائحة عود دافئة", "دفع عند الاستلام"],
    heroPromoLine: "اختاري الكمية المناسبة: عبوة، عبوتين، أو ثلاث عبوات بسعر أوفر",
    offerTiers: [
      {
        sku: "LB-OUD-ONE-199",
        title: "وحدة عود قصر دبي",
        description: "عبوة واحدة 100مل — مناسبة لتجربة الروتين لأول مرة.",
        price: 199,
        compareAt: 249,
        eyebrow: "ابدئي بروتين الجفاف",
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
    image: "/products/dubai-palace-oud-serum.svg",
    cardImage: "/products/dubai-palace-oud-serum.svg",
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
    subheading: "أضيفي الثنائي مع طلبك بدل 128 درهم وخذيهما بـ 99 درهم حتى ما تحتاجين تطلبين تعبئة بعد أيام.",
    story:
      "اختيار عملي لزيادة قيمة طلبك وتجربة رائحتين مختلفتين تناسبان يومك ومناسباتك.",
    notes: ["وفر 29 درهم", "الأكثر إضافة مع الباقة", "رائحتان في طلب واحد"],
  },
  {
    sku: "LB-LAMP-189",
    slug: "aroma-flame-lamp",
    name: "موقد ليالي للجو الجاف",
    shortName: "موقد الجو الجاف",
    price: 299,
    badge: "لجفاف جو الإمارات",
    headline: "ضباب بارد ورائحة عود تساعدك تبني روتين راحة ضد الجو الجاف من المكيف — بدون نار حقيقية.",
    subheading:
      "موقد إلكتروني بضباب بارد يعمل مع الزيوت العطرية، مصمم كجزء من روتين جفاف البشرة والجو في الإمارات.",
    story: "مب قطعة شكل بس؛ هو جزء من روتين الجو الجاف اللي يترك البشرة مشدودة بعد يوم كامل في المكيف.",
    notes: ["ضباب بارد", "لجو المكيف", "رائحة عود", "دفع عند الاستلام"],
    heroPromoLine: "اختاري الموقد وحده أو مع عود قصر دبي لروتين الجفاف الكامل",
    offerTiers: [
      {
        sku: "LB-LAMP-189",
        title: "موقد الجو الجاف فقط",
        description: "جهاز موقد ليالي بضباب بارد — مناسب كبداية لجو المكيف الجاف",
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
    image: "/products/aroma-lamp-oud-hero.jpg",
    cardImage: "/products/img-diffuser-card.jpg",
    heroPanorama: true,
    storyBeforeCommerce: true,
    beforeAfterStory: {
      kicker: "قبل وبعد",
      title: "الجو الجاف من المكيف يبان على البشرة قبل ما تحسين به",
      body:
        "في الإمارات، المكيف يشتغل ساعات طويلة ويترك الجو ناشفاً. موقد ليالي يدخل في روتينك كضباب بارد ورائحة عود تساعدك تلطفي إحساس الجفاف حولك.",
      beforeSrc: "/products/before-diffuser.jpg",
      afterSrc: "/products/after-family-aroma.jpg",
      beforeLabel: "قبل",
      afterLabel: "بعد",
      layout: "warm-left",
    },
    insightStrip: {
      imageSrc: "/products/aroma-stat-woman.jpg",
      headline:
        "نساء في الإمارات يربطن بين المكيف الطويل وإحساس شد البشرة وجفاف الجو داخل البيت.",
      subline: "استطلاع ليالي بيوتي — الإمارات، ٢٠٢٤",
    },
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
    story: "خصم خاص مع طلبك الحالي فقط.",
    notes: ["سعر خاص", "مرة واحدة", "مع طلبك الحالي"],
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
    story: "خصم خاص مع طلبك الحالي فقط.",
    notes: ["سعر خاص", "مرة واحدة", "مع طلبك الحالي"],
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
