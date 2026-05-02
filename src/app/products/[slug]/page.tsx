import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { ProductHero } from "@/components/ProductHero";
import { products } from "@/lib/products";

const objections = [
  ["هل الموقع موثوق؟", "الدفع عند الاستلام، رقم واضح، وتأكيد قبل الشحن. ما كاين حتى دفع أونلاين."],
  ["واش المنتج كيستاهل السعر؟", "الثمن مبني على تجربة كاملة: عرض فخم، تغليف، تعليمات، ودعم قبل الشحن."],
  ["واش غادي يوصلي نفس اللي شفت؟", "نؤكد الطلب قبل الشحن ونخلي كل التفاصيل واضحة باش تقل المفاجآت."],
];

const flowSteps = [
  ["اختاري العرض", "اختاري الباقة أو السيروم المناسب. CTA يضيف العرض للسلة مباشرة."],
  ["راجعي الإضافة", "السلة تقترح cross-sell مناسب يرفع قيمة الطلب مع نفس التوصيل."],
  ["ثبتي الطلب", "اكتبي الاسم ورقم الإمارات فقط. الدفع عند الاستلام والتأكيد قبل الشحن."],
];

const reviews = [
  "أهم شيء عندي إن الطلب واضح وما احتجت أدفع قبل الاستلام.",
  "حسيت البراند مرتب من أول صفحة، والسلة فيها كل التفاصيل قبل التأكيد.",
  "عجبني أنهم يوضحون الخطوات قبل الشحن، هذا يخليني أثق أكثر.",
];

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
      ? `${product.name} | Layali Beauty`
      : "Layali Beauty",
    description: product?.subheading,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);

  if (!product) {
    notFound();
  }

  const related = products.filter((item) => item.sku !== product.sku).slice(0, 3);

  return (
    <div>
      <ProductHero product={product} />

      <section className="bg-[var(--cream-50)] px-4 py-16">
        <div className="container-grid">
          <div className="section-heading">
            <p className="badge">Layali Method</p>
            <h2>من أول نظرة تعرفين أنها تجربة مرتبة، مو صفحة بيع عشوائية</h2>
            <p>
              بنينا صفحة المنتج باش تجاوب على أسئلة الثقة قبل ما تطلبين: شنو
              العرض، علاش السعر منطقي، كيفاش التأكيد، وفين تزيدين الإضافة.
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
            <h2 className="section-title">العميلة تحتاج وضوح أكثر من وعود كبيرة.</h2>
            <p className="mt-5 text-lg leading-9 text-[var(--muted)]">
              لذلك نخلي CTA يضيف العرض للسلة، والسلة توري الإضافة المناسبة،
              والفورم يطلب فقط الاسم والرقم. كل خطوة تقلل التردد وتزيد فرصة
              تأكيد الطلب واستلامه.
            </p>
            <div className="mt-6 grid gap-3">
              {[
                "لا دفع أونلاين: القرار أسهل وأقل خوف.",
                "التأكيد قبل الشحن: يقلل نسيان الطلب والرفض عند التوصيل.",
                "Cross-sell داخل السلة: ترفع AOV بدون تشتيت صفحة المنتج.",
                "Thank-you واضح: يذكرها أن فريق التأكيد سيتواصل معها.",
              ].map((item) => (
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
            <h2 className="text-4xl font-bold">نساء يطلبون لما يحسون أن كل شيء واضح</h2>
            <p className="mt-4 leading-8 text-white/75">
              هذه نصوص placeholder حتى تجمعين reviews حقيقية. لا نعرض ادعاءات علاجية
              أو شهادات غير مثبتة.
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

      <section className="bg-[var(--cream-50)] px-4 py-16">
        <div className="container-grid">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="section-kicker">اختيارات تكمل طلبك</p>
              <h2 className="section-title">أضيفي لمسة ثانية للسلة.</h2>
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

      <section className="bg-white px-4 py-16">
        <div className="container-grid">
          <div className="mx-auto max-w-3xl text-center">
            <p className="section-kicker">FAQ</p>
            <h2 className="section-title">أسئلة قبل تثبيت الطلب</h2>
          </div>
          <div className="mx-auto mt-10 grid max-w-4xl gap-4">
            {[
              ["هل الدفع عند الاستلام؟", "نعم. لا تدفعين الآن. الدفع يكون عند الاستلام بعد تأكيد الطلب."],
              ["متى يتواصل معي الفريق؟", "بعد إرسال الطلب، يظهر لك رقم الطلب وسيتواصل فريق التأكيد قبل الشحن."],
              ["هل أقدر أضيف السيرومات؟", "نعم، السلة تقترح الإضافات المناسبة قبل الفورم لرفع قيمة الطلب في نفس الشحنة."],
              ["هل المنتجات تغيرت؟", "لا. المنتجات والأسعار والألوان بقيت كما هي؛ غيرنا فقط ترتيب الصفحة والكتابة لتكون أوضح وأقوى."],
            ].map(([question, answer]) => (
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
