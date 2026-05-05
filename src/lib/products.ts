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
    name: "باقة ليالي السكون الفاخرة",
    shortName: "باقة السكون",
    price: 299,
    badge: "الأكثر طلباً اليوم",
    headline: "للمرأة التعبانة اللي تستاهل لحظة لنفسها — مسك أبيض ناعم + عود خليجي دافئ في باقة واحدة.",
    subheading:
      "ثنائي السيرومات الأنثوية: مسك المطر الأبيض لنظافة الروح، وعود قصر دبي لحضور راقٍ. للمرأة التي تحب تفاصيل مرتبة.",
    story:
      "مرأة مشغولة بكل شيء وتنسى نفسها — هذه الباقة هي دقائقها اليومية التي تعيدها لنفسها.",
    notes: ["مسك أبيض ناعم", "عود خليجي فاخر", "تغليف هدية أنيق", "دفع عند الاستلام"],
    image: "/products/aroma-bundle-v2.jpg",
    cardImage: "/products/bundle-card-serums.jpg",
    beforeImage: "/products/before-bundle-tired.jpg",
    afterImage: "/products/after-bundle-happy.jpg",
  },
  {
    sku: "LB-SERUM-MUSK-199",
    slug: "white-rain-musk-serum",
    name: "سيروم مسك المطر الأبيض",
    shortName: "مسك المطر الأبيض",
    price: 199,
    compareAt: 299,
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
    sku: "LB-SERUM-OUD-199",
    slug: "dubai-palace-oud-serum",
    name: "سيروم عود قصر دبي",
    shortName: "عود قصر دبي",
    price: 199,
    compareAt: 299,
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
    price: 299,
    compareAt: 449,
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
      compareAt: 448,
      badge: "الأكثر اختياراً",
      highlight: true,
      savings: "وفري 69 درهم",
    },
    {
      sku: "LB-BUNDLE-449",
      label: "الباقة الكاملة الفاخرة",
      sublabel: "الموقد + 3 سيروم + تغليف هدية فاخر",
      price: 449,
      compareAt: 597,
      badge: "الأكثر توفيراً",
      savings: "وفري 148 درهم",
    },
  ],
  "white-rain-musk-serum": [
    {
      sku: "LB-SERUM-MUSK-199",
      label: "زجاجة واحدة",
      sublabel: "100mL · نتيجة من أول استخدام",
      price: 199,
      badge: "جربي واحدة",
    },
    {
      sku: "LB-SERUM-DUO-279",
      label: "مسك + عود — الثنائي الفاخر",
      sublabel: "مسك المطر الأبيض + عود قصر دبي · 200mL",
      price: 279,
      compareAt: 398,
      badge: "الأكثر اختياراً",
      highlight: true,
      savings: "وفري 119 درهم",
    },
    {
      sku: "LB-BUNDLE-379",
      label: "الثنائي + الموقد الفاخر",
      sublabel: "السيرومان + موقد اللهب الفاخر",
      price: 349,
      compareAt: 697,
      badge: "الأكثر توفيراً",
      savings: "وفري 348 درهم",
    },
  ],
  "dubai-palace-oud-serum": [
    {
      sku: "LB-SERUM-OUD-199",
      label: "زجاجة واحدة",
      sublabel: "100mL · نتيجة من أول استخدام",
      price: 199,
      badge: "جربي واحدة",
    },
    {
      sku: "LB-SERUM-DUO-279",
      label: "عود + مسك — الثنائي الفاخر",
      sublabel: "عود قصر دبي + مسك المطر الأبيض · 200mL",
      price: 279,
      compareAt: 398,
      badge: "الأكثر اختياراً",
      highlight: true,
      savings: "وفري 119 درهم",
    },
    {
      sku: "LB-BUNDLE-379",
      label: "الثنائي + الموقد الفاخر",
      sublabel: "السيرومان + موقد اللهب الفاخر",
      price: 349,
      compareAt: 697,
      badge: "الأكثر توفيراً",
      savings: "وفري 348 درهم",
    },
  ],
  "aroma-flame-lamp": [
    {
      sku: "LB-LAMP-189",
      label: "الموقد فقط",
      sublabel: "جهاز الموقد الفاخر بدون سيروم",
      price: 299,
      badge: "نتيجة من أول طلبة",
    },
    {
      sku: "LB-BUNDLE-299",
      label: "الموقد + سيروم مختار",
      sublabel: "الموقد + مسك أو عود — أفضل تجربة",
      price: 379,
      compareAt: 498,
      badge: "الأكثر اختياراً",
      highlight: true,
      savings: "وفري 119 درهم",
    },
    {
      sku: "LB-BUNDLE-449",
      label: "الموقد + السيرومان",
      sublabel: "الموقد الكامل + مسك المطر + عود قصر دبي",
      price: 449,
      compareAt: 697,
      badge: "الأكثر توفيراً",
      savings: "وفري 248 درهم",
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
  const hasMusk = inCart.has("LB-SERUM-MUSK-199") || inCart.has("LB-SERUM-DUO-279");
  const hasOud = inCart.has("LB-SERUM-OUD-199") || inCart.has("LB-SERUM-DUO-279");
  const hasLamp = inCart.has("LB-LAMP-189");

  if (hasBundle) {
    if (!hasMusk && !hasOud) suggestions.push(getProductBySku("LB-SERUM-MUSK-199")!);
  }
  if (hasMusk && !hasOud && !hasBundle) suggestions.push(getProductBySku("LB-SERUM-OUD-199")!);
  if (hasOud && !hasMusk && !hasBundle) suggestions.push(getProductBySku("LB-SERUM-MUSK-199")!);
  if (!hasBundle && !hasLamp) suggestions.push(getProductBySku("LB-BUNDLE-299")!);

  return suggestions.filter(Boolean).slice(0, 2);
}
