import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { ProductHero } from "@/components/ProductHero";
import { getProduct, products, type Product } from "@/lib/products";

const DEFAULT_OBJECTIONS: [string, string][] = [
  ["هل الموقع موثوق؟", "الدفع عند الاستلام، رقم واضح، وتأكيد قبل الشحن. ما كاين حتى دفع أونلاين."],
  ["واش المنتج كيستاهل السعر؟", "الثمن مبني على تجربة كاملة: عرض فخم، تغليف، تعليمات، ودعم قبل الشحن."],
  ["واش غادي يوصلي نفس اللي شفت؟", "نؤكد الطلب قبل الشحن ونخلي كل التفاصيل واضحة باش تقل المفاجآت."],
];

const AROMA_OBJECTIONS: [string, string][] = [
  [
    "هل المتجر موثوق؟",
    "نعم. الدفع عند الاستلام داخل دولة الإمارات، مع أرقام تواصل واضحة وتأكيد الطلب قبل الشحن. لا نطلب أي دفع إلكتروني مسبق.",
  ],
  [
    "هل السعر يعكس قيمة المنتج؟",
    "السعر يغطي التغليف والتعليمات والمتابعة قبل الشحن، لتكون التجربة واضحة منذ البداية.",
  ],
  [
    "هل أستلم نفس المنتج المعروض؟",
    "نؤكد تفاصيل الطلب قبل الشحن ونوضح المحتوى لتقليل أي التباس عند الاستلام.",
  ],
];

const DEFAULT_FLOW: [string, string][] = [
  ["اختاري العرض", "اختاري الباقة أو السيروم المناسب. زر الطلب يضيف العرض للسلة مباشرة."],
  ["راجعي الإضافة", "السلة تقترح إضافة مناسبة ترفع قيمة الطلب مع نفس التوصيل."],
  ["ثبتي الطلب", "اكتبي الاسم ورقم الإمارات فقط. الدفع عند الاستلام والتأكيد قبل الشحن."],
];

const AROMA_FLOW: [string, string][] = [
  [
    "اختاري العرض",
    "اختاري الباقة المناسبة من الصفحة. زر الإضافة يضع العرض في سلة التسوق مباشرة.",
  ],
  [
    "راجعي السلة",
    "قد تعرض سلة التسوق إضافات مقترحة ضمن نفس شحنة التوصيل داخل الإمارات.",
  ],
  [
    "ثبّتي الطلب",
    "أدخلي الاسم الكامل ورقم الهاتف المسجّل في الإمارات. الدفع عند الاستلام بعد تأكيد الطلب.",
  ],
];

const DEFAULT_REVIEWS = [
  "أهم شيء عندي إن الطلب واضح وما احتجت أدفع قبل الاستلام.",
  "حسيت البراند مرتب من أول صفحة، والسلة فيها كل التفاصيل قبل التأكيد.",
  "عجبني أنهم يوضحون الخطوات قبل الشحن، هذا يخليني أثق أكثر.",
];

const AROMA_REVIEWS = [
  "اطمأننتُ لأن الدفع كان عند الاستلام والخطوات كانت واضحة.",
  "تجربة تسوق مرتبة من أول صفحة، والتفاصيل قبل التأكيد كانت مفيدة.",
  "أعجبني التوضيح قبل الشحن؛ يمنح ثقة أكبر عند إتمام الطلب.",
];

const DEFAULT_FAQ: [string, string][] = [
  ["هل الدفع عند الاستلام؟", "نعم. لا تدفعين الآن. الدفع يكون عند الاستلام بعد تأكيد الطلب."],
  ["متى يتواصل معي الفريق؟", "بعد إرسال الطلب، يظهر لك رقم الطلب وسيتواصل فريق التأكيد قبل الشحن."],
  ["هل أقدر أضيف السيرومات؟", "نعم، السلة تقترح الإضافات المناسبة قبل الفورم لرفع قيمة الطلب في نفس الشحنة."],
  ["هل المنتجات تغيرت؟", "لا. المنتجات والأسعار والألوان بقيت كما هي؛ غيرنا فقط ترتيب الصفحة والكتابة لتكون أوضح وأقوى."],
];

