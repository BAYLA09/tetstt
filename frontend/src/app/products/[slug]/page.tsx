import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { ProductHero } from "@/components/ProductHero";
import { getProduct, products, type Product } from "@/lib/products";

type Pair = [string, string];
type Triple = [string, string, string];
type PageContent = {
  stat: {
    value: string;
    text: string;
    source: string;
  };
  problems: Pair[];
  ingredients: Triple[];
  freeFrom: string[];
  certifications: Pair[];
  expert: {
    quote: string;
    name: string;
    title: string;
  };
  metrics: Pair[];
  timeline: Triple[];
  reviews: Triple[];
  comparisons: Triple[];
  guarantee: Pair[];
  usage: Pair[];
  delivery: Pair[];
  faq: Pair[];
};

const DEFAULT_CONTENT: PageContent = {
  stat: {
    value: "68%",
    text: "من عميلات الإمارات يحبّون يكون الطلب واضح بالدفع عند الاستلام قبل ما يجرّبن منتج جديد.",
    source: "استطلاع ليالي بيوتي، 2024",
  },
  problems: [
    ["أبغي أفهم المنتج قبل الطلب", "صفحة المنتج تجمع القصة، المزايا، طريقة الاستخدام، والدفع قبل أي خطوة شراء."],
    ["ما أبغي دفع إلكتروني", "الدفع عند الاستلام متاح، ونتواصل معاج عشان نأكد الطلب قبل التجهيز."],
    ["أخاف السعر يتغير في السلة", "السعر والعرض ظاهرين قبل الإضافة للسلة، والملخص واضح قبل تثبيت الطلب."],
    ["أبي منتج يوصل مثل ما شفت", "نوضح محتوى العرض ونؤكد الطلب قبل الشحن لتقليل الالتباس."],
  ],
  ingredients: [
    ["عرض واضح", "سعر ومحتوى ظاهر", "كل اختيار يظهر محتواه وسعره قبل الإضافة للسلة."],
    ["تأكيد قبل الشحن", "اتصال أو واتساب", "الفريق يتأكد من الاسم والرقم قبل إرسال الشحنة."],
    ["دفع عند الاستلام", "بدون دفع مسبق", "تدفعين عند وصول الطلب فقط."],
  ],
  freeFrom: ["بدون دفع إلكتروني", "بدون اشتراك", "بدون رسوم مخفية", "بدون خطوات معقدة"],
  certifications: [
    ["الدفع", "عند الاستلام"],
    ["الإمارات", "توصيل داخل الدولة"],
    ["الدعم", "تأكيد قبل الشحن"],
    ["الوضوح", "سعر واضح"],
  ],
  expert: {
    quote:
      "أحسن صفحات المنتج هي اللي تشرح المشكلة والعرض وطريقة الطلب قبل ما نطلب بياناتج. هالشي يخفّف التردد ويرفع جودة الطلبات المؤكدة.",
    name: "فريق تجربة ليالي",
    title: "تجربة طلب واضحة داخل الإمارات",
  },
  metrics: [
    ["1-3", "أيام توصيل داخل المدن الرئيسية"],
    ["0", "دفع إلكتروني مطلوب"],
    ["100%", "تأكيد قبل الشحن"],
    ["24/7", "إمكانية مراجعة الصفحة"],
  ],
  timeline: [
    ["1", "افهمي العرض", "اقرئي المشكلة، المزايا، وطريقة الاستخدام قبل اختيار العرض."],
      ["2", "اختاري الكمية", "حددي العرض المناسب من أعلى صفحة المنتج، وبعدها ضيفيه للسلة."],
    ["3", "ثبتي الطلب", "اكتبي الاسم ورقم الهاتف، وبعدها انتظري تأكيد الفريق قبل الشحن."],
  ],
  reviews: [
    ["مريم", "دبي", "أهم شيء عندي إن الصفحة شرحت كل شيء قبل ما أدخل بياناتي."],
    ["نورة", "أبوظبي", "الدفع عند الاستلام والتأكيد قبل الشحن خلاني أرتاح."],
      ["سارة", "الشارقة", "حسيت المتجر مرتب، وما فيه ضغط شراء سريع."],
  ],
  comparisons: [
    ["صفحات البيع العشوائية", "زر شراء بدون شرح", "تترك العميلة محتارة وتزيد رفض الطلب عند التوصيل."],
    ["إعلانات التواصل", "وعد كبير وتفاصيل قليلة", "تفتح فضول بس ما تكفي لتأكيد طلب جاد."],
    ["ليالي بيوتي", "قصة + عرض + طريقة طلب", "كل شيء واضح قبل السلة والدفع عند الاستلام."],
  ],
  guarantee: [
    ["اتصلي بنا", "لو احتجتِ تعديل أو استفسار قبل الشحن."],
    ["راجعي الطلب", "الفريق يؤكد الكمية والبيانات قبل التجهيز."],
    ["ادفعي عند الباب", "ما فيه دفع مسبق أو التزام قبل الاستلام."],
  ],
  usage: [
    ["اقرئي التفاصيل", "ابدئي من المشكلة والمزايا قبل اختيار العرض."],
    ["اختاري العرض", "اختاري الكمية داخل صفحة المنتج فقط."],
    ["ثبتي الطلب", "الاسم ورقم الهاتف يكفي للتأكيد."],
    ["استلمي وادفعي", "الدفع عند وصول الطلب."],
  ],
  delivery: [
    ["اطلبي الآن", "اختاري العرض المناسب واكتبي بياناتج بدون دفع إلكتروني."],
    ["نتصل للتأكيد", "نتأكد من الاسم والرقم والكمية قبل تجهيز الشحنة."],
    ["استلمي وادفعي", "التوصيل داخل الإمارات والدفع عند الاستلام."],
  ],
  faq: [
    ["هل الدفع عند الاستلام؟", "نعم. ما فيه دفع إلكتروني مسبق."],
    ["متى يتواصلون معاي؟", "بعد ما ترسلين الطلب عشان نتأكد من البيانات قبل الشحن."],
    ["هل أقدر أعدل الطلب؟", "إيه، وقت مكالمة أو رسالة التأكيد قبل التجهيز."],
    ["هل السعر واضح؟", "نعم، السعر يظهر في اختيار العرض وفي السلة قبل التثبيت."],
  ],
};

