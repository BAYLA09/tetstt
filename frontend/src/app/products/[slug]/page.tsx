import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Package, RefreshCcw, Shield, Star, Truck } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { ProductHero } from "@/components/ProductHero";
import { products } from "@/lib/products";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  return {
    title: product
      ? `${product.name} | ليالي بيوتي`
      : "ليالي بيوتي",
    description: product?.subheading,
  };
}

const trustBadges = [
  { icon: Package, label: "تغليف فاخر", sub: "أنيق من اليوم الأول" },
  { icon: Truck, label: "توصيل الإمارات", sub: "1–3 أيام عمل" },
  { icon: RefreshCcw, label: "تأكيد قبل الشحن", sub: "لا مفاجآت" },
  { icon: Shield, label: "دفع عند الاستلام", sub: "لا دفع الآن" },
];

const productStories: Record<string, {
  problem: string;
  solution: string;
  how: string[];
  notes: string[];
  faqs: [string, string][];
}> = {
  "luxury-bundle": {
    problem: "تشعرين أن عنايتك اليومية لا تعكس ذوقك ولا تعطيك ذلك الإحساس الراقي؟",
    solution: "الباقة الفاخرة تجمع لك سيرومين مختارين برائحة مسك ناعمة وعود فخم، في تغليف يليق بهدية.",
    how: [
      "استعملي سيروم مسك المطر الأبيض صباحاً لرائحة نظيفة ناعمة تلازمك اليوم",
      "احتفظي بسيروم عود قصر دبي للمساء أو المناسبات لحضور خليجي فخم",
      "ضعي كمية صغيرة على نقاط النبض: المعصم، الرقبة، خلف الأذن",
    ],
    notes: ["مسك أبيض ناعم", "عود فاخر خليجي", "تغليف هدية أنيق", "رائحة تدوم"],
    faqs: [
      ["هل الرائحة قوية؟", "الرائحة مصممة لتكون راقية وليس مبالغاً فيها — مسك ناعم وعود هادئ يناسبان الاستخدام اليومي."],
      ["هل مناسبة للبشرة الحساسة؟", "صُممت للاستخدام حسب الإرشادات. إذا كانت بشرتك حساسة، جربي كمية صغيرة أولاً."],
      ["ما وقت التوصيل؟", "1–3 أيام عمل داخل الإمارات بعد تأكيد الطلب."],
    ],
  },
  "white-rain-musk-serum": {
    problem: "تبحثين عن رائحة نظيفة وأنثوية تلازمك طوال اليوم دون أن تكون ثقيلة؟",
    solution: "مسك المطر الأبيض يعطيك إحساساً نظيفاً وناعماً مثل رائحة المطر الأول — خفيف، أنثوي، ويدوم.",
    how: [
      "ضعي كمية صغيرة على المعصمين",
      "مثالي للاستخدام الصباحي أو قبل الخروج",
      "يمكن تطبيقه على الشعر والملابس برفق للرائحة الممتدة",
    ],
    notes: ["مسك أبيض نقي", "رائحة نظيفة هادئة", "خفيف ومريح", "مناسب للاستخدام اليومي"],
    faqs: [
      ["ما الفرق بين المسك والعود؟", "المسك رائحة أبيض ناعمة مثل المطر والنظافة. العود أعمق وأكثر دفئاً بطابع خليجي."],
      ["هل يناسب كل الأوقات؟", "نعم، خفيف بما يكفي للصباح والعمل وقوي بما يكفي للمساء."],
      ["ما الكمية الموصى بها؟", "كمية صغيرة تكفي — قطرة أو اثنتان على نقاط النبض."],
    ],
  },
  "dubai-palace-oud-serum": {
    problem: "تريدين رائحة تعكس الفخامة الخليجية وتمنحك حضوراً لا يُنسى في المناسبات؟",
    solution: "عود قصر دبي مستوحى من ذوق قصور الإمارات — عود دافئ راقٍ يمنحك حضوراً خليجياً أصيلاً.",
    how: [
      "ضعي على نقاط الدفء: الرقبة، المعصمين، خلف الأذنين",
      "مثالي للمساء والمناسبات والطلعات الرسمية",
      "يمتزج مع الجسم ليعطي رائحة شخصية فريدة",
    ],
    notes: ["عود خليجي أصيل", "دافئ وفخم", "مناسب للمناسبات", "حضور لا يُنسى"],
    faqs: [
      ["هل العود مناسب للاستخدام اليومي؟", "يمكن استخدامه يومياً بكميات معتدلة — هو راقٍ وليس مبالغاً فيه."],
      ["هل تختلف رائحته عن العود التقليدي؟", "نعم، هو عود معاصر مصمم ليناسب المرأة العصرية — فخم لكن ليس ثقيلاً."],
      ["يمكن الجمع بين المسك والعود؟", "بالتأكيد — المسك صباحاً والعود مساءً، أو خلطهما لرائحة شخصية راقية."],
    ],
  },
  "serum-refill-set": {
    problem: "جربتِ أحد السيرومين وأحببتيه؟ لماذا لا تكملين التجربة بالاثنين معاً بسعر أوفر؟",
    solution: "ثنائي السيروم يجمع لك مسك المطر الأبيض وعود قصر دبي في طلب واحد بسعر أوفر من طلبهما منفردين.",
    how: [
      "المسك الأبيض للصباح والاستخدام اليومي",
      "العود للمساء والمناسبات",
      "معاً يكملان روتينك من الصباح للمساء",
    ],
    notes: ["رائحتان في طلب واحد", "وفر 29 درهم", "صباح ومساء", "تجربة كاملة"],
    faqs: [
      ["ما الفرق بين ثنائي السيروم والباقة؟", "الباقة تحتوي على تشكيلة كاملة. الثنائي هو اختيار أذكى للي تريد السيرومين فقط بسعر أوفر."],
      ["هل يأتي بتغليف هدية؟", "نعم، نعبّئه بعناية ويصلك جاهزاً."],
      ["هل يمكن طلب كميات إضافية؟", "نعم، يمكنك التواصل معنا عبر واتساب لطلب كميات أكبر."],
    ],
  },
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);

  if (!product) {
    notFound();
  }

  const story = productStories[slug] ?? {
    problem: product.subheading,
    solution: product.story,
    how: product.notes,
    notes: product.notes,
    faqs: [
      ["هل الدفع عند الاستلام؟", "نعم. لا تدفعين الآن. الدفع يكون عند الاستلام بعد تأكيد الطلب."],
      ["متى يتواصل معي الفريق؟", "بعد إرسال الطلب، يتواصل فريق التأكيد قبل الشحن."],
    ],
  };

  const related = products.filter((item) => item.sku !== product.sku).slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <ProductHero product={product} />

      {/* Trust badges strip */}
      <section className="border-b border-[var(--border-gold)] bg-white px-4 py-5">
        <div className="container-grid">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {trustBadges.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--cream-50)] text-[var(--gold-500)]">
                  <Icon size={18} />
                </span>
                <div>
                  <p className="text-sm font-bold text-[var(--emerald-950)]">{label}</p>
                  <p className="text-xs text-[var(--muted)]">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem → Solution */}
      <section className="bg-[var(--cream-50)] px-4 py-16">
        <div className="container-grid grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="eyebrow">لماذا ليالي بيوتي؟</span>
            <h2 className="mt-4 text-3xl font-bold text-[var(--emerald-950)] md:text-4xl">
              {story.problem}
            </h2>
            <p className="mt-5 text-lg leading-9 text-[var(--muted)]">
              {story.solution}
            </p>
          </div>
          <div className="grid gap-3">
            {story.notes.map((note) => (
              <div
                key={note}
                className="flex items-center gap-3 rounded-2xl border border-[var(--border-gold)] bg-white p-4"
              >
                <CheckCircle2 className="shrink-0 text-[var(--gold-500)]" size={20} />
                <span className="font-semibold text-[var(--emerald-950)]">{note}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to use */}
      <section className="bg-white px-4 py-16">
        <div className="container-grid">
          <div className="section-heading">
            <span className="eyebrow">طريقة الاستخدام</span>
            <h2 className="mt-4">بسيطة، واضحة، وتعطيك أفضل نتيجة</h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {story.how.map((step, index) => (
              <div key={index} className="premium-card">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--emerald-950)] text-lg font-bold text-[var(--gold-300)]">
                  {index + 1}
                </span>
                <p className="mt-4 leading-8 text-[var(--muted)]">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Order flow */}
      <section className="bg-[var(--emerald-950)] px-4 py-16 text-white">
        <div className="container-grid grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="eyebrow text-[var(--gold-300)]">من الطلب للباب</span>
            <h2 className="mt-4 text-3xl font-bold md:text-4xl">
              ثلاث خطوات واضحة قبل أي شحن.
            </h2>
            <p className="mt-4 leading-8 text-white/75">
              لا دفع أونلاين، لا مفاجآت. كل خطوة واضحة من السلة لباب بيتك.
            </p>
          </div>
          <div className="space-y-4">
            {[
              ["اختاري العرض", "أضيفي الباقة أو السيروم للسلة. زر الطلب يضيف العرض مباشرة."],
              ["راجعي الإضافة", "السلة تقترح إضافة مناسبة ترفع قيمة الطلب مع نفس التوصيل."],
              ["ثبتي الطلب", "اكتبي الاسم ورقم الإمارات فقط. الدفع عند الاستلام والتأكيد قبل الشحن."],
            ].map(([title, text], index) => (
              <div key={title} className="flex gap-4 rounded-2xl bg-white/8 p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--gold-500)] text-sm font-bold text-[var(--emerald-950)]">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-bold text-[var(--gold-300)]">{title}</h3>
                  <p className="mt-1 text-sm leading-7 text-white/70">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="bg-[var(--cream-50)] px-4 py-16">
        <div className="container-grid">
          <div className="section-heading">
            <span className="eyebrow">تجارب عميلات</span>
            <h2 className="mt-4">نساء يطلبون لما يحسون أن كل شيء واضح</h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              ["مريم", "دبي", "أهم شيء عندي إن الطلب واضح وما احتجت أدفع قبل الاستلام."],
              ["نورة", "أبوظبي", "حسيت البراند مرتب من أول صفحة، والسلة فيها كل التفاصيل قبل التأكيد."],
              ["سارة", "الشارقة", "عجبني أنهم يوضحون الخطوات قبل الشحن، هذا يخليني أثق أكثر."],
            ].map(([name, city, review]) => (
              <div key={name} className="premium-card">
                <div className="flex text-[var(--gold-500)]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 leading-8 text-[var(--muted)]">&ldquo;{review}&rdquo;</p>
                <div className="mt-4 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--emerald-950)] text-sm font-bold text-[var(--gold-300)]">
                    {name[0]}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-[var(--emerald-950)]">{name}</p>
                    <p className="text-xs text-[var(--muted)]">{city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related products */}
      <section className="bg-white px-4 py-16">
        <div className="container-grid">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="eyebrow">اختيارات تكمل طلبك</span>
              <h2 className="section-title mt-2">أضيفي لمسة ثانية للسلة.</h2>
            </div>
            <Link href="/collections" className="btn-secondary">
              كل العروض
            </Link>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {related.map((item) => (
              <ProductCard key={item.sku} product={item} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[var(--cream-50)] px-4 py-16">
        <div className="container-grid">
          <div className="section-heading">
            <span className="eyebrow">أسئلة شائعة</span>
            <h2 className="mt-4">أسئلة قبل تثبيت الطلب</h2>
          </div>
          <div className="mx-auto mt-10 grid max-w-4xl gap-4">
            {[
              ...story.faqs,
              ["هل الدفع عند الاستلام؟", "نعم. لا تدفعين الآن. الدفع يكون عند الاستلام بعد تأكيد الطلب."] as [string, string],
              ["متى يتواصل معي الفريق؟", "بعد إرسال الطلب، يظهر لك رقم الطلب وسيتواصل فريق التأكيد قبل الشحن."] as [string, string],
            ].map(([question, answer]) => (
              <details
                key={question}
                className="group rounded-3xl border border-[var(--border-gold)] bg-white p-5 open:bg-[var(--cream-50)]"
              >
                <summary className="cursor-pointer font-bold text-[var(--emerald-950)] list-none flex items-center justify-between gap-4">
                  {question}
                  <span className="shrink-0 text-[var(--gold-500)] group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-3 leading-8 text-[var(--muted)]">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
