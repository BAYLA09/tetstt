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
  image: string;
  cardImage: string;
  beforeImage?: string;
  afterImage?: string;
};

export type OfferTier = {
  sku: string;
  label: string;
  sublabel: string;
  price: number;
  compareAt?: number;
  badge?: string;
  highlight?: boolean;
  savings?: string;
};

export type CartItem = {
  sku: string;
  name: string;
  price: number;
  quantity: number;
};

// ── Main storefront products ──────────────────────────────────────────
export const products: Product[] = [
  {
    sku: "LB-BUNDLE-299",
    slug: "luxury-bundle",
    name: "باقة ليالي بيوتي الفاخرة",
    shortName: "الباقة الفاخرة",
    price: 299,
    badge: "الأكثر طلباً اليوم",
    headline: "موقد فاخر + سيروم أنثوي + تغليف هدية — كل ما تحتاجين في طلب واحد.",
    subheading:
      "الباقة الرئيسية: موقد اللهب الفاخر مع سيروم مختار، تغليف أنيق، ودفع عند الاستلام بدون أي دفع الآن.",
    story:
      "هذه ليست منتجات عادية؛ إنها طقوس عناية تمنح بيتك دفء وعطر راقٍ في نفس الوقت.",
    notes: ["موقد لهب فاخر", "سيروم عطري أنثوي", "تغليف هدية أنيق", "دفع عند الاستلام"],
    image: "/products/img-diffuser-hero.jpg",
    cardImage: "/products/img-bundle-card.jpg",
    beforeImage: "/products/before-diffuser.jpg",
    afterImage: "/products/after-diffuser.jpg",
  },
  {
    sku: "LB-SERUM-MUSK-99",
    slug: "white-rain-musk-serum",
    name: "سيروم مسك المطر الأبيض",
    shortName: "مسك المطر الأبيض",
    price: 99,
    compareAt: 139,
    badge: "نعومة يومية",
    headline: "رائحة مطر أبيض ناعمة تلازمك طول اليوم — تترطب وتعطّر في نفس الوقت.",
    subheading: "مسك هادئ نظيف لمحبات الرائحة الأنثوية الراقية. يرطب البشرة ويدوم ساعات.",
    story: "اختيار راقٍ يضيف إحساساً مرتباً لروتينك اليومي.",
    notes: ["مسك أبيض نقي", "رائحة تدوم 6-8 ساعات", "ترطيب عميق", "مناسب للاستخدام اليومي"],
    image: "/products/img-vanilla-hero.jpg",
    cardImage: "/products/img-vanilla-card.jpg",
    beforeImage: "/products/before-vanilla.jpg",
    afterImage: "/products/after-vanilla.jpg",
  },
  {
    sku: "LB-SERUM-OUD-99",
    slug: "dubai-palace-oud-serum",
    name: "سيروم عود قصر دبي",
    shortName: "عود قصر دبي",
    price: 99,
    compareAt: 139,
    badge: "حضور خليجي فاخر",
    headline: "عود دافئ مستوحى من قصور دبي — حضور يُلاحَظ ويدوم طول اليوم.",
    subheading: "عود خليجي أصيل لمحبات الفخامة الهادئة. يترطب في البشرة ويعطي رائحة شخصية فريدة.",
    story: "العود يحمل قيمة عالية في الإمارات — صُمّم ليكون راقياً وليس ثقيلاً.",
    notes: ["عود أصيل خليجي", "رائحة تدوم 8-12 ساعة", "مثبّت طبيعي بالعنبر", "مناسب للمناسبات"],
    image: "/products/img-sandalwood-hero.jpg",
    cardImage: "/products/img-sandalwood-card.jpg",
    beforeImage: "/products/before-sandalwood.jpg",
    afterImage: "/products/after-sandalwood.jpg",
  },
  {
    sku: "LB-LAMP-189",
    slug: "aroma-flame-lamp",
    name: "موقد اللهب الفاخر",
    shortName: "الموقد الفاخر",
    price: 189,
    compareAt: 249,
    badge: "يحوّل جو البيت",
    headline: "لهب واقعي + ضباب بارد + رائحة تملأ الغرفة — بدون نار حقيقية.",
    subheading: "موقد إلكتروني فاخر يعطي دفء وجو راقٍ لأي غرفة. يعمل مع أي زيت عطري.",
    story: "الجهاز الذي يحوّل غرفتك من فارغة لدافئة في دقائق.",
    notes: ["لهب LED واقعي", "ناشر زيوت عطرية", "مؤقت 1h/3h/5h", "آمن مع الأطفال"],
    image: "/products/img-diffuser-hero.jpg",
    cardImage: "/products/img-diffuser-card.jpg",
    beforeImage: "/products/before-diffuser.jpg",
    afterImage: "/products/after-diffuser.jpg",
  },
];

// ── Upsell products (post-order) ──────────────────────────────────────
export const upsells: Product[] = [
  {
    sku: "LB-UPSELL-MUSK-49",
    slug: "white-rain-musk-serum",
    name: "سيروم مسك المطر الأبيض - عرض خاص",
    shortName: "مسك المطر الأبيض",
    price: 49,
    badge: "يظهر مرة واحدة",
    headline: "أضيفي سيروم مسك إضافي بـ 49 درهم فقط.",
    subheading: "عرض خاص بعد تأكيد الطلب.",
    story: "خصم خاص مع طلبك الحالي فقط.",
    notes: ["سعر خاص", "مرة واحدة"],
    image: "/products/img-vanilla-hero.jpg",
    cardImage: "/products/img-vanilla-card.jpg",
  },
  {
    sku: "LB-UPSELL-OUD-49",
    slug: "dubai-palace-oud-serum",
    name: "سيروم عود قصر دبي - عرض خاص",
    shortName: "عود قصر دبي",
    price: 49,
    badge: "يظهر مرة واحدة",
    headline: "أضيفي لمسة عود فاخرة بـ 49 درهم فقط.",
    subheading: "عرض خاص بعد تأكيد الطلب.",
    story: "خصم خاص مع طلبك الحالي فقط.",
    notes: ["سعر خاص", "مرة واحدة"],
    image: "/products/img-sandalwood-hero.jpg",
    cardImage: "/products/img-sandalwood-card.jpg",
  },
];