const AROMA_FAQ: [string, string][] = [
  ["هل الدفع عند الاستلام؟", "نعم. لا يُطلب دفع إلكتروني مسبق. يتم الدفع نقداً عند استلام الشحنة بعد تأكيد الطلب."],
  [
    "متى يتواصل فريق التأكيد؟",
    "بعد إرسال الطلب يظهر رقم الطلب، ويتواصل فريق التأكيد معكِ قبل تجهيز الشحنة.",
  ],
  [
    "هل يمكن إضافة السيرومات؟",
    "نعم. قد تعرض سلة التسوق إضافات مقترحة قبل إتمام الطلب ضمن نفس شحنة التوصيل.",
  ],
  [
    "هل تغيّر المنتج أو السعر؟",
    "لا. المحتوى المعروض هو نفسه؛ قد نحدّث صياغة الصفحة أو الترتيب لتحسين الوضوح.",
  ],
];

const AROMA_TRUST_BULLETS = [
  "من دون دفع إلكتروني مسبق: يبسّط القرار ويقلل القلق.",
  "التأكيد قبل الشحن: يقلل نسيان الطلب أو الرفض عند التوصيل.",
  "الإضافات داخل سلة التسوق: ترفع قيمة الطلب دون تشتيت بين الصفحات.",
  "صفحة الشكر توضح أن فريق التأكيد سيتواصل معكِ قبل الإرسال.",
];

