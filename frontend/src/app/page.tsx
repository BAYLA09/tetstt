import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Package, RefreshCcw, Shield, Star, Truck } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/lib/products";

const pillars = [
  ["علامة عناية، مو متجر عشوائي", "تجربة ليالي مبنية على عرض واضح، تغليف أنيق، ورسائل تأكيد تقلل التردد قبل الشحن."],
  ["دفع عند الاستلام", "لا تدفعين الآن. نثبت الطلب أولاً ونتواصل معك قبل التجهيز."],
  ["اختيار مناسب للذوق الخليجي", "مسك ناعم وعود فخم بلغة راقية تناسب المرأة في الإمارات."],
  ["إضافات ترفع التجربة", "السلة تقترح الإضافة المناسبة حتى تطلعي بطلب كامل بدل طلب ناقص."],
];

const reviews = [
  ["مريم", "دبي", "حبيت أن الطلب واضح من أول خطوة. ما في دفع أونلاين، والتأكيد قبل الشحن خلاني أثق أكثر."],
  ["نورة", "أبوظبي", "الستايل فخم والباقة حسيتها هدية لنفسي. أكثر شي عجبني وضوح السعر والإضافات."],
  ["سارة", "الشارقة", "ما حسيت أنه متجر عشوائي. كل شيء مرتب: العرض، السلة، والتواصل قبل التوصيل."],
];

const steps = [
  ["١", "اختاري روتينك", "ابدئي بالباقة أو اختاري السيروم المناسب لك. كل المنتجات تبقى بنفس عروض ليالي الحالية."],
  ["٢", "ثبتي الطلب بدون دفع", "اكتبي الاسم ورقم الموبايل فقط. الدفع عند الاستلام، وفريق التأكيد يراجع الطلب قبل الشحن."],
  ["٣", "استلمي وادفعي", "بعد التأكيد، يتم تجهيز الطلب وتوصيله داخل الإمارات. الدفع يكون عند الاستلام."],
];

const faqs = [
  ["هل الدفع عند الاستلام؟", "نعم. لا يوجد دفع الآن، يتم الدفع عند وصول الطلب."],
  ["هل المنتجات تتغير؟", "لا. المنتجات والعروض تبقى كما هي، فقط نرتب التجربة حتى تكون أوضح وأفخم."],
  ["لماذا توجد إضافات في السلة؟", "لأن كثير عميلات يحبون يكملون الطلب بنفس التوصيل بدل الرجوع لاحقاً لطلب سيروم منفصل."],
  ["متى يتم التأكيد؟", "بعد إرسال الطلب، يتم التواصل معك لتأكيد البيانات قبل تجهيز الشحنة."],
];