// ── Offer tiers per product (namabeauty-style selector) ───────────────
export const offerTiers: Record<string, OfferTier[]> = {
  "luxury-bundle": [
    {
      sku: "LB-BUNDLE-299",
      label: "الموقد + سيروم واحد",
      sublabel: "موقد اللهب الفاخر + سيروم مسك أو عود",
      price: 299,
      badge: "نتيجة من أول طلبة",
    },
    {
      sku: "LB-BUNDLE-379",
      label: "الموقد + سيرومان",
      sublabel: "موقد اللهب + مسك المطر + عود قصر دبي",
      price: 379,
      compareAt: 427,
      badge: "الأكثر اختياراً",
      highlight: true,
      savings: "وفري 48 درهم",
    },
    {
      sku: "LB-BUNDLE-449",
      label: "الباقة الكاملة الفاخرة",
      sublabel: "الموقد + 3 سيروم + تغليف هدية فاخر",
      price: 449,
      compareAt: 537,
      badge: "الأكثر توفيراً",
      savings: "وفري 88 درهم",
    },
  ],
  "white-rain-musk-serum": [
    {
      sku: "LB-SERUM-MUSK-99",
      label: "زجاجة واحدة",
      sublabel: "100mL · نتيجة من أول استخدام",
      price: 99,
      badge: "جربي واحدة",
    },
    {
      sku: "LB-SERUM-DUO-169",
      label: "مسك + عود — الثنائي الفاخر",
      sublabel: "مسك المطر الأبيض + عود قصر دبي · 200mL",
      price: 169,
      compareAt: 198,
      badge: "الأكثر اختياراً",
      highlight: true,
      savings: "وفري 29 درهم",
    },
    {
      sku: "LB-BUNDLE-299",
      label: "الثنائي + الموقد الفاخر",
      sublabel: "السيرومان + موقد اللهب الفاخر",
      price: 299,
      compareAt: 387,
      badge: "الأكثر توفيراً",
      savings: "وفري 88 درهم",
    },
  ],
  "dubai-palace-oud-serum": [
    {
      sku: "LB-SERUM-OUD-99",
      label: "زجاجة واحدة",
      sublabel: "100mL · نتيجة من أول استخدام",
      price: 99,
      badge: "جربي واحدة",
    },
    {
      sku: "LB-SERUM-DUO-169",
      label: "عود + مسك — الثنائي الفاخر",
      sublabel: "عود قصر دبي + مسك المطر الأبيض · 200mL",
      price: 169,
      compareAt: 198,
      badge: "الأكثر اختياراً",
      highlight: true,
      savings: "وفري 29 درهم",
    },
    {
      sku: "LB-BUNDLE-299",
      label: "الثنائي + الموقد الفاخر",
      sublabel: "السيرومان + موقد اللهب الفاخر",
      price: 299,
      compareAt: 387,
      badge: "الأكثر توفيراً",
      savings: "وفري 88 درهم",
    },
  ],
  "aroma-flame-lamp": [
    {
      sku: "LB-LAMP-189",
      label: "الموقد فقط",
      sublabel: "جهاز الموقد الفاخر بدون سيروم",
      price: 189,
      compareAt: 249,
      badge: "جربي بنفسك",
    },
    {
      sku: "LB-BUNDLE-299",
      label: "الموقد + سيروم مختار",
      sublabel: "الموقد + مسك أو عود — أفضل تجربة",
      price: 299,
      compareAt: 388,
      badge: "الأكثر اختياراً",
      highlight: true,
      savings: "وفري 89 درهم",
    },
    {
      sku: "LB-BUNDLE-379",
      label: "الموقد + السيرومان",
      sublabel: "الموقد الكامل + مسك + عود",
      price: 379,
      compareAt: 477,
      badge: "الأكثر توفيراً",
      savings: "وفري 98 درهم",
    },
  ],
};

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

export function getCrossSells(skus: string[]) {
  const inCart = new Set(skus);
  const suggestions: Product[] = [];
  const hasBundle = inCart.has("LB-BUNDLE-299") || inCart.has("LB-BUNDLE-379") || inCart.has("LB-BUNDLE-449");
  const hasMusk = inCart.has("LB-SERUM-MUSK-99") || inCart.has("LB-SERUM-DUO-169");
  const hasOud = inCart.has("LB-SERUM-OUD-99") || inCart.has("LB-SERUM-DUO-169");
  const hasLamp = inCart.has("LB-LAMP-189");

  if (hasBundle) {
    if (!hasMusk && !hasOud) suggestions.push(getProductBySku("LB-SERUM-MUSK-99")!);
  }
  if (hasMusk && !hasOud && !hasBundle) suggestions.push(getProductBySku("LB-SERUM-OUD-99")!);
  if (hasOud && !hasMusk && !hasBundle) suggestions.push(getProductBySku("LB-SERUM-MUSK-99")!);
  if (!hasBundle && !hasLamp) suggestions.push(getProductBySku("LB-BUNDLE-299")!);

  return suggestions.filter(Boolean).slice(0, 2);
}