const PAGE_CONTENT: Record<string, PageContent> = {
  "dubai-palace-oud-serum": {
    stat: {
      value: "٨٢٪",
      text: "من عميلات الخليج يقلن المكياج يتعب لما البشرة جافة ومشدودة بعد المكيف والحر.",
      source: "استطلاع ليالي بيوتي — الإمارات ودول الخليج، ٢٠٢٤",
    },
    problems: [
      [
        "بشرتي تشدّ بعد المكيف… وكأنّي ما رطّبت.",
        "عود قصر دبي يعطيج طبقة تحسّين فيها «شربة» سريعة للرطوبة مع رائحة عود دافئة — بدون وعود علاجية.",
      ],
      [
        "البشرة باهتة وما فيها لمعة، حتى مع المكياج.",
        "روتين خفيف بعد الاستحمام أو قبل النوم يرجّع إحساس النعومة واللمعة الطبيعية تدريجياً مع الاستمرار.",
      ],
      [
        "خطوط جفاف خفيفة وملمس خشن يبان مع الضوء.",
        "التركيز على الترطيب الحسي والنعومة — مو على «شدّ الوجه» — عشان ترتاحي من إحساس التيبّس.",
      ],
      [
        "أبغى أعرف السعر قبل ما أدخل بياناتي.",
        "العروض واضحة فوق: عبوة ١٩٩، عبوتين ٢٧٩، ثلاث عبوات ٣٤٩ — وتنضاف للسلة من نفس الصفحة.",
      ],
    ],
    ingredients: [
      [
        "زيت عود دافئ",
        "رائحة خشبية فاخرة",
        "يعطي الروتين إحساساً خليجياً راقياً يناسب الليل وبعد الاستحمام.",
      ],
      [
        "ملمس عناية ناعم",
        "إحساس راحة للبشرة المشدودة",
        "مناسب لروتين يومي مع جو المكيف بدون ادعاءات علاجية.",
      ],
      [
        "عبوة 100مل",
        "كمية عملية للاستعمال المتكرر",
        "اختاري عبوة للتجربة أو عبوتين/ثلاث عبوات للاستمرارية والقيمة الأفضل.",
      ],
    ],
    freeFrom: ["بدون دفع إلكتروني", "بدون وعود علاجية", "بدون اشتراك", "بدون تعقيد"],
    certifications: [
      ["الدفع", "عند الاستلام"],
      ["الإمارات", "توصيل داخل الدولة"],
      ["100 مل", "عبوة عملية"],
      ["الوضوح", "عروض واضحة"],
    ],
    expert: {
      quote:
        "الجفاف من المكيف مو بس «شكل» — هو إحساس. لما نركّز على الملمس واللمعة من أول الطبقات، العميلة تفهم ليش تدفع، وتكمل الطلب بثقة.",
      name: "فريق ليالي للعناية",
      title: "روتين فاخر لبشرة الخليج",
    },
    metrics: [
      ["199", "درهم للعبوة الواحدة"],
      ["279", "درهم لعرض عبوتين"],
      ["349", "درهم لعرض ثلاث عبوات"],
      ["0", "دفع إلكتروني مطلوب"],
    ],
    timeline: [
      ["١", "أول دقيقة", "لمسة خفيفة: تحسّين إن البشرة «شربت» التركيبة بسرعة، وبرودة المكيف أهدى على الوجه."],
      ["٢", "أول أيام", "الملمس يلين، الإحساس بالشد يخف، واللمعة ترجع تدريجياً مع الروتين اليومي."],
      ["٣", "مع العروض", "عبوتين أو ثلاث عبوات تثبت الاستمرارية — أوفر لج على المدى وأقل تردد قبل السلة."],
    ],
    reviews: [
      ["مريم", "الرياض", "أول ما حطيته حسيت بشرتي ترتاح من تشنج المكيف. الرائحة فخمة بس مو ثقيلة."],
      ["نورة", "دبي", "المكياج صار يثبت أحسن لأن البشرة مو ناشفة تحت. العروض واضحة وما في لغط."],
      ["سارة", "الشارقة", "ما حسيت إني أنتظر شهر عشان أشوف فرق بالملمس — التغيير كان تدريجي وواضح مع الروتين."],
    ],
    comparisons: [
      ["مرطب عادي", "ترطيب سريع ورائحة خفيفة", "يناسب الاستعمال العادي لكن لا يعطي طقس عود فاخر."],
      ["عطر فقط", "رائحة بدون إحساس عناية", "لا يخاطب مشكلة شد البشرة من المكيف."],
      ["عود قصر دبي", "إحساس نعومة + رائحة عود", "روتين واحد يربط الجفاف بجو الإمارات وتجربة عطرية راقية."],
    ],
    guarantee: [
      ["اختاري العرض", "عبوة 199، عبوتين 279، أو ثلاث عبوات 349."],
      ["أكدي الطلب", "الفريق يتواصل قبل الشحن لتأكيد البيانات والكمية."],
      ["ادفعي عند الاستلام", "ما فيه دفع مسبق؛ الدفع عند الباب فقط."],
    ],
    usage: [
      ["بعد الاستحمام", "استخدميه لما تكون البشرة نظيفة وجاهزة للروتين."],
      ["قبل النوم", "مناسب كطقس هادئ بعد يوم طويل في المكيف."],
      ["كمية بسيطة", "ابدئي بكمية قليلة ووزعيها حسب حاجتج."],
      ["استمرارية", "اختاري عبوتين أو ثلاث عبوات إذا استخدامج يومي."],
    ],
    delivery: [
      ["اختاري العرض", "حددي عبوة، عبوتين، أو ثلاث عبوات من أعلى الصفحة."],
      ["نتصل للتأكيد", "نراجع الاسم والرقم والكمية قبل تجهيز الشحنة."],
      ["استلمي وادفعي", "توصيل داخل الإمارات والدفع عند الاستلام."],
    ],
    faq: [
      ["ما هي العروض؟", "عبوة بـ 199 درهم، عبوتين بـ 279 درهم، وثلاث عبوات بـ 349 درهم."],
      ["هل هذا علاج طبي للجفاف؟", "لا. هو روتين عناية فاخر يركّز على إحساس الترطيب والنعومة واللمعة — بدون وعود علاجية."],
      ["متى أحس بالراحة على البشرة؟", "كثير من العميلات يقلن إحساس الترطيب والنعومة يبان بسرعة من أول الأيام؛ النتائج تختلف من شخص لآخر."],
      ["متى أستخدمه؟", "بعد الاستحمام أو قبل النوم، خصوصاً بعد يوم طويل في المكيف أو الشمس."],
      ["هل الدفع عند الاستلام؟", "نعم. ما فيه دفع إلكتروني مسبق."],
      ["هل أقدر أعدل الطلب؟", "إيه، وقت مكالمة أو رسالة التأكيد قبل التجهيز."],
    ],
  },
  "aroma-flame-lamp": {
    stat: {
      value: "٧٨٪",
      text: "من تجاربنا السريعة مع عميلات: الغرفة تحسّ أهدى للنوم بعد أول أسبوع ضباب خفيف مع عود — النتائج قد تختلف.",
      source: "مؤشر رضا داخلي — ليالي بيوتي، ٢٠٢٤",
    },
    problems: [
      [
        "المكيف يخلّي الهوى ناشف… وأنا أحس بجفاف بالأنف وصدا بالحلق بالليل.",
        "ضباب بارد خفيف يرطّب الهوى حولك — مو بس رائحة. كثير عميلات يقلن إن الأنف والحلق يحسّون أهدى بالليل مع الاستخدام المنتظم.",
      ],
      [
        "أبي شي يشبه دفء الموقد بس ما أبي مخاطر الأطفال والشموع.",
        "ضوء لهب ناعم مع ضباب بارد يعطيج جو هادي وأنيق: دفء بصري، وهدوء، وطقس ليلي فاخر يلمّ الغرفة.",
      ],
      [
        "أبي أغيّر مزاج الغرفة بدون عطور ثقيلة تدوخ.",
        "رائحة عود ناعمة مع ضباب خفيف تعطي طبقات هدوء — أقل ضغط بصري وأكثر دفء على المساء.",
      ],
      [
        "أبغى هدية تبان فخمة وتنفع لغرفة النوم.",
        "التغليف والتجربة مصممين كهدية أنثوية: غرفة أنعم، أنف أهدى، ونوم أعمق.",
      ],
    ],
    ingredients: [
      ["ضباب بارد", "إحساس جو ألطف", "مصمم لروتين المكيف الجاف داخل البيت، بدون ادعاء علاج طبي."],
      ["رائحة عود", "طقس عناية دافئ", "تقدرين تربطينه مع عود قصر دبي عشان يصير الروتين للجو والبشرة سوا."],
      ["ضوء لهب", "بدون نار حقيقية", "يعطي إحساس هادئ أثناء روتين الليل بدون شموع أو نار."],
    ],
    freeFrom: ["بدون نار حقيقية", "بدون وعود علاجية", "بدون دفع إلكتروني", "بدون مفاجآت في السعر"],
    certifications: [
      ["الضباب", "ضباب بارد"],
      ["الجو الجاف", "لجو المكيف"],
      ["الدفع", "عند الاستلام"],
      ["الإمارات", "توصيل داخل الدولة"],
    ],
    expert: {
      quote:
        "في الخليج المكيف شغال طول اليوم: الجفاف مو بس للبشرة — هو جوّ البيت. لما نربط الضباب الخفيف برائحة عود فاخرة، الغرفة تصير مكان نفسك ترتاح فيه قبل ما تلمسي أي كريم.",
      name: "فريق ليالي للعناية",
      title: "تجربة غرفة فاخرة — بدون تعقيد",
    },
    metrics: [
      ["72%", "يربطون المكيف بالجفاف"],
      ["3", "باقات للجفاف"],
      ["0", "دفع إلكتروني"],
      ["ضباب", "بارد"],
    ],
    timeline: [
      ["١", "أول 10 دقايق", "الهوى حول الوجه يحسّ ألطف: أقل جفاف مفاجئ، وأول لمعة على الخشب مع ضوء لهب هادئ."],
      ["٢", "أول أسبوع", "الغرفة تبني «طقسها»: رائحة عود خفيفة، ضباب منتظم، ونوم أعمق بعد يوم طويل تحت المكيف."],
      ["٣", "مع عود قصر دبي", "الباقة الكاملة تخلي الليل روتين جو + بشرة: تلطيف الجو + لمسة نعومة على البشرة."],
    ],
    reviews: [
      ["مريم", "الدمام", "أول ما شغّلته حسيت الغرفة صارت غيمة خفيفة. النوم صار أعمق وما أحس بجفاف بالأنف."],
      ["نورة", "أبوظبي", "مو زي الفواحة العادية — في فرق على الهوا. الباقة مع عود قصر دبي كملت الروتين."],
      ["سارة", "الكويت", "يبان فخم على التسريحة، وهدية تصلح لأي بيت يعشقون المكيف."],
    ],
    comparisons: [
      ["فواحة عادية", "رائحة بس", "ما تحسّين فرق حقيقي على الجو الناشف من المكيف."],
      ["مرطب بس", "عناية للبشرة بس", "ما يغيّر إحساس الجو الجاف داخل البيت لوحده."],
      ["ليالي بيوتي — موقد الجو الجاف", "ضباب بارد + عود", "يجمع بين تلطيف الجو الناشف وروتين العناية بالبشرة في نفس الخط."],
    ],
    guarantee: [
      ["اختاري روتين الجفاف", "الموقد فقط أو مع عود قصر دبي."],
      ["أكدي الباقة", "نتواصل معاج قبل ما نجهز الشحنة عشان نأكد الكمية."],
      ["استلمي وادفعي", "الدفع عند الباب داخل الإمارات."],
    ],
    usage: [
      ["املئي الخزان", "اتّبعي تعليمات الماء المناسبة للجهاز."],
      ["أضيفي رائحة العود", "استخدمي زيت عطري مناسب أو اختاري الباقة مع عود قصر دبي."],
      ["شغليه مع المكيف", "استعمليه في وقت الجلوس الطويل داخل البيت."],
      ["كملي روتين البشرة", "استعملي عود قصر دبي على البشرة إذا اخترتي الباقة الكاملة."],
    ],
    delivery: [
      ["اختاري العرض", "حددي الموقد وحده أو باقة الجفاف مع عود قصر دبي."],
      ["نتصل للتأكيد", "نراجع البيانات والكمية قبل الشحن."],
      ["استلمي وادفعي", "توصيل داخل الإمارات والدفع عند الاستلام."],
    ],
    faq: [
      ["هل هذا مرطب طبي للبشرة؟", "لا. هو موقد بضباب بارد ضمن روتين يلطّف إحساس الجو الجاف، مو جهاز طبي."],
      ["هل الدفع عند الاستلام؟", "نعم، ما فيه دفع مسبق."],
      ["هل أقدر أطلبه مع عود قصر دبي؟", "نعم، وهذا هو الروتين الأقوى لزاوية الجفاف: الجو + البشرة."],
      ["متى يكلّموني؟", "بعد ما ترسلين الطلب، نتواصل معاج ونأكد البيانات قبل الشحن."],
      ["هل السعر يتغير؟", "السعر الظاهر في اختيار العرض هو الذي يدخل للسلة."],
      ["كيف أستخدمه بأمان؟", "املئي الخزان حسب التعليمات، استخدمي زيتاً عطرياً مناسباً للأجهزة الرذاذية، وخلي الجهاز بعيد عن متناول الأطفال."],
    ],
  },
};

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

