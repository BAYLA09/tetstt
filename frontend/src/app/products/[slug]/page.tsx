import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CheckCircle2, Package, RefreshCcw, Shield, Star, Truck, X } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { ProductHero } from "@/components/ProductHero";
import { products } from "@/lib/products";
import { getProductContent } from "@/lib/product-content";

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
    title: product ? `${product.name} | ليالي بيوتي` : "ليالي بيوتي",
    description: product?.subheading,
  };
}

const trustBadges = [
  { icon: Package, label: "تغليف فاخر", sub: "أنيق من اليوم الأول" },
  { icon: Truck, label: "توصيل الإمارات", sub: "1–3 أيام عمل" },
  { icon: RefreshCcw, label: "تأكيد قبل الشحن", sub: "لا مفاجآت" },
  { icon: Shield, label: "دفع عند الاستلام", sub: "لا دفع الآن" },
];

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  if (!product) notFound();

  const content = getProductContent(slug);
  const related = products.filter((item) => item.sku !== product.sku).slice(0, 3);

  return (
    <div dir="rtl">
      {/* ── HERO ── */}
      <ProductHero product={product} />

      {/* ── TRUST STRIP ── */}
      <section className="border-b border-[var(--border-gold)] bg-white px-4 py-4">
        <div className="container-grid">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {trustBadges.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--cream-50)] text-[var(--gold-500)]">
                  <Icon size={16} />
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

      {content && (
        <>
          {/* ── BEFORE / AFTER ── */}
          <section className="bg-[var(--cream-50)] px-4 py-16">
            <div className="container-grid">
              <div className="section-heading">
                <span className="eyebrow">قبل وبعد</span>
                <h2 className="mt-4">{content.problemHeadline}</h2>
                <p className="mt-3">{content.problemSub}</p>
              </div>

              <div className="mt-10 grid gap-4 md:grid-cols-2">
                {/* BEFORE */}
                <div className="overflow-hidden rounded-[2rem] border-2 border-red-200">
                  <div className="relative aspect-[4/3] w-full">
                    {product.beforeImage ? (
                      <Image
                        src={product.beforeImage}
                        alt={content.beforeLabel}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-200" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-red-600/90 px-4 py-2 text-sm font-bold text-white backdrop-blur-sm">
                      <X size={14} />
                      قبل — {content.beforeLabel}
                    </div>
                  </div>
                </div>

                {/* AFTER */}
                <div className="overflow-hidden rounded-[2rem] border-2 border-[var(--gold-400)]">
                  <div className="relative aspect-[4/3] w-full">
                    {product.afterImage ? (
                      <Image
                        src={product.afterImage}
                        alt={content.afterLabel}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-200" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-[var(--gold-500)]/90 px-4 py-2 text-sm font-bold text-[var(--emerald-950)] backdrop-blur-sm">
                      <CheckCircle2 size={14} />
                      بعد — {content.afterLabel}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── PROBLEMS SECTION ── */}
          <section className="bg-white px-4 py-16">
            <div className="container-grid">
              <div className="section-heading">
                <span className="eyebrow">المشاكل اللي تعرفينها</span>
                <h2 className="mt-4">مو بس نخففها — نحل السبب الجذري</h2>
                <p className="mt-3">مكوّن لكل مشكلة.</p>
              </div>
              <div className="mt-10 grid gap-4 md:grid-cols-3">
                {content.problems.map(({ complaint, solution }) => (
                  <div key={complaint} className="premium-card">
                    <p className="text-sm font-bold text-[var(--muted)] leading-7 italic">{complaint}</p>
                    <div className="mt-4 border-t border-[var(--border-gold)] pt-4">
                      <p className="text-sm font-bold text-[var(--gold-500)]">الحل</p>
                      <p className="mt-2 leading-7 text-[var(--emerald-950)]">{solution}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── INGREDIENTS ── */}
          <section className="bg-[var(--emerald-950)] px-4 py-16 text-white">
            <div className="container-grid">
              <div className="section-heading mx-auto max-w-3xl text-center">
                <span className="eyebrow border-[rgba(201,150,69,0.4)] bg-[rgba(201,150,69,0.1)] text-[var(--gold-300)]">
                  المكوّنات الفعّالة
                </span>
                <h2 className="mt-4 text-white">السرّ في التركيز، مو في القائمة</h2>
                <p className="mt-3 text-white/70">كل مكوّن بجرعة مدروسة وشكل قابل للامتصاص الفعلي.</p>
              </div>

              <div className="mt-10 grid gap-4 md:grid-cols-2">
                {content.ingredients.map((ing) => (
                  <div
                    key={ing.name}
                    className="rounded-[2rem] border border-[rgba(201,150,69,0.25)] bg-white/5 p-6"
                  >
                    <div className="flex items-start gap-4">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[rgba(201,150,69,0.15)] text-2xl">
                        {ing.icon}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-bold text-[var(--gold-300)]">{ing.nameAr}</p>
                          <span className="rounded-full border border-[rgba(201,150,69,0.3)] px-2 py-0.5 text-xs text-[var(--gold-400)]">
                            {ing.dose}
                          </span>
                        </div>
                        <p className="mt-1 text-sm font-semibold text-white">{ing.benefit}</p>
                        <p className="mt-2 text-sm leading-7 text-white/65">{ing.detail}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* What's NOT in it */}
              <div className="mt-8 rounded-[2rem] border border-[rgba(201,150,69,0.2)] bg-white/5 p-6">
                <p className="font-bold text-[var(--gold-300)]">ما لن تجديه في منتجنا</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {["بدون مواد حافظة ضارة", "بدون كحول", "بدون ألوان صناعية", "بدون بارابين", "بدون جلوتين"].map((item) => (
                    <span
                      key={item}
                      className="flex items-center gap-1.5 rounded-full border border-[rgba(255,255,255,0.15)] px-3 py-1.5 text-sm text-white/70"
                    >
                      <X size={12} className="text-red-400" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── RESULTS TIMELINE ── */}
          <section className="bg-[var(--cream-50)] px-4 py-16">
            <div className="container-grid">
              <div className="section-heading">
                <span className="eyebrow">النتيجة أسبوع بأسبوع</span>
                <h2 className="mt-4">وجهك يقولها قبل ما تقوليه</h2>
              </div>
              <div className="mt-10 grid gap-6 md:grid-cols-3">
                {content.timeline.map((t, i) => (
                  <div key={t.week} className="relative premium-card">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--emerald-950)] text-sm font-bold text-[var(--gold-300)]">
                        {i + 1}
                      </span>
                      <p className="text-sm font-bold text-[var(--gold-500)]">{t.week}</p>
                    </div>
                    <h3 className="mt-4 text-xl font-bold text-[var(--emerald-950)]">{t.title}</h3>
                    <p className="mt-2 leading-8 text-[var(--muted)]">{t.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── HOW TO USE ── */}
          <section className="bg-white px-4 py-16">
            <div className="container-grid grid items-center gap-10 lg:grid-cols-2">
              <div>
                <span className="eyebrow">طريقة الاستخدام</span>
                <h2 className="section-title mt-4">
                  أبسط روتين عمرك جربتيه
                </h2>
                <p className="mt-4 text-lg leading-9 text-[var(--muted)]">
                  دقيقة واحدة باليوم — بدون التزام معقد.
                </p>
                <div className="mt-6 space-y-3">
                  {content.howToUse.map((step, i) => (
                    <div key={i} className="flex items-start gap-4 rounded-2xl border border-[var(--border-gold)] bg-[var(--cream-50)] p-4">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--emerald-950)] text-sm font-bold text-[var(--gold-300)]">
                        {i + 1}
                      </span>
                      <p className="leading-7 text-[var(--emerald-950)]">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative aspect-square overflow-hidden rounded-[2.5rem] border border-[var(--border-gold)] shadow-xl">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </section>

          {/* ── COMPARISON TABLE ── */}
          <section className="bg-[var(--cream-50)] px-4 py-16">
            <div className="container-grid">
              <div className="section-heading">
                <span className="eyebrow">ليش ليالي تختلف؟</span>
                <h2 className="mt-4">قارني — وقرّري بنفسك</h2>
              </div>
              <div className="mt-10 grid gap-4 md:grid-cols-4">
                {/* Layali column */}
                <div className="rounded-[2rem] border-2 border-[var(--gold-500)] bg-[var(--emerald-950)] p-6 text-white shadow-[0_30px_80px_rgba(1,63,42,0.25)]">
                  <p className="text-xs font-bold tracking-widest text-[var(--gold-300)] uppercase">الأفضل</p>
                  <p className="mt-2 text-xl font-bold text-[var(--gold-300)]">ليالي بيوتي</p>
                  <p className="mt-1 text-2xl font-bold">{product.price} درهم</p>
                  <div className="mt-4 space-y-2">
                    {[
                      "مكونات فعالة حقيقية",
                      "رائحة تدوم ساعات",
                      "ترطيب وعناية للبشرة",
                      "دفع عند الاستلام",
                      "تأكيد قبل الشحن",
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 size={14} className="shrink-0 text-[var(--gold-400)]" />
                        <span className="text-white/85">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Competitor columns */}
                {content.competitors.map((comp) => (
                  <div key={comp.name} className="rounded-[2rem] border border-[var(--border-gold)] bg-white p-6">
                    <p className="text-xs font-bold tracking-widest text-[var(--muted)] uppercase">بديل آخر</p>
                    <p className="mt-2 text-lg font-bold text-[var(--emerald-950)]">{comp.name}</p>
                    <p className="mt-1 font-bold text-[var(--muted)]">{comp.price}</p>
                    <div className="mt-4 space-y-2">
                      {comp.cons.map((con) => (
                        <div key={con} className="flex items-start gap-2 text-sm">
                          <X size={14} className="mt-0.5 shrink-0 text-red-400" />
                          <span className="text-[var(--muted)]">{con}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── REVIEWS ── */}
          <section className="bg-[var(--emerald-950)] px-4 py-16 text-white">
            <div className="container-grid">
              <div className="section-heading mx-auto max-w-3xl text-center">
                <span className="eyebrow border-[rgba(201,150,69,0.4)] bg-[rgba(201,150,69,0.1)] text-[var(--gold-300)]">
                  تجارب حقيقية
                </span>
                <h2 className="mt-4 text-white">
                  ما تقوله عميلات الإمارات
                </h2>
                <p className="mt-3 text-white/65">مشتريات مؤكدة. تجارب فعلية.</p>
              </div>
              <div className="mt-10 grid gap-4 md:grid-cols-3">
                {content.reviews.map((review) => (
                  <div
                    key={review.name}
                    className="rounded-[2rem] border border-[rgba(201,150,69,0.25)] bg-white/5 p-6"
                  >
                    <div className="flex text-[var(--gold-300)]">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <p className="mt-4 leading-8 text-white/85">&ldquo;{review.text}&rdquo;</p>
                    <div className="mt-5 flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--gold-500)] text-sm font-bold text-[var(--emerald-950)]">
                        {review.initial}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-[var(--gold-300)]">{review.name}</p>
                          {review.verified && (
                            <CheckCircle2 size={13} className="text-[var(--gold-400)]" />
                          )}
                        </div>
                        <p className="text-xs text-white/50">{review.age} سنة · {review.city}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* ── ORDER FLOW ── */}
      <section className="bg-white px-4 py-16">
        <div className="container-grid grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="eyebrow">كيف يوصلك طلبك</span>
            <h2 className="section-title mt-4">بكل بساطة — بدون دفع أونلاين</h2>
            <p className="mt-4 leading-8 text-[var(--muted)]">
              بدون مفاجآت. كل خطوة واضحة من السلة لباب بيتك.
            </p>
          </div>
          <div className="space-y-4">
            {[
              ["اطلبي الآن", "اختاري العرض وأضيفيه للسلة. بدون دفع أونلاين."],
              ["نتواصل معك", "فريقنا يتصل لتأكيد العنوان والكمية قبل الشحن."],
              ["استلمي وادفعي", "1-3 أيام لكل الإمارات. تدفعين كاش أو شبكة عند الباب."],
            ].map(([title, text], i) => (
              <div key={title as string} className="flex gap-4 rounded-2xl border border-[var(--border-gold)] bg-[var(--cream-50)] p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--emerald-950)] text-sm font-bold text-[var(--gold-300)]">
                  {i + 1}
                </span>
                <div>
                  <p className="font-bold text-[var(--emerald-950)]">{title as string}</p>
                  <p className="mt-1 text-sm leading-7 text-[var(--muted)]">{text as string}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RELATED PRODUCTS ── */}
      <section className="bg-[var(--cream-50)] px-4 py-16">
        <div className="container-grid">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="eyebrow">اختيارات تكمل طلبك</span>
              <h2 className="section-title mt-2">أضيفي لمسة ثانية للسلة.</h2>
            </div>
            <Link href="/collections" className="btn-secondary">كل العروض</Link>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {related.map((item) => (
              <ProductCard key={item.sku} product={item} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-white px-4 py-16">
        <div className="container-grid">
          <div className="section-heading">
            <span className="eyebrow">أسئلة شائعة</span>
            <h2 className="mt-4">قبل ما تثبتي الطلب</h2>
          </div>
          <div className="mx-auto mt-10 grid max-w-4xl gap-4">
            {[
              ["هل الدفع عند الاستلام؟", "نعم. لا تدفعين الآن. الدفع يكون عند الاستلام بعد تأكيد الطلب."],
              ["متى يتواصل معي الفريق؟", "بعد إرسال الطلب، يتواصل فريق التأكيد قبل الشحن عادةً خلال ساعات."],
              ["هل أقدر أرجع الطلب؟", "نعم. نتواصل معك قبل الشحن — أي تغيير ممكن قبل ما يتجهز الطلب."],
              ...(content
                ? content.problems.slice(0, 2).map(
                    ({ complaint, solution }) =>
                      [complaint.replace(/"/g, ""), solution] as [string, string]
                  )
                : []),
            ].map(([question, answer]) => (
              <details
                key={question as string}
                className="group rounded-3xl border border-[var(--border-gold)] bg-[var(--cream-50)] p-5 open:bg-white"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-[var(--emerald-950)]">
                  {question as string}
                  <span className="shrink-0 text-[var(--gold-500)] transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 leading-8 text-[var(--muted)]">{answer as string}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
