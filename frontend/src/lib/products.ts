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
    headline: "طلب COD واضح، تأكيد قبل الشحن، وتجربة فاخرة تخليك مطمئنة من أول نقرة.",
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
    subheading: "عود غني مستوحى من ذوق دبي لمحبات الفخامة الهادئة، وأقوى كـ cross-sell داخل السلة.",
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
    subheading: "أضيفي الثنائي مع طلبك بدل AED 128 وخذيهما بـ AED 99 حتى ما تحتاجين تطلبين refill بعد أيام.",
    story:
      "اختيار عملي لزيادة قيمة طلبك وتجربة رائحتين مختلفتين تناسبان يومك ومناسباتك.",
    notes: ["وفر AED 29", "الأكثر إضافة مع الباقة", "رائحتان في طلب واحد"],
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
    headline: "أضيفي سيروم إضافي بـ AED 39 فقط.",
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
    headline: "أضيفي لمسة عود فاخرة بـ AED 39 فقط.",
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
  return `AED ${value}`;
}

export function getCrossSells(skus: string[]) {
  const inCart = new Set(skus);
  const suggestions: Product[] = [];
  const hasBundle = inCart.has("LB-BUNDLE-299");
  const hasMusk = inCart.has("LB-SERUM-MUSK-59");
  const hasOud = inCart.has("LB-SERUM-OUD-69");

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