/** Slugs not in `generateStaticParams` return 404 (no on-demand pages for removed products). */
export const dynamicParams = false;

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProduct(slug);
  return {
    title: product ? `${product.name} | ليالي بيوتي` : "ليالي بيوتي",
    description: product?.subheading,
  };
}

function SectionHeading({
  kicker,
  title,
  body,
  light = false,
}: {
  kicker: string;
  title: string;
  body?: string;
  light?: boolean;
}) {
  return (
    <div className="section-heading">
      <p
        className={`badge ${
          light ? "border-gold-400/40 bg-gold-400/10 text-gold-300" : ""
        }`}
      >
        {kicker}
      </p>
      <h2 className={light ? "text-white" : undefined}>{title}</h2>
      {body && <p className={light ? "!text-cream-100" : undefined}>{body}</p>}
    </div>
  );
}

function StatStrip({ content }: { content: PageContent }) {
  return (
    <section className="border-y border-[var(--border-gold)] bg-white px-4 py-10">
      <div className="container-grid grid gap-5 rounded-[2rem] bg-[var(--emerald-950)] p-6 text-white md:grid-cols-[auto_1fr] md:items-center md:p-8">
        <p className="text-6xl font-black text-[var(--gold-300)] md:text-7xl">{content.stat.value}</p>
        <div>
          <p className="text-2xl font-black leading-snug">{content.stat.text}</p>
          <p className="mt-2 text-sm font-bold text-cream-100/70">{content.stat.source}</p>
        </div>
      </div>
    </section>
  );
}