const trustStrip = [
  { icon: Shield, label: "دفع عند الاستلام" },
  { icon: RefreshCcw, label: "تأكيد قبل الشحن" },
  { icon: Truck, label: "توصيل الإمارات" },
  { icon: Package, label: "تغليف فاخر" },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="hero-gradient overflow-hidden">
        <div className="container-grid grid gap-10 py-16 lg:grid-cols-[1fr_0.85fr] lg:items-center lg:py-24">
          {/* Hero product image */}
          <div className="order-2 lg:order-1">
            <div className="relative min-h-[420px] overflow-hidden rounded-[2.5rem] border border-[rgba(201,150,69,0.3)] shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
              <Image
                src="/products/img-bundle-card.jpg"
                alt="باقة ليالي بيوتي الفاخرة"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[rgba(1,30,20,0.75)] to-transparent" />
              <div className="absolute bottom-6 right-6">
                <span className="rounded-full bg-[rgba(201,150,69,0.9)] px-4 py-2 text-sm font-bold text-[var(--emerald-950)] backdrop-blur-sm">
                  الأكثر طلباً اليوم
                </span>
              </div>
            </div>
          </div>

          {/* Copy */}
          <div className="order-1 text-white lg:order-2">
            <span className="badge border-gold-400/50 bg-gold-400/10 text-gold-300">
              ليالي بيوتي · الدفع عند الاستلام
            </span>
            <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
              طقوس عناية فاخرة تشعرين أنها صُممت لك
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-9 text-cream-100/90">
              ليالي ليست صفحة منتجات عشوائية. هي تجربة طلب راقية: عرض واضح،
              تفاصيل مقنعة، إضافات تكمّل الطلب، وتأكيد قبل الشحن حتى توصلك
              التجربة كما اخترتيها.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products/luxury-bundle" className="btn-primary">
                اطلبي الباقة الآن
              </Link>
              <Link
                href="/collections"
                className="btn-secondary border-[rgba(201,150,69,0.4)] text-[var(--gold-300)]"
              >
                شاهدي المنتجات
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
              {trustStrip.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 rounded-2xl border border-[rgba(201,150,69,0.25)] bg-white/5 p-3 text-[var(--cream-50)]"
                >
                  <Icon size={14} className="shrink-0 text-[var(--gold-300)]" />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products grid */}
      <section className="bg-[var(--cream-50)] px-4 py-20">
        <div className="container-grid">
          <div className="section-heading">
            <span className="badge">طقوس ليالي</span>
            <h2 className="mt-4">اختاري ما يناسب يومك</h2>
            <p className="mt-3">
              اختاري الباقة أو السيروم الذي يناسب يومك. المنتجات نفسها باقية،
              لكن طريقة العرض تخليك تفهمين القيمة قبل ما تثبتين الطلب.
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.sku} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Layali */}
      <section className="bg-white px-4 py-20">
        <div className="container-grid">
          <div className="section-heading">
            <span className="badge">لماذا ليالي</span>
            <h2 className="mt-4">علامة عناية، مو متجر يبيع أي شيء</h2>
            <p className="mt-3">أربع نقاط تخلي العميلة تفهم لماذا الطلب يستحق التأكيد والاستلام.</p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {pillars.map(([title, text]) => (
              <div key={title} className="premium-card">
                <CheckCircle2 className="h-8 w-8 text-[var(--gold-500)]" />
                <h3 className="mt-4 text-xl font-bold text-[var(--emerald-950)]">{title}</h3>
                <p className="mt-3 leading-8 text-[var(--muted)]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="bg-[var(--emerald-950)] px-4 py-20 text-white">
        <div className="container-grid">
          <div className="section-heading mx-auto max-w-3xl text-center">
            <span className="badge border-[rgba(201,150,69,0.4)] bg-[rgba(201,150,69,0.1)] text-[var(--gold-300)]">
              تجارب واضحة
            </span>
            <h2 className="mt-5 text-3xl font-bold text-white md:text-5xl">
              عميلات يطلبن لأن التجربة واضحة، مو لأن الإعلان صرخ عليهن
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {reviews.map(([name, city, text]) => (
              <div
                key={`${name}-${city}`}
                className="rounded-[2rem] border border-[rgba(201,150,69,0.3)] bg-white/5 p-6"
              >
                <div className="flex text-[var(--gold-300)]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-5 leading-8 text-[var(--cream-100)]">{text}</p>
                <div className="mt-5 flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--gold-500)] text-sm font-bold text-[var(--emerald-950)]">
                    {name[0]}
                  </span>
                  <div>
                    <p className="font-bold text-[var(--gold-300)]">{name}</p>
                    <p className="text-sm text-[var(--cream-100)]/70">{city} · تجربة ليالي</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to order */}
      <section className="bg-[var(--cream-50)] px-4 py-20">
        <div className="container-grid">
          <div className="section-heading">
            <span className="badge">طريقة الطلب</span>
            <h2 className="mt-4">من السلة لباب بيتك في 3 خطوات</h2>
            <p className="mt-3">بدون دفع أونلاين. بدون تعقيد. طلب واضح يقلل الإلغاء ويرفع فرصة الاستلام.</p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {steps.map(([number, title, text]) => (
              <div key={number} className="premium-card text-center">
                <span className="mx-auto grid size-14 place-items-center rounded-full bg-[var(--emerald-950)] text-2xl font-bold text-[var(--gold-300)]">
                  {number}
                </span>
                <h3 className="mt-5 text-2xl font-bold text-[var(--emerald-950)]">{title}</h3>
                <p className="mt-3 leading-8 text-[var(--muted)]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="bg-[var(--emerald-950)] px-4 py-20 text-white">
        <div className="container-grid grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="badge border-[rgba(201,150,69,0.4)] bg-[rgba(201,150,69,0.1)] text-[var(--gold-300)]">
              ابدئي طقسك
            </span>
            <h2 className="mt-5 text-3xl font-bold md:text-5xl">
              طلبك يستحق وضوح وفخامة، مو وعود كثيرة
            </h2>
            <p className="mt-5 leading-9 text-[var(--cream-100)]">
              ثبتي طلبك الآن بالدفع عند الاستلام. إذا كان الرقم صحيحاً،
              فريقنا يتواصل للتأكيد قبل الشحن حتى توصلك ليالي كتجربة مرتبة.
            </p>
            <Link href="/products/luxury-bundle" className="btn-primary mt-8 inline-flex">
              ابدئي بالباقة الفاخرة
            </Link>
          </div>
          <div className="grid gap-4">
            {[
              ["✓", "الدفع عند الاستلام"],
              ["✓", "تأكيد الطلب قبل الشحن"],
              ["✓", "إضافات ذكية في السلة"],
              ["✓", "تغليف وتجربة راقية"],
            ].map(([icon, item]) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-3xl border border-[rgba(201,150,69,0.3)] bg-white/5 p-5 text-[var(--gold-300)]"
              >
                <span className="text-lg font-bold">{icon}</span>
                <span className="font-semibold">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[var(--cream-50)] px-4 py-20">
        <div className="container-grid">
          <div className="section-heading">
            <span className="badge">أسئلة شائعة</span>
            <h2 className="mt-4">أسئلة قبل الطلب</h2>
            <p className="mt-3">كل شيء تحتاجينه قبل تثبيت الطلب بالدفع عند الاستلام.</p>
          </div>
          <div className="mx-auto mt-10 grid max-w-4xl gap-4">
            {faqs.map(([question, answer]) => (
              <details
                key={question}
                className="group rounded-3xl border border-[var(--border-gold)] bg-white p-6 open:bg-[var(--cream-50)]"
              >
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4 font-bold text-[var(--emerald-950)]">
                  {question}
                  <span className="shrink-0 text-[var(--gold-500)] transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 leading-8 text-[var(--muted)]">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
