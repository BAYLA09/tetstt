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
    /** Large figure shown directly under the insight image (e.g. survey share). */
    statPercent?: string;
  };
  /** Optional row of three gallery images after the insight strip (PDP storytelling). */
  storyGallery?: { src: string; alt: string }[];
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
    name: "موقد ليالي الفاخر",
    shortName: "موقد ليالي",
    price: 299,
    badge: "يحوّل جوّ البيت",
    headline: "لهب واقعي + ضباب بارد + رائحة تملأ الغرفة — من دون نار حقيقية.",
    subheading:
      "موقد إلكتروني فاخر من ليالي يمنح مساحتك دفئاً وهدوءاً، ويعمل مع الزيوت العطرية المنزلية.",
    story: "قطعة ترتقي بأجواء غرفتك خلال دقائق.",
    notes: ["لهب LED واقعي", "ناشر زيوت عطرية", "مؤقت 1h/3h/5h", "آمن مع الأطفال"],
    heroPromoLine: "آخر 48 ساعة على عرض الشحن المجاني لهذا الأسبوع",
    offerTiers: [
      {
        sku: "LB-LAMP-189",
        title: "الموقد فقط",
        description: "جهاز موقد ليالي الفاخر — بدون سيروم",
        price: 299,
        eyebrow: "ابدئي بالموقد",
      },
      {
        sku: "LB-LAMP-OUD-379",
        title: "الموقد + سيروم عود قصر دبي",
        description: "موقد ليالي الفاخر + سيروم عود قصر دبي 100مل — الثنائي الأمثل",
        price: 379,
        compareAt: 498,
        saveLabel: "وفّري 119 درهماً",
        badge: "الأكثر اختياراً",
        default: true,
      },
      {
        sku: "LB-LAMP-TRIPLE-449",
        title: "الموقد + سيرومين من عود قصر دبي",
        description:
          "موقد ليالي الفاخر + عبوتان من سيروم عود قصر دبي 100مل — للتجديد الدوري ولدمج العود مع باقي روائحكِ المفضّلة.",
        price: 449,
        compareAt: 697,
        saveLabel: "وفّري 248 درهماً",
        badge: "الأكثر توفيراً",
      },
    ],
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2000&q=88",
    cardImage:
      "https://images.unsplash.com/photo-1615529328331-f8917597711f?auto=format&fit=crop&w=900&q=85",
    heroPanorama: true,
    storyBeforeCommerce: true,
    beforeAfterStory: {
      kicker: "قبل وبعد",
      title: "منزلك يبدو باردًا وفارغًا — حتى مع تنسيق الديكور",
      body:
        "الهواء الجاف والإضاءة الباردة وغياب الدفء يجعلكِ تفضّلين قضاء الوقت خارج الغرفة. المشكلة ليست في الأثاث بقدر ما هي في أجواء المكان.",
      beforeSrc:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1400&q=85",
      afterSrc:
        "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1400&q=85",
      beforeLabel: "قبل",
      afterLabel: "بعد",
      layout: "warm-left",
    },
    insightStrip: {
      imageSrc:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1600&q=85",
      headline:
        "نساء في الإمارات يشعرن بأن منازلهن تحتاج إلى دفء أجواء أرقى، حتى مع اهتمامهن بكل تفاصيل الديكور.",
      subline: "استطلاع ليالي بيوتي — دولة الإمارات العربية المتحدة، ٢٠٢٤",
      statPercent: "٧٨٪",
    },
    storyGallery: [
      {
        src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=85",
        alt: "موقد ليالي في فضاء معيشة مرتب بهدوء",
      },
      {
        src: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&q=85",
        alt: "لمسة دفء وإضاءة ناعمة في غرفة معيشة",
      },
      {
        src: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=1200&q=85",
        alt: "تفاصيل أجواء منزلية أنيقة تلائم الموقد",
      },
    ],
  },
];

/** Only these `/products/[slug]` pages are built and reachable. Expand when relaunching the full store. */
const STOREFRONT_SLUG_ALLOWLIST = new Set<string>(["aroma-flame-lamp"]);

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
