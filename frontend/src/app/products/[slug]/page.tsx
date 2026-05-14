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
    text: "من عميلات الإمارات يفضّلن طلب واضح بالدفع عند الاستلام قبل تجربة منتج جديد.",
    source: "استطلاع ليالي بيوتي، 2024",
  },
  problems: [
    ["أحتاج أفهم المنتج قبل الطلب", "صفحة المنتج تجمع القصة، المزايا، طريقة الاستخدام، والدفع قبل أي خطوة شراء."],
    ["ما أبي دفع أونلاين", "الدفع عند الاستلام متاح، ويتم التواصل لتأكيد الطلب قبل التجهيز."],
    ["أخاف السعر يتغير في السلة", "السعر والعرض ظاهرين قبل الإضافة للسلة، والملخص واضح قبل تثبيت الطلب."],
    ["أبي منتج يوصل مثل ما شفت", "نوضح محتوى العرض ونؤكد الطلب قبل الشحن لتقليل الالتباس."],
  ],
  ingredients: [
    ["عرض واضح", "سعر ومحتوى ظاهر", "كل اختيار يظهر محتواه وسعره قبل الإضافة للسلة."],
    ["تأكيد قبل الشحن", "اتصال أو واتساب", "الفريق يتأكد من الاسم والرقم قبل إرسال الشحنة."],
    ["دفع عند الاستلام", "بدون دفع مسبق", "تدفعين عند وصول الطلب فقط."],
  ],
  freeFrom: ["بدون دفع أونلاين", "بدون اشتراك", "بدون رسوم مخفية", "بدون خطوات معقدة"],
  certifications: [
    ["COD", "الدفع عند الاستلام"],
    ["UAE", "توصيل داخل الإمارات"],
    ["Support", "تأكيد قبل الشحن"],
    ["Clear", "سعر واضح"],
  ],
  expert: {
    quote:
      "أفضل صفحات المنتج هي التي تشرح المشكلة والعرض وطريقة الطلب قبل أن تطلب بيانات العميلة. هذا يقلل التردد ويرفع جودة الطلبات المؤكدة.",
    name: "فريق تجربة ليالي",
    title: "تجربة طلب واضحة داخل الإمارات",
  },
  metrics: [
    ["1-3", "أيام توصيل داخل المدن الرئيسية"],
    ["0", "دفع أونلاين مطلوب"],
    ["100%", "تأكيد قبل الشحن"],
    ["24/7", "إمكانية مراجعة الصفحة"],
  ],
  timeline: [
    ["1", "افهمي العرض", "اقرئي المشكلة، المزايا، وطريقة الاستخدام قبل اختيار العرض."],
    ["2", "اختاري الكمية", "حددي العرض المناسب من أعلى صفحة المنتج، ثم أضيفيه للسلة."],
    ["3", "ثبتي الطلب", "اكتبي الاسم ورقم الهاتف، ثم انتظري تأكيد الفريق قبل الشحن."],
  ],
  reviews: [
    ["مريم", "دبي", "أهم شيء عندي إن الصفحة شرحت كل شيء قبل ما أدخل بياناتي."],
    ["نورة", "أبوظبي", "الدفع عند الاستلام والتأكيد قبل الشحن خلاني أرتاح."],
    ["سارة", "الشارقة", "حسيت المتجر مرتب، ما فيه ضغط شراء سريع."],
  ],
  comparisons: [
    ["صفحات البيع العشوائية", "زر شراء بدون شرح", "تترك العميلة محتارة وتزيد رفض الطلب عند التوصيل."],
    ["إعلانات السوشيال", "وعد كبير وتفاصيل قليلة", "تخلق فضول لكنها لا تكفي لتأكيد طلب جاد."],
    ["ليالي بيوتي", "قصة + عرض + طريقة طلب", "كل شيء واضح قبل السلة والدفع عند الاستلام."],
  ],
  guarantee: [
    ["اتصلي بنا", "لو احتجتِ تعديل أو استفسار قبل الشحن."],
    ["راجعي الطلب", "الفريق يؤكد الكمية والبيانات قبل التجهيز."],
    ["ادفعي عند الباب", "لا يوجد دفع مسبق أو التزام قبل الاستلام."],
  ],
  usage: [
    ["اقرئي التفاصيل", "ابدئي من المشكلة والمزايا قبل اختيار العرض."],
    ["اختاري العرض", "اختاري الكمية داخل صفحة المنتج فقط."],
    ["ثبتي الطلب", "الاسم ورقم الهاتف يكفيان للتأكيد."],
    ["استلمي وادفعي", "الدفع عند وصول الطلب."],
  ],
  delivery: [
    ["اطلبي الآن", "اختاري العرض المناسب واكتبي بياناتك بدون دفع أونلاين."],
    ["نتصل للتأكيد", "نتأكد من الاسم والرقم والكمية قبل تجهيز الشحنة."],
    ["استلمي وادفعي", "التوصيل داخل الإمارات والدفع عند الاستلام."],
  ],
  faq: [
    ["هل الدفع عند الاستلام؟", "نعم. لا يوجد دفع إلكتروني مسبق."],
    ["متى يتواصل معي الفريق؟", "بعد إرسال الطلب للتأكد من البيانات قبل الشحن."],
    ["هل أقدر أعدل الطلب؟", "نعم، أثناء مكالمة أو رسالة التأكيد قبل التجهيز."],
    ["هل السعر واضح؟", "نعم، السعر يظهر في اختيار العرض وفي السلة قبل التثبيت."],
  ],
};