const DEFAULT_TRUST_BULLETS = [
  "لا دفع أونلاين: القرار أسهل وأقل خوف.",
  "التأكيد قبل الشحن: يقلل نسيان الطلب والرفض عند التوصيل.",
  "الإضافة داخل السلة: ترفع قيمة الطلب بدون تشتيت صفحة المنتج.",
  "صفحة الشكر واضحة: تذكرها أن فريق التأكيد سيتواصل معها.",
];

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

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    notFound();
  }

  const isAroma = slug === "aroma-flame-lamp";
  const objections = isAroma ? AROMA_OBJECTIONS : DEFAULT_OBJECTIONS;
  const flowSteps = isAroma ? AROMA_FLOW : DEFAULT_FLOW;
  const reviews = isAroma ? AROMA_REVIEWS : DEFAULT_REVIEWS;
  const faqItems = isAroma ? AROMA_FAQ : DEFAULT_FAQ;
  const trustBullets = isAroma ? AROMA_TRUST_BULLETS : DEFAULT_TRUST_BULLETS;

  const related: Product[] = isAroma
    ? []
    : products.filter((item) => item.sku !== product.sku).slice(0, 3);

  return (
    <div>
      <ProductHero key={slug} product={product} />

      <section className="bg-[var(--cream-50)] px-4 py-16">
        <div className="container-grid">
          <div className="section-heading">
            <p className="badge">طريقة ليالي</p>
            <h2>
              {isAroma
                ? "تجربة واضحة من أول صفحة — ليست صفحة بيع عشوائية"
                : "من أول نظرة تعرفين أنها تجربة مرتبة، مو صفحة بيع عشوائية"}
            </h2>
            <p>
              {isAroma
                ? "هذه الصفحة تجيب عن أسئلة الثقة قبل إتمام الطلب: العرض، منطقية السعر، طريقة التأكيد، وخيارات الإضافة."
                : "بنينا صفحة المنتج باش تجاوب على أسئلة الثقة قبل ما تطلبين: شنو العرض، علاش السعر منطقي، كيفاش التأكيد، وفين تزيدين الإضافة."}
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {objections.map(([question, answer]) => (
              <div key={question} className="premium-card">
                <p className="text-sm font-bold text-[var(--gold-500)]">سؤال قبل الطلب</p>
                <h3 className="mt-2 text-xl font-black text-[var(--emerald-950)]">{question}</h3>
                <p className="mt-3 leading-8 text-[var(--muted)]">{answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16">
        <div className="container-grid grid items-center gap-10 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-[var(--border-gold)] bg-[var(--cream-50)] p-8">
            <p className="section-kicker">من الطلب للباب</p>
            <h2 className="section-title">ثلاث خطوات واضحة قبل أي شحن.</h2>
            <div className="mt-8 space-y-4">
              {flowSteps.map(([title, text], index) => (
                <div key={title} className="flex gap-4 rounded-2xl bg-white p-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--emerald-950)] text-sm font-bold text-[var(--gold-300)]">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-black text-[var(--emerald-950)]">{title}</h3>
                    <p className="mt-1 text-sm leading-7 text-[var(--muted)]">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="section-kicker">تفاصيل تزيد التأكيد</p>
            <h2 className="section-title">
              {isAroma ? "وضوح أكبر من الوعود البعيدة" : "العميلة تحتاج وضوح أكثر من وعود كبيرة."}
            </h2>
            <p className="mt-5 text-lg leading-9 text-[var(--muted)]">
              {isAroma
                ? "لذلك يضيف زر الطلب العرض إلى سلة التسوق، وقد تعرض السلة إضافات مقترحة، ويطلب النموذج الاسم ورقم الهاتف فقط. كل خطوة تهدف إلى تقليل التردد وزيادة فرصة تأكيد الطلب واستلامه داخل الإمارات."
                : "لذلك نخلي زر الطلب يضيف العرض للسلة، والسلة توري الإضافة المناسبة، والفورم يطلب فقط الاسم والرقم. كل خطوة تقلل التردد وتزيد فرصة تأكيد الطلب واستلامه."}
            </p>
            <div className="mt-6 grid gap-3">
              {trustBullets.map((item) => (
                <div key={item} className="rounded-2xl border border-[var(--border-gold)] p-4 text-[var(--muted)]">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--emerald-950)] px-4 py-16 text-white">
        <div className="container-grid">
          <div className="mx-auto max-w-3xl text-center">
            <p className="section-kicker text-[var(--gold-300)]">تجارب عميلات</p>
            <h2 className="text-4xl font-bold">
              {isAroma ? "تعليقات توضيحية — ليست شهادات طبية" : "نساء يطلبون لما يحسون أن كل شيء واضح"}
            </h2>
            <p className="mt-4 leading-8 text-white/75">
              {isAroma
                ? "عبارات عامة حول تجربة الطلب والوضوح. لا نعرض ادعاءات علاجية أو نتائج طبية غير مثبتة."
                : "هذه نصوص مؤقتة حتى تجمعين مراجعات حقيقية. لا نعرض ادعاءات علاجية أو شهادات غير مثبتة."}
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {reviews.map((review) => (
              <div key={review} className="rounded-3xl border border-[var(--border-gold)] bg-white/5 p-6">
                <p className="text-[var(--gold-300)]">★★★★★</p>
                <p className="mt-4 leading-8 text-white/80">“{review}”</p>
                <p className="mt-4 text-sm text-[var(--gold-300)]">عميلة من الإمارات</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {!isAroma && related.length > 0 && (
        <section className="bg-[var(--cream-50)] px-4 py-16">
          <div className="container-grid">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="section-kicker">اختيارات تكمل طلبك</p>
                <h2 className="section-title">أضيفي لمسة ثانية للسلة.</h2>
              </div>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {related.map((item) => (
                <ProductCard key={item.sku} product={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-white px-4 py-16">
        <div className="container-grid">
          <div className="mx-auto max-w-3xl text-center">
            <p className="section-kicker">أسئلة شائعة</p>
            <h2 className="section-title">أسئلة قبل تثبيت الطلب</h2>
          </div>
          <div className="mx-auto mt-10 grid max-w-4xl gap-4">
            {faqItems.map(([question, answer]) => (
              <details key={question} className="rounded-3xl border border-[var(--border-gold)] bg-[var(--cream-50)] p-5">
                <summary className="cursor-pointer font-black text-[var(--emerald-950)]">{question}</summary>
                <p className="mt-3 leading-8 text-[var(--muted)]">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
