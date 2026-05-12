/** Bundle line on the product hero (e.g. aroma lamp + serums). */
export type ProductOfferTier = {
  sku: string;
  title: string;
  description: string;
  price: number;
  compareAt?: number;
  saveLabel?: string;
  badge?: string;
  /** Pre-selected tier in the hero picker. */
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
  /** Optional multi-SKU picker on the hero (replaces single “current offer” price). */
  offerTiers?: ProductOfferTier[];
  /** Thin urgency line above the tier picker (shipping / promo). */
  heroPromoLine?: string;
  beforeAfterStory?: {
    kicker: string;
    title: string;
    body: string;
    beforeSrc: string;
    afterSrc: string;
    beforeLabel: string;
    afterLabel: string;
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

export const products: Product[] = [
  {
    sku: "LB-BUNDLE-299",
    slug: "luxury-bundle",
    name: "باقة ليالي بيوتي الفاخرة",
    shortName: "الباقة الفاخرة",
    price: 299,
    badge: "الأكثر طلباً اليوم",
    headline: "طلب واضح بالدفع عند الاستلام، تأكيد قبل الشحن، وتجربة فاخرة تخليك مطمئنة من أول نقرة.",
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
    headline: "إضافة خفيفة تكمل طلبك وتخلي الرائحة النظيفة معك أكثر.",
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
    price: 69,
    badge: "قيمة خليجية أعلى",
    headline: "لمسة عود راقية ترفع قيمة الطلب وتعطي حضور خليجي فخم.",
    subheading: "عود غني مستوحى من ذوق دبي لمحبات الفخامة الهادئة، وأقوى كإضافة ذكية داخل السلة.",
    story:
      "العود يحمل قيمة عالية في الإمارات، لذلك صُمم هذا الاختيار ليبدو كإضافة راقية للطلب.",
    notes: ["طابع فاخر", "ذوق خليجي", "مناسب للطلعات"],
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
    name: "موقد اللهب الفاخر",
    shortName: "الموقد الفاخر",
    price: 299,
    badge: "يحوّل جو البيت",
    headline: "لهب واقعي + ضباب بارد + رائحة تملأ الغرفة — بدون نار حقيقية.",
    subheading:
      "موقد إلكتروني فاخر يعطي دفء وجو راقٍ لأي غرفة. يعمل مع أي زيت عطري.",
    story: "الجهاز الذي يحوّل غرفتك من فارغة لدافئة في دقائق.",
    notes: ["لهب LED واقعي", "ناشر زيوت عطرية", "مؤقت 1h/3h/5h", "آمن مع الأطفال"],
    heroPromoLine: "آخر 48 ساعة على عرض الشحن المجاني هذا الأسبوع",
    offerTiers: [
      {
        sku: "LB-LAMP-189",
        title: "الموقد فقط",
        description: "جهاز موقد اللهب الفاخر — بدون سيروم",
        price: 299,
      },
      {
        sku: "LB-LAMP-OUD-379",
        title: "الموقد + سيروم عود قصر دبي",
        description: "موقد اللهب + عود قصر دبي 100مل — الثنائي الأمثل",
        price: 379,
        compareAt: 498,
        saveLabel: "وفري 119 درهم",
        badge: "الأكثر اختياراً",
        default: true,
      },
      {
        sku: "LB-LAMP-TRIPLE-449",
        title: "الموقد + عود + مسك",
        description: "موقد اللهب + عود قصر دبي + مسك المطر الأبيض",
        price: 449,
        compareAt: 697,
        saveLabel: "وفري 248 درهم",
        badge: "الأكثر توفيراً",
      },
    ],
    image: "/products/aroma-lamp-oud-hero.jpg",
    cardImage: "/products/img-diffuser-card.jpg",
    heroPanorama: true,
    storyBeforeCommerce: true,
    beforeAfterStory: {
      kicker: "قبل وبعد",
      title: "بيتك يحس فاضي وبارد – حتى مع كل الديكور",
      body:
        "الهواء الجاف، الإضاءة الباردة، والغرفة بدون روح تخليك ما تحبين الجلوس في بيتك. المشكلة مو في الأثاث — في الجو.",
      beforeSrc: "/products/before-diffuser.jpg",
      afterSrc: "/products/after-family-aroma.jpg",
      beforeLabel: "قبل",
      afterLabel: "بعد",
    },
    insightStrip: {
      imageSrc: "/products/aroma-stat-woman.jpg",
      headline:
        "نساء في الإمارات يحسسن أن بيتهن يفتقر للدفء والجو الراقي – حتى بعد الاهتمام بالديكور.",
      subline: "استطلاع ليالي بيوتي، الإمارات 2024",
    },
  },
];

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
  return products.find((product) => product.slug === slug);
}

export function getProductBySku(sku: string) {
  return [...products, ...upsells].find((product) => product.sku === sku);
}

export function money(value: number) {
  return `${value} درهم`;
}

const LAMP_FAMILY_SKUS = new Set(["LB-LAMP-189", "LB-LAMP-OUD-379", "LB-LAMP-TRIPLE-449"]);

export function resolveDefaultOfferTier(product: Product): ProductOfferTier | null {
  const tiers = product.offerTiers;
  if (!tiers?.length) return null;
  return tiers.find((t) => t.default) ?? tiers[0] ?? null;
}

/** Line item passed to the cart / checkout for a selected hero bundle tier. */
export function productSnapshotForOfferTier(base: Product, tier: ProductOfferTier): Product {
  return {
    ...base,
    sku: tier.sku,
    name: tier.title,
    shortName: tier.title,
    price: tier.price,
    compareAt: tier.compareAt,
  };
}

export function getCrossSells(skus: string[]) {
  const inCart = new Set(skus);
  const suggestions: Product[] = [];
  const hasBundle = inCart.has("LB-BUNDLE-299");
  const hasLamp = skus.some((sku) => LAMP_FAMILY_SKUS.has(sku));
  const hasMusk = inCart.has("LB-SERUM-MUSK-59");
  const hasOud = inCart.has("LB-SERUM-OUD-69");

  if (hasLamp && !hasOud) {
    suggestions.push(getProductBySku("LB-SERUM-OUD-69")!);
  }

  if (hasLamp && hasOud && !hasMusk) {
    suggestions.push(getProductBySku("LB-SERUM-MUSK-59")!);
  }

  if (hasBundle && !inCart.has("LB-SERUM-SET-99")) {
    suggestions.push(getProductBySku("LB-SERUM-SET-99")!);
  }

  if (hasMusk && !hasOud) {
    suggestions.push(getProductBySku("LB-SERUM-OUD-69")!);
  }

  if (hasOud && !hasMusk) {
    suggestions.push(getProductBySku("LB-SERUM-MUSK-59")!);
  }

  if (!hasBundle) {
    suggestions.push(getProductBySku("LB-BUNDLE-299")!);
  }

  return suggestions.filter(Boolean).slice(0, 2);
}