function CodReassuranceStrip() {
  const items = [
    ["خلال ١٠ دقائق", "نتصل لتأكيد الطلب (٩ص–٩م بتوقيت دبي)."],
    ["رقم غريب؟", "غالباً يكون فريق ليالي — أجيبي عشان ما يتأخر التجهيز."],
    ["دفع عند الباب", "ما نخصم شيء الحين. الدفع بعد ما تشوفين الطلب."],
    ["تجهيز فاخر", "تغليف أنيق وتوصيل داخل الإمارات."],
  ];
  return (
    <section className="border-y border-[var(--border-gold)] bg-[var(--surface-warm)] px-4 py-8">
      <div className="container-grid grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(([title, text]) => (
          <div key={title} className="rounded-2xl border border-[var(--border-gold)] bg-white p-4 text-center shadow-sm">
            <p className="text-sm font-black text-[var(--emerald-950)]">{title}</p>
            <p className="mt-2 text-xs font-semibold leading-6 text-[var(--muted)]">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProblemSection({ content }: { content: PageContent }) {
  return (
    <section className="section-padding bg-[var(--cream-50)]">
      <div className="container-grid">
        <SectionHeading
          kicker="هل تحسين بهالأشياء؟"
          title="مشاكل وايد تعرفينها — وحلول من داخل الروتين"
          body="ما نضغط عليج بزر شراء سريع. نوضح الألم والسبب والحل قبل ما تختارين العرض."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {content.problems.map(([problem, answer]) => (
            <div key={problem} className="premium-card p-7 lg:p-8">
              <p className="text-lg font-black leading-8 text-[var(--emerald-950)]">“{problem}”</p>
              <p className="mt-4 leading-8 text-[var(--muted)]">{answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function IngredientsSection({ content }: { content: PageContent }) {
  return (
    <section className="section-padding bg-white">
      <div className="container-grid">
        <SectionHeading
          kicker="المكوّنات اللي تفرق"
          title="السرّ في التركيز، مب في كثرة الكلام"
          body="كل عنصر في الصفحة له وظيفة واضحة: يشرح الفايدة، يطمّنج، ويوصلج لاختيار العرض."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {content.ingredients.map(([name, dose, text]) => (
            <article key={name} className="premium-card min-h-[240px] p-7 lg:min-h-[260px] lg:p-9">
              <p className="text-sm font-black text-[var(--gold-500)]">{dose}</p>
              <h3 className="mt-3 text-2xl font-black text-[var(--emerald-950)] lg:text-3xl">{name}</h3>
              <p className="mt-4 text-base leading-8 text-[var(--muted)]">{text}</p>
            </article>
          ))}
        </div>
        <div className="mt-8 rounded-[2rem] border border-[var(--border-gold)] bg-[var(--cream-50)] p-6">
          <h3 className="text-2xl font-black text-[var(--emerald-950)]">الأشياء اللي ما بتشوفينها في تجربتج</h3>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {content.freeFrom.map((item) => (
              <span key={item} className="rounded-full bg-white px-4 py-3 text-center text-sm font-black text-[var(--emerald-950)]">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CredibilitySection({ content }: { content: PageContent }) {
  return (
    <section className="section-padding bg-[var(--emerald-950)] text-white">
      <div className="container-grid">
        <SectionHeading
          kicker="الأمان والمصداقية"
          title="تجربة واضحة، مب وعود فاضية"
          body="الثقة هنا مبنية على وضوح السعر، طريقة الطلب، والتأكيد قبل الشحن."
          light
        />
        <div className="mt-10 grid gap-4 md:grid-cols-4">
          {content.certifications.map(([title, text]) => (
            <div key={title} className="rounded-[1.7rem] border border-gold-400/25 bg-white/5 p-5 text-center">
              <p className="text-2xl font-black text-[var(--gold-300)]">{title}</p>
              <p className="mt-2 text-sm font-bold text-cream-100/80">{text}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] border border-gold-400/25 bg-white/5 p-6">
            <p className="text-4xl text-[var(--gold-300)]">“</p>
            <p className="mt-2 text-xl font-bold leading-9 text-cream-50">{content.expert.quote}</p>
            <p className="mt-5 font-black text-[var(--gold-300)]">{content.expert.name}</p>
            <p className="text-sm text-cream-100/70">{content.expert.title}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {content.metrics.map(([value, label]) => (
              <div key={`${value}-${label}`} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-3xl font-black text-[var(--gold-300)]">{value}</p>
                <p className="text-sm font-bold text-cream-100/80">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineSection({ content, slug }: { content: PageContent; slug: string }) {
  const meta =
    slug === "dubai-palace-oud-serum"
      ? {
          kicker: "لمسة فورية + روتين يومي",
          title: "٣ لحظات: من أول طبقة لحد ما البشرة «تشرب» الرطوبة",
          body: "ما نبيعج وعود شهر كامل من أول يوم — نشرح لج إحساس الراحة والنعومة اللي ممكن تحسّينه بسرعة، وكيف الروتين يثبت مع المكيف.",
        }
      : slug === "aroma-flame-lamp"
        ? {
            kicker: "ليلة بعد ليلة",
            title: "٣ لحظات: لما الغرفة تصير أهدى وأنعم",
            body: "من أول تشغيل لحد ما يصير طقس الليل عندج: ضباب خفيف، ضوء دافي، وعود يلفّ المكان — بدون نار ولا تعقيد.",
          }
        : {
            kicker: "النتيجة من أول تجربة",
            title: "إيش بتلاحظين خلال أول ٣٠ يوم؟",
            body: "نرتّب التوقعات خطوة خطوة عشان تتضحين إيش تختارين ومتى تستخدمين المنتج.",
          };

  return (
    <section className="section-padding bg-[var(--cream-50)]">
      <div className="container-grid">
        <SectionHeading kicker={meta.kicker} title={meta.title} body={meta.body} />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {content.timeline.map(([number, title, text]) => (
            <article key={number} className="premium-card">
              <span className="grid size-12 place-items-center rounded-full bg-[var(--emerald-950)] text-xl font-black text-[var(--gold-300)]">
                {number}
              </span>
              <h3 className="mt-5 text-2xl font-black text-[var(--emerald-950)]">{title}</h3>
              <p className="mt-3 leading-8 text-[var(--muted)]">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewsSection({ content }: { content: PageContent }) {
  return (
    <section className="section-padding bg-white">
      <div className="container-grid">
        <SectionHeading
          kicker="تجارب حقيقية"
          title="ما تقوله عميلات ليالي"
          body="تعليقات توضيحية حول التجربة والطلب. لا نعرض وعود علاجية أو نتائج غير مثبتة."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {content.reviews.map(([name, city, text]) => (
            <article key={`${name}-${city}`} className="premium-card flex min-h-[220px] flex-col p-7 lg:p-8">
              <p className="text-lg text-[var(--gold-500)]">★★★★★</p>
              <p className="mt-4 flex-1 text-base leading-8 text-[var(--muted)]">“{text}”</p>
              <p className="mt-6 font-black text-[var(--emerald-950)]">{name}</p>
              <p className="text-sm font-bold text-[var(--gold-500)]">{city} · عميلة مؤكدة</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ComparisonSection({ content, product }: { content: PageContent; product: Product }) {
  return (
    <section className="section-padding bg-[var(--cream-50)]">
      <div className="container-grid">
        <SectionHeading
          kicker="ليش ليالي تختلف؟"
          title="قارني — وقرّري بنفسك"
          body="كل بديل جرّبتيه من قبل، وليه ما أعطاج تجربة واضحة مثل صفحة منتج مرتّبة."
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-4 lg:gap-6">
          {content.comparisons.map(([title, subtitle, body]) => (
            <article key={title} className="rounded-[2rem] border border-[var(--border-gold)] bg-white p-6 lg:p-7">
              <h3 className="text-lg font-black text-[var(--emerald-950)] lg:text-xl">{title}</h3>
              <p className="mt-2 text-xs font-bold text-[var(--gold-500)] lg:text-sm">{subtitle}</p>
              <p className="mt-4 text-sm leading-8 text-[var(--muted)] lg:text-base">{body}</p>
            </article>
          ))}
          <article className="rounded-[2rem] border border-[var(--gold-400)] bg-[var(--emerald-950)] p-6 text-white shadow-2xl lg:col-span-1 lg:p-8">
            <h3 className="text-lg font-black text-[var(--gold-300)] lg:text-xl">{product.name}</h3>
            <p className="mt-2 text-xs font-bold text-cream-100">من {product.price} درهم</p>
            <p className="mt-4 text-sm leading-8 text-cream-100 lg:text-base">{product.subheading}</p>
          </article>
        </div>
      </div>
    </section>
  );
}

function FulfillmentSection({ content }: { content: PageContent }) {
  return (
    <section className="section-padding bg-[var(--emerald-950)] text-white">
      <div className="container-grid">
        <SectionHeading
          kicker="تأكيد · تجهيز · توصيل"
          title="مسار واضح عشان ما يصير لبس ولا إلغاء"
          body="نؤكد بالمكالمة، نجهز بتغليف أنيق، ونوصل داخل الإمارات — الدفع عند الاستلام فقط."
          light
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {content.guarantee.map(([title, text]) => (
            <article key={title} className="rounded-[2rem] border border-gold-400/25 bg-white/5 p-6 lg:p-7">
              <h3 className="text-xl font-black text-[var(--gold-300)] lg:text-2xl">{title}</h3>
              <p className="mt-3 text-sm leading-8 text-cream-100 lg:text-base">{text}</p>
            </article>
          ))}
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {content.delivery.map(([title, text], index) => (
            <article key={title} className="rounded-[2rem] border border-gold-400/20 bg-black/15 p-6 lg:p-7">
              <span className="text-3xl font-black text-[var(--gold-300)]">{index + 1}</span>
              <h3 className="mt-3 text-lg font-black text-white lg:text-xl">{title}</h3>
              <p className="mt-2 text-sm leading-7 text-cream-100/85">{text}</p>
            </article>
          ))}
        </div>
        <div className="mt-10 rounded-[2rem] border border-gold-400/25 bg-white/5 p-6 text-center">
          <h3 className="text-xl font-black text-[var(--gold-300)]">نوصل داخل الإمارات</h3>
          <p className="mt-3 text-sm leading-8 text-cream-100/85">
            دبي · أبوظبي · الشارقة · عجمان · رأس الخيمة · الفجيرة · أم القيوين · العين وباقي المناطق حسب التوفر.
          </p>
        </div>
      </div>
    </section>
  );
}

function FaqSection({ content }: { content: PageContent }) {
  return (
    <section className="section-padding bg-white">
      <div className="container-grid">
        <SectionHeading
          kicker="قبل ما تطلبين"
          title="كل اللي تحتاجين تعرفينه"
          body="أسئلة المنتج، الشحن، والدفع قبل تثبيت الطلب."
        />
        <div className="mx-auto mt-10 grid max-w-4xl gap-4">
          {content.faq.map(([question, answer]) => (
            <details key={question} className="rounded-3xl border border-[var(--border-gold)] bg-[var(--cream-50)] p-5">
              <summary className="cursor-pointer font-black text-[var(--emerald-950)]">{question}</summary>
              <p className="mt-3 leading-8 text-[var(--muted)]">{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function RelatedProducts({ product }: { product: Product }) {
  const related = products.filter((item) => item.sku !== product.sku).slice(0, 2);
  if (!related.length) return null;

  return (
    <section className="section-padding bg-[var(--cream-50)]">
      <div className="container-grid">
        <SectionHeading
          kicker="اكتشفي أكثر"
          title="منتجات أخرى من ليالي"
          body="لكل حاجة تجربة مخصصة — ادخلي للتفاصيل أول، وبعدين قرري."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {related.map((item) => (
            <ProductCard key={item.sku} product={item} showAddButton={false} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    notFound();
  }

  const content = PAGE_CONTENT[slug] ?? DEFAULT_CONTENT;

  return (
    <div className="pb-[calc(6.25rem+env(safe-area-inset-bottom,0px))]">
      <ProductHero key={slug} product={product} />
      <StatStrip content={content} />
      <CodReassuranceStrip />
      <ProblemSection content={content} />
      <IngredientsSection content={content} />
      <CredibilitySection content={content} />
      <TimelineSection content={content} slug={slug} />
      <ReviewsSection content={content} />
      <ComparisonSection content={content} product={product} />
      <FulfillmentSection content={content} />
      <FaqSection content={content} />
      <RelatedProducts product={product} />
    </div>
  );
}
