import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  CheckCircle2, Package, RefreshCcw, Shield,
  Star, Truck, X, RotateCcw
} from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { ProductHero } from "@/components/ProductHero";
import { ProductLampHeroStrip, ProductLampSecondaryStory } from "@/components/ProductLeadStory";
import { products, offerTiers } from "@/lib/products";
import { getProductContent } from "@/lib/product-content";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  return {
    title: product ? `${product.name} | ليالي بيوتي` : "ليالي بيوتي",
    description: product?.subheading,
  };
}

const trustBadges = [
  { icon: Package,     label: "تغليف فاخر",       sub: "أنيق من اليوم الأول" },
  { icon: Truck,       label: "توصيل الإمارات",    sub: "1–3 أيام عمل" },
  { icon: RefreshCcw,  label: "تأكيد قبل الشحن",   sub: "لا مفاجآت" },
  { icon: Shield,      label: "دفع عند الاستلام",  sub: "لا دفع الآن" },
];

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  const content = getProductContent(slug);
  const tiers = offerTiers[slug];
  const related = products.filter((p) => p.sku !== product.sku).slice(0, 3);
  const lampStoryFirst = slug === "aroma-flame-lamp";

  return (
    <div dir="rtl" className="pb-24 lg:pb-0">
      {lampStoryFirst && <ProductLampHeroStrip product={product} />}

      <ProductHero
        product={product}
        tiers={tiers}
        variant={lampStoryFirst ? "commerceOnly" : "default"}
      />

      {lampStoryFirst && content && <ProductLampSecondaryStory product={product} content={content} />}

      {/* ②  TRUST STRIP */}
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

      {content?.stat && !lampStoryFirst && (
        /* ②·⁵  STAT CARD — shown between trust strip and before/after */
        <section className="bg-[var(--emerald-950)] px-4 py-14">
          <div className="container-grid">
            <div className="mx-auto max-w-2xl overflow-hidden rounded-[2rem] shadow-2xl">
              {/* Woman image */}
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <Image
                  src={content.stat.image}
                  alt="إحصائية"
                  fill
                  sizes="(max-width: 768px) 100vw, 672px"
                  className="object-cover object-top"
                  priority={false}
                />
                {/* Gradient overlay bottom */}
                <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[var(--emerald-950)] to-transparent" />
              </div>
              {/* Stat bar */}
              <div className="relative -mt-1 bg-[var(--emerald-950)] px-6 pb-6 pt-3">
                <div className="flex items-start gap-5">
                  <div className="flex-1">
                    <p className="text-lg font-bold leading-8 text-white md:text-xl">
                      {content.stat.text}
                    </p>
                    <p className="mt-2 text-xs text-white/40">{content.stat.source}</p>
                  </div>
                  <div className="shrink-0 rounded-2xl bg-[var(--gold-500)] px-5 py-3 text-center shadow-lg">
                    <p className="text-2xl font-bold text-[var(--emerald-950)] md:text-3xl">
                      {content.stat.number}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {content && (<>

        {!lampStoryFirst && (
        /* ③  BEFORE / AFTER  ← أول سكشن */
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
                  {product.beforeImage
                    ? <Image src={product.beforeImage} alt={content.beforeLabel} fill sizes="(max-width:768px) 100vw,50vw" className="object-cover" />
                    : <div className="h-full w-full bg-gray-100" />
                  }
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-red-600/90 px-4 py-2 text-sm font-bold text-white backdrop-blur-sm">
                    <X size={14} /> قبل — {content.beforeLabel}
                  </div>
                </div>
              </div>

              {/* AFTER */}
              <div className="overflow-hidden rounded-[2rem] border-2 border-[var(--gold-400)]">
                <div className="relative aspect-[4/3] w-full">
                  {product.afterImage
                    ? <Image src={product.afterImage} alt={content.afterLabel} fill sizes="(max-width:768px) 100vw,50vw" className="object-cover" />
                    : <div className="h-full w-full bg-gray-100" />
                  }
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-[var(--gold-500)]/90 px-4 py-2 text-sm font-bold text-[var(--emerald-950)] backdrop-blur-sm">
                    <CheckCircle2 size={14} /> بعد — {content.afterLabel}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        )}

        {/* ④  PROBLEMS  ← ثاني سكشن */}
        <section className="bg-white px-4 py-16">
          <div className="container-grid">
            <div className="section-heading">
              <span className="eyebrow">هل تعانين من هذه؟</span>
              <h2 className="mt-4">مشاكل تعرفينها — وحلول من الداخل</h2>
              <p className="mt-3">مو نخففها. نحل السبب الجذري — مكوّن لكل ألم.</p>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {content.problems.map(({ complaint, solution }) => (
                <div key={complaint} className="premium-card">
                  <p className="text-sm leading-7 text-[var(--muted)] italic">{complaint}</p>
                  <div className="mt-4 border-t border-[var(--border-gold)] pt-4">
                    <p className="text-xs font-bold text-[var(--gold-500)] uppercase tracking-wider">الحل</p>
                    <p className="mt-2 leading-7 text-[var(--emerald-950)]">{solution}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ⑤  INGREDIENTS */}
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
                <div key={ing.name} className="rounded-[2rem] border border-[rgba(201,150,69,0.25)] bg-white/5 p-6">
                  <div className="flex items-start gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[rgba(201,150,69,0.15)] text-2xl">
                      {ing.icon}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-bold text-[var(--gold-300)]">{ing.nameAr}</p>
                        <span className="rounded-full border border-[rgba(201,150,69,0.3)] px-2 py-0.5 text-xs text-[var(--gold-400)]">{ing.dose}</span>
                      </div>
                      <p className="mt-1 text-sm font-semibold text-white">{ing.benefit}</p>
                      <p className="mt-2 text-sm leading-7 text-white/65">{ing.detail}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-[2rem] border border-[rgba(201,150,69,0.2)] bg-white/5 p-6">
              <p className="font-bold text-[var(--gold-300)]">ما لن تجديه في منتجنا</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {["بدون مواد حافظة", "بدون كحول", "بدون ألوان صناعية", "بدون بارابين", "بدون جلوتين"].map((item) => (
                  <span key={item} className="flex items-center gap-1.5 rounded-full border border-[rgba(255,255,255,0.15)] px-3 py-1.5 text-sm text-white/70">
                    <X size={12} className="text-red-400" /> {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ⑥  RESULTS TIMELINE */}
        <section className="bg-[var(--cream-50)] px-4 py-16">
          <div className="container-grid">
            <div className="section-heading">
              <span className="eyebrow">النتيجة من أول استخدام</span>
              <h2 className="mt-4">وش راح تحسين خلال أول 30 يوم؟</h2>
              <p className="mt-3">تتغيّر تدريجياً — والفرق يبدأ من اليوم الأول.</p>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {content.timeline.map((t, i) => (
                <div key={t.week} className="premium-card">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--emerald-950)] text-sm font-bold text-[var(--gold-300)]">{i + 1}</span>
                    <p className="text-sm font-bold text-[var(--gold-500)]">{t.week}</p>
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-[var(--emerald-950)]">{t.title}</h3>
                  <p className="mt-2 leading-8 text-[var(--muted)]">{t.description}</p>
                </div>
              ))}
            </div>
            <p className="mt-8 text-center text-sm text-[var(--muted)]">
              الاستخدام الأول يعطيك النتيجة. العلبة الثانية والثالثة تثبّتانها.
            </p>
          </div>
        </section>

        {/* ⑦  HOW TO USE */}
        <section className="bg-white px-4 py-16">
          <div className="container-grid grid items-center gap-10 lg:grid-cols-2">
            <div>
              <span className="eyebrow">طريقة الاستخدام</span>
              <h2 className="section-title mt-4">أبسط روتين عمرك جربتيه</h2>
              <p className="mt-4 text-lg leading-9 text-[var(--muted)]">دقيقة واحدة باليوم — بدون التزام معقد.</p>
              <div className="mt-6 space-y-3">
                {content.howToUse.map((step, i) => (
                  <div key={i} className="flex items-start gap-4 rounded-2xl border border-[var(--border-gold)] bg-[var(--cream-50)] p-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--emerald-950)] text-sm font-bold text-[var(--gold-300)]">{i + 1}</span>
                    <p className="leading-7 text-[var(--emerald-950)]">{step}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative aspect-square overflow-hidden rounded-[2.5rem] border border-[var(--border-gold)] shadow-xl">
              <Image src={product.image} alt={product.name} fill sizes="(max-width:1024px) 100vw,50vw" className="object-cover" />
            </div>
          </div>
        </section>

        {/* ⑧  COMPARISON */}
        <section className="bg-[var(--cream-50)] px-4 py-16">
          <div className="container-grid">
            <div className="section-heading">
              <span className="eyebrow">ليش ليالي تختلف؟</span>
              <h2 className="mt-4">قارني — وقرّري بنفسك</h2>
              <p className="mt-3">كل بديل جربتيه من قبل. وليه فشل.</p>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-4">
              {/* Layali */}
              <div className="rounded-[2rem] border-2 border-[var(--gold-500)] bg-[var(--emerald-950)] p-6 text-white shadow-[0_30px_80px_rgba(1,63,42,0.25)]">
                <p className="text-xs font-bold tracking-widest text-[var(--gold-300)] uppercase">الأفضل</p>
                <p className="mt-2 text-xl font-bold text-[var(--gold-300)]">ليالي بيوتي</p>
                <p className="mt-1 text-2xl font-bold">{product.price} درهم</p>
                <div className="mt-4 space-y-2">
                  {["مكونات فعالة حقيقية", "رائحة تدوم ساعات", "ترطيب وعناية للبشرة", "دفع عند الاستلام", "تأكيد قبل الشحن"].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 size={14} className="shrink-0 text-[var(--gold-400)]" />
                      <span className="text-white/85">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Competitors */}
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

        {/* ⑨  REVIEWS */}
        <section className="bg-[var(--emerald-950)] px-4 py-16 text-white">
          <div className="container-grid">
            <div className="section-heading mx-auto max-w-3xl text-center">
              <span className="eyebrow border-[rgba(201,150,69,0.4)] bg-[rgba(201,150,69,0.1)] text-[var(--gold-300)]">
                تجارب حقيقية
              </span>
              <h2 className="mt-4 text-white">ما تقوله عميلات الإمارات</h2>
              <p className="mt-3 text-white/65">مشتريات مؤكدة من مناطق مختلفة. تجارب فعلية.</p>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {content.reviews.map((review) => (
                <div key={review.name} className="rounded-[2rem] border border-[rgba(201,150,69,0.25)] bg-white/5 p-6">
                  <div className="flex text-[var(--gold-300)]">
                    {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                  </div>
                  <p className="mt-4 leading-8 text-white/85">&ldquo;{review.text}&rdquo;</p>
                  <div className="mt-5 flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--gold-500)] text-sm font-bold text-[var(--emerald-950)]">{review.initial}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-[var(--gold-300)]">{review.name}</p>
                        {review.verified && <CheckCircle2 size={13} className="text-[var(--gold-400)]" />}
                      </div>
                      <p className="text-xs text-white/50">{review.age} سنة · {review.city}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ⑩  MONEY-BACK GUARANTEE */}
        <section className="bg-white px-4 py-16">
          <div className="container-grid">
            <div className="mx-auto max-w-3xl rounded-[2rem] border border-[var(--border-gold)] bg-[var(--cream-50)] p-10 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--emerald-950)] text-[var(--gold-300)]">
                <RotateCcw size={28} />
              </div>
              <span className="eyebrow">ضمان كامل</span>
              <h2 className="mt-4 text-3xl font-bold text-[var(--emerald-950)]">
                30 يوم — أو فلوسك ترجع. بدون أسئلة.
              </h2>
              <p className="mt-4 text-lg leading-9 text-[var(--muted)]">
                جربي الطلب كامل. إذا ما حسّيتي بفرق يستاهل، تواصلي معنا وفلوسك ترجع —
                بدون نماذج، بدون أسئلة. لأن إذا منتجنا ما اشتغل معك، ما نستحق فلوسك.
              </p>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {[
                  ["تواصلي معنا", "في أي يوم خلال الـ 30 يوم"],
                  ["رجّعي الطلب", "حتى لو استخدمتيه — ما يهمنا"],
                  ["فلوسك ترجع كاملة", "خلال 3-5 أيام عمل"],
                ].map(([title, sub]) => (
                  <div key={title as string} className="rounded-2xl border border-[var(--border-gold)] p-4 text-center">
                    <p className="font-bold text-[var(--emerald-950)]">{title as string}</p>
                    <p className="mt-1 text-sm text-[var(--muted)]">{sub as string}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      </>)}

      {/* ⑪  ORDER / DELIVERY FLOW */}
      <section className="bg-[var(--cream-50)] px-4 py-16">
        <div className="container-grid">
          <div className="section-heading">
            <span className="eyebrow">التوصيل والدفع</span>
            <h2 className="mt-4">كيف يوصلك طلبك — بكل بساطة</h2>
            <p className="mt-3">بدون دفع أونلاين، بدون التزام، بدون مفاجآت.</p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              ["اطلبي الآن", "اختاري العرض، اكتبي اسمك ورقمك. بدون دفع أونلاين، بدون التزام."],
              ["نتصل لتأكيد الطلب", "فريقنا يتواصل معك خلال ساعات لتأكيد العنوان والكمية."],
              ["استلمي وادفعي عند الباب", "1-3 أيام لكل الإمارات. تدفعين كاش أو شبكة وقت الاستلام."],
            ].map(([title, text], i) => (
              <div key={title as string} className="premium-card text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--emerald-950)] text-lg font-bold text-[var(--gold-300)]">{i + 1}</span>
                <h3 className="mt-4 font-bold text-[var(--emerald-950)]">{title as string}</h3>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{text as string}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ⑫  FAQ */}
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
              ["هل أقدر أرجع الطلب؟", "نعم. ضماننا 30 يوم — فلوسك ترجع كاملة بدون أسئلة."],
              ...(content
                ? content.problems.slice(0, 2).map(({ complaint, solution }) =>
                    [complaint.replace(/['"«»]/g, ""), solution] as [string, string]
                  )
                : []),
            ].map(([question, answer]) => (
              <details key={question as string} className="group rounded-3xl border border-[var(--border-gold)] bg-[var(--cream-50)] p-5 open:bg-white">
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

      {/* ⑬  RELATED PRODUCTS */}
      <section className="bg-[var(--cream-50)] px-4 py-16">
        <div className="container-grid">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="eyebrow">منتجات أخرى من ليالي</span>
              <h2 className="section-title mt-2">لكل روتين اختياره.</h2>
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

    </div>
  );
}