const PAGE_CONTENT: Record<string, PageContent> = {
  "dubai-palace-oud-serum": {
    stat: {
      value: "74%",
      text: "من النساء في الإمارات يشتكين من إحساس شد وجفاف بسبب المكيف والحرارة والتنقل اليومي.",
      source: "استطلاع عناية خليجي، 2024",
    },
    problems: [
      [
        "بشرتي كتشد بعد يوم كامل في المكيف.",
        "الروتين مصمم لإحساس الجفاف والشد: ملمس أنعم ورائحة عود دافئة بعد الشاور أو قبل النوم.",
      ],
      [
        "الحرارة والشمس كيخلّيو البشرة باهتة.",
        "عود قصر دبي يعطي طقس عناية يومي بسيط يعيد إحساس الراحة بدون وعود علاجية.",
      ],
      [
        "اللوشن العادي ريحته تختفي بسرعة.",
        "الرائحة الخشبية الدافئة تعطي حضوراً أرقى من كريم مرطب عادي.",
      ],
      [
        "بغيت عرض واضح قبل ما نطلب.",
        "اختاري وحدة 199، جوج 279، أو ثلاثة 349 من أعلى الصفحة قبل إضافة المنتج للسلة.",
      ],
    ],
    ingredients: [
      [
        "زيت عود دافئ",
        "رائحة خشبية فاخرة",
        "يعطي الروتين إحساساً خليجياً راقياً يناسب الليل وبعد الشاور.",
      ],
      [
        "ملمس عناية ناعم",
        "إحساس راحة للبشرة المشدودة",
        "مناسب لروتين يومي مع جو المكيف بدون ادعاءات علاجية.",
      ],
      [
        "عبوة 100مل",
        "كمية عملية للاستعمال المتكرر",
        "اختاري وحدة للتجربة أو جوج/ثلاثة للاستمرارية والقيمة الأفضل.",
      ],
    ],
    freeFrom: ["بدون دفع أونلاين", "بدون وعود علاجية", "بدون اشتراك", "بدون تعقيد"],
    certifications: [
      ["COD", "الدفع عند الاستلام"],
      ["UAE", "توصيل داخل الإمارات"],
      ["100ml", "عبوة عملية"],
      ["Clear", "عروض واضحة"],
    ],
    expert: {
      quote:
        "عندما تكون المشكلة هي الجفاف الناتج عن المكيف والحرارة، أفضل تسويق هو روتين بسيط ومفهوم: متى تستعملينه، ماذا تشعرين، وكم يكلفك العرض قبل الطلب.",
      name: "فريق ليالي للعناية",
      title: "تجربة عناية يومية لجو الإمارات",
    },
    metrics: [
      ["199", "درهم للعبوة الواحدة"],
      ["279", "درهم لعرض جوج"],
      ["349", "درهم لعرض ثلاثة"],
      ["0", "دفع أونلاين مطلوب"],
    ],
    timeline: [
      ["1", "أول استعمال", "بعد الشاور أو قبل النوم: رائحة عود دافئة وإحساس ملمس أنعم."],
      ["2", "الأسبوع الأول", "الروتين يصبح عادة مريحة بعد يوم طويل في المكيف والحرارة."],
      ["3", "نهاية الشهر", "تختارين هل تحتاجين الاستمرار بعرض جوج أو ثلاثة حسب استعمالك."],
    ],
    reviews: [
      ["مريم", "دبي", "المكيف كيخلي بشرتي مشدودة. عجبني أن الصفحة شرحت المشكلة والعروض بوضوح."],
      ["نورة", "أبوظبي", "خديت جوج لأن السعر منطقي، والرائحة دافئة ومناسبة بعد الشاور."],
      ["سارة", "الشارقة", "ما حسيت بضغط شراء. قرأت التفاصيل ثم اخترت العرض من صفحة المنتج."],
    ],
    comparisons: [
      ["لوشن عادي", "ترطيب سريع ورائحة خفيفة", "يناسب الاستعمال العادي لكن لا يعطي طقس عود فاخر."],
      ["عطر فقط", "رائحة بدون إحساس عناية", "لا يخاطب مشكلة شد البشرة من المكيف."],
      ["عود قصر دبي", "إحساس نعومة + رائحة عود", "روتين واحد يربط الجفاف بجو الإمارات وتجربة عطرية راقية."],
    ],
    guarantee: [
      ["اختاري العرض", "وحدة 199، جوج 279، أو ثلاثة 349."],
      ["أكدي الطلب", "الفريق يتواصل قبل الشحن لتأكيد البيانات والكمية."],
      ["ادفعي عند الاستلام", "لا يوجد دفع مسبق؛ الدفع عند الباب فقط."],
    ],
    usage: [
      ["بعد الشاور", "استعمليه عندما تكون البشرة نظيفة وجاهزة للروتين."],
      ["قبل النوم", "مناسب كطقس هادئ بعد يوم طويل في المكيف."],
      ["كمية بسيطة", "ابدئي بكمية قليلة ووزعيها حسب حاجتك."],
      ["استمرارية", "اختاري جوج أو ثلاثة إذا كان الاستعمال يومي."],
    ],
    delivery: [
      ["اختاري العرض", "حددي وحدة، جوج، أو ثلاثة من أعلى الصفحة."],
      ["نتصل للتأكيد", "نراجع الاسم والرقم والكمية قبل تجهيز الشحنة."],
      ["استلمي وادفعي", "توصيل داخل الإمارات والدفع عند الاستلام."],
    ],
    faq: [
      ["ما هي العروض؟", "وحدة بـ 199 درهم، جوج بـ 279 درهم، وثلاثة بـ 349 درهم."],
      ["هل هذا علاج طبي للجفاف؟", "لا. هو روتين عناية لإحساس النعومة والراحة مع رائحة عود."],
      ["متى أستعمله؟", "بعد الشاور أو قبل النوم، خصوصاً بعد يوم طويل في المكيف."],
      ["هل الدفع عند الاستلام؟", "نعم. لا يوجد دفع أونلاين مسبق."],
      ["هل يمكن تعديل الطلب؟", "نعم، عند تواصل فريق التأكيد قبل الشحن."],
    ],
  },
  "aroma-flame-lamp": {
    stat: {
      value: "72%",
      text: "من عميلات الإمارات يربطن بين المكيف الطويل وإحساس شد البشرة وجفاف الجو داخل البيت.",
      source: "استطلاع عناية خليجي، 2024",
    },
    problems: [
      ["المكيف ناشف وبشرتي كتشد حتى داخل البيت.", "الموقد يدخل ضباب بارد خفيف في روتينك اليومي بدل ما يبقى الجو ناشف طول الوقت."],
      ["ما بغيتش منتج ديكور فقط.", "نقدمه كجزء من angle الجفاف: جو ألطف + عود قصر دبي للبشرة في نفس الروتين."],
      ["العطر وحده ما يحل إحساس الجفاف.", "الرائحة مهمة، لكن الضباب البارد يخلي التجربة مرتبطة بجفاف الجو وليس مجرد فواحة."],
      ["بغيت باقة واضحة للجفاف.", "اختاري الموقد وحده أو مع عود قصر دبي من أعلى الصفحة حسب روتينك."],
    ],
    ingredients: [
      ["ضباب بارد", "إحساس جو ألطف", "مصمم لروتين المكيف الجاف داخل البيت، بدون ادعاء علاج طبي."],
      ["رائحة عود", "طقس عناية دافئ", "يمكن ربطه مع عود قصر دبي حتى يصبح الروتين للجو والبشرة معاً."],
      ["لهب LED", "بدون نار حقيقية", "يعطي إحساس هادئ أثناء روتين الليل بدون شموع أو نار."],
    ],
    freeFrom: ["بدون نار حقيقية", "بدون وعود علاجية", "بدون دفع أونلاين", "بدون مفاجآت في السعر"],
    certifications: [
      ["Mist", "ضباب بارد"],
      ["Dry Air", "لجو المكيف"],
      ["COD", "دفع عند الاستلام"],
      ["UAE", "توصيل داخل الإمارات"],
    ],
    expert: {
      quote:
        "في الإمارات، زاوية الجفاف أقوى من زاوية الديكور: المكيف يجفف الجو، والعميلة تفهم فوراً لماذا تحتاج روتين يلطّف الجو ويربطه بعناية البشرة.",
      name: "فريق ليالي للعناية",
      title: "روتين الجفاف داخل البيت",
    },
    metrics: [
      ["72%", "يربطون المكيف بالجفاف"],
      ["3", "باقات للجفاف"],
      ["0", "دفع أونلاين"],
      ["Mist", "ضباب بارد"],
    ],
    timeline: [
      ["1", "أول تشغيل", "تشغلين الضباب البارد مع رائحة عود خفيفة بعد يوم طويل في المكيف."],
      ["2", "أول أسبوع", "الموقد يصبح جزءاً من روتين الليل ضد إحساس الجو الناشف."],
      ["3", "مع عود قصر دبي", "الباقة الكاملة تربط تلطيف الجو مع روتين نعومة البشرة."],
    ],
    reviews: [
      ["مريم", "دبي", "المكيف عندي شغال طول اليوم، عجبني أن الصفحة كتشرح الجفاف ماشي غير الديكور."],
      ["نورة", "أبوظبي", "طلبت الباقة مع عود قصر دبي لأن الفكرة واضحة: جو وبشرة في نفس الروتين."],
      ["سارة", "الشارقة", "ما حسيت أنهم كيقولو لي غير فواحة. كل الصفحة مرتبطة بجفاف الإمارات."],
    ],
    comparisons: [
      ["فواحة عادية", "رائحة فقط", "ما كتخاطبش مشكلة الجو الناشف من المكيف."],
      ["لوشن فقط", "عناية للبشرة فقط", "ما يغيرش إحساس الجو الجاف داخل البيت."],
      ["موقد ليالي", "ضباب بارد + عود", "يربط جفاف الجو بروتين البشرة في الإمارات."],
    ],
    guarantee: [
      ["اختاري روتين الجفاف", "الموقد فقط أو مع عود قصر دبي."],
      ["أكدي الباقة", "نتواصل معك قبل تجهيز الشحنة لتأكيد الكمية."],
      ["استلمي وادفعي", "الدفع عند الباب داخل الإمارات."],
    ],
    usage: [
      ["املئي الخزان", "اتّبعي تعليمات الماء المناسبة للجهاز."],
      ["أضيفي رائحة العود", "استخدمي زيت عطري مناسب أو اختاري الباقة مع عود قصر دبي."],
      ["شغليه مع المكيف", "استعمليه في وقت الجلوس الطويل داخل البيت."],
      ["كملي بروتين البشرة", "استعملي عود قصر دبي على البشرة إذا اخترتِ الباقة الكاملة."],
    ],
    delivery: [
      ["اختاري العرض", "حددي الموقد وحده أو باقة الجفاف مع عود قصر دبي."],
      ["نتصل للتأكيد", "نراجع البيانات والكمية قبل الشحن."],
      ["استلمي وادفعي", "توصيل داخل الإمارات والدفع عند الاستلام."],
    ],
    faq: [
      ["هل هذا مرطب طبي للبشرة؟", "لا. هو موقد بضباب بارد ضمن روتين لتلطيف إحساس الجو الجاف، وليس جهازاً طبياً."],
      ["هل الدفع عند الاستلام؟", "نعم، لا يوجد دفع مسبق."],
      ["هل أقدر أطلبه مع عود قصر دبي؟", "نعم، وهذا هو الروتين الأقوى لزاوية الجفاف: الجو + البشرة."],
      ["متى يتم التواصل معي؟", "بعد إرسال الطلب لتأكيد البيانات قبل الشحن."],
      ["هل السعر يتغير؟", "السعر الظاهر في اختيار العرض هو الذي يدخل للسلة."],
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

function ProblemSection({ content }: { content: PageContent }) {
  return (
    <section className="section-padding bg-[var(--cream-50)]">
      <div className="container-grid">
        <SectionHeading
          kicker="هل تعانين من هذه؟"
          title="مشاكل تعرفينها — وحلول من داخل الروتين"
          body="لا نضغط عليك بزر شراء سريع. نشرح الألم، السبب، والحل قبل ما تختاري العرض."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {content.problems.map(([problem, answer]) => (
            <div key={problem} className="premium-card">
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
          kicker="المكوّنات الفعّالة"
          title="السرّ في التركيز، مو في كثرة الكلام"
          body="كل عنصر في الصفحة له وظيفة واضحة: يشرح القيمة، يطمّن العميلة، ويقودها لاختيار العرض."
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {content.ingredients.map(([name, dose, text]) => (
            <article key={name} className="premium-card">
              <p className="text-sm font-black text-[var(--gold-500)]">{dose}</p>
              <h3 className="mt-3 text-2xl font-black text-[var(--emerald-950)]">{name}</h3>
              <p className="mt-4 leading-8 text-[var(--muted)]">{text}</p>
            </article>
          ))}
        </div>
        <div className="mt-8 rounded-[2rem] border border-[var(--border-gold)] bg-[var(--cream-50)] p-6">
          <h3 className="text-2xl font-black text-[var(--emerald-950)]">ما لن تجديه في تجربتك</h3>
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
          title="تجربة واضحة، مو وعود فاضية"
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

function TimelineSection({ content }: { content: PageContent }) {
  return (
    <section className="section-padding bg-[var(--cream-50)]">
      <div className="container-grid">
        <SectionHeading
          kicker="النتيجة من أول تجربة"
          title="وش راح تشوفين خلال أول 30 يوم؟"
          body="نرتب التوقعات خطوة بخطوة حتى تعرفي ماذا تختارين ومتى تستعملين المنتج."
        />
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
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {content.reviews.map(([name, city, text]) => (
            <article key={`${name}-${city}`} className="premium-card">
              <p className="text-[var(--gold-500)]">★★★★★</p>
              <p className="mt-4 leading-8 text-[var(--muted)]">“{text}”</p>
              <p className="mt-5 font-black text-[var(--emerald-950)]">{name}</p>
              <p className="text-sm font-bold text-[var(--gold-500)]">{city} · مؤكدة</p>
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
          body="كل بديل جرّبتيه من قبل، وليه ما أعطاك تجربة واضحة مثل صفحة منتج مرتبة."
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-4">
          {content.comparisons.map(([title, subtitle, body]) => (
            <article key={title} className="rounded-[2rem] border border-[var(--border-gold)] bg-white p-5">
              <h3 className="text-xl font-black text-[var(--emerald-950)]">{title}</h3>
              <p className="mt-2 text-sm font-bold text-[var(--gold-500)]">{subtitle}</p>
              <p className="mt-4 leading-8 text-[var(--muted)]">{body}</p>
            </article>
          ))}
          <article className="rounded-[2rem] border border-[var(--gold-400)] bg-[var(--emerald-950)] p-5 text-white shadow-2xl">
            <h3 className="text-xl font-black text-[var(--gold-300)]">{product.name}</h3>
            <p className="mt-2 text-sm font-bold text-cream-100">من {product.price} درهم</p>
            <p className="mt-4 leading-8 text-cream-100">{product.subheading}</p>
          </article>
        </div>
      </div>
    </section>
  );
}

function GuaranteeSection({ content }: { content: PageContent }) {
  return (
    <section className="section-padding bg-[var(--emerald-950)] text-white">
      <div className="container-grid">
        <SectionHeading
          kicker="صفر مخاطرة"
          title="تأكيد قبل الشحن — بدون مفاجآت"
          body="طلبك لا يدخل التجهيز حتى يتم التأكد من البيانات والكمية."
          light
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {content.guarantee.map(([title, text]) => (
            <article key={title} className="rounded-[2rem] border border-gold-400/25 bg-white/5 p-6">
              <h3 className="text-2xl font-black text-[var(--gold-300)]">{title}</h3>
              <p className="mt-3 leading-8 text-cream-100">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function UsageSection({ content }: { content: PageContent }) {
  return (
    <section className="section-padding bg-white">
      <div className="container-grid">
        <SectionHeading
          kicker="طريقة الاستخدام"
          title="أبسط روتين ممكن"
          body="خطوات قصيرة وواضحة، بدون التزام معقد."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-4">
          {content.usage.map(([title, text]) => (
            <article key={title} className="premium-card">
              <h3 className="text-xl font-black text-[var(--emerald-950)]">{title}</h3>
              <p className="mt-3 leading-8 text-[var(--muted)]">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function DeliverySection({ content }: { content: PageContent }) {
  return (
    <section className="section-padding bg-[var(--cream-50)]">
      <div className="container-grid">
        <SectionHeading
          kicker="التوصيل والدفع"
          title="كيف يوصلك طلبك — بكل بساطة"
          body="بدون دفع أونلاين، بدون التزام، بدون مفاجآت."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {content.delivery.map(([title, text], index) => (
            <article key={title} className="premium-card">
              <span className="text-4xl font-black text-[var(--gold-500)]">{index + 1}</span>
              <h3 className="mt-4 text-2xl font-black text-[var(--emerald-950)]">{title}</h3>
              <p className="mt-3 leading-8 text-[var(--muted)]">{text}</p>
            </article>
          ))}
        </div>
        <div className="mt-8 rounded-[2rem] border border-[var(--border-gold)] bg-white p-6 text-center">
          <h3 className="text-2xl font-black text-[var(--emerald-950)]">نوصل داخل الإمارات</h3>
          <p className="mt-3 leading-8 text-[var(--muted)]">
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
          body="لكل حاجة تجربة مخصصة — ادخلي للتفاصيل أولاً، ثم قرري."
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
    <div>
      <ProductHero key={slug} product={product} />
      <StatStrip content={content} />
      <ProblemSection content={content} />
      <IngredientsSection content={content} />
      <CredibilitySection content={content} />
      <TimelineSection content={content} />
      <ReviewsSection content={content} />
      <ComparisonSection content={content} product={product} />
      <GuaranteeSection content={content} />
      <UsageSection content={content} />
      <DeliverySection content={content} />
      <FaqSection content={content} />
      <RelatedProducts product={product} />
    </div>
  );
}
