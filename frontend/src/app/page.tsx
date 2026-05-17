import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/lib/products";

/** Large lifestyle shots used only on the home page (PDPs keep their own hero/card assets). */
const homeVisualSpotlights = [
  {
    slug: "aroma-flame-lamp" as const,
    href: "/products/aroma-flame-lamp",
    imageSrc: "/products/layali-flame-lamp-hero.png",
    title: "موقد الجو الجاف",
    caption: "ضباب بارد وضوء دافي لطقس الغرفة بعد المكيف.",
    imageAlt: "موقد الجو الجاف من ليالي بيوتي على منضدة بغرفة نوم مع ضباب مضيء يشبه اللهب",
  },
  {
    slug: "dubai-palace-oud-serum" as const,
    href: "/products/dubai-palace-oud-serum",
    imageSrc: "/products/layali-essential-oil-studio.png",
    title: "عود قصر دبي",
    caption: "روتين 100مل بلمسة عود دافئة وملمس ناعم.",
    imageAlt: "عبوة روتين عود قصر دبي في لقطة فاخرة مع خشب العود وإضاءة دافئة",
  },
];

const pillars = [
  ["مصمم لجو الإمارات", "المكيف، الشمس، والمشاوير اليومية تخلي البشرة مشدودة وباهتة. كل رسالة في المتجر مبنية على هالمشكلة."],
  ["طقس عناية واضح", "عود قصر دبي هو الروتين الأساسي: إحساس نعومة ورائحة عود دافئة بدون وعود علاجية مبالغ فيها."],
  ["اختيارات داخل صفحة المنتج", "الهوم يشرح القصة بس. تفاصيل الكمية والسعر النهائي تظهر بعد ما تدخلين صفحة المنتج."],
  ["دفع عند الاستلام", "ما فيه دفع إلكتروني مسبق. نأكد طلبج أول، وبعدها الدفع لما توصل الشحنة داخل الإمارات."],
];

const reviews = [
  ["مريم", "دبي", "بشرتي تشد وايد من المكيف. عجبني إن الموقع شرح المشكلة والروتين بدون مبالغة."],
  ["نورة", "أبوظبي", "أول مرة أحس متجر يتكلم عن جو الإمارات فعلاً، مب كلام عام عن العناية."],
  ["سارة", "الشارقة", "التجربة واضحة: قريت، دخلت صفحة المنتج، وبعدها اخترت العرض المناسب."],
];

const steps = [
  ["١", "افهمي المشكلة", "جفاف وشد البشرة بسبب المكيف والحرارة يحتاج روتين بسيط وواضح."],
  ["٢", "ادخلي لصفحة الروتين", "من بطاقات المنتجات تختارين عود قصر دبي أو المنتج المكمل وتقرئين التفاصيل."],
  ["٣", "اختاري العرض هناك", "داخل صفحة المنتج فقط تظهر اختيارات الكمية والتأكيد بالدفع عند الاستلام."],
];

const faqs = [
  ["هل الدفع عند الاستلام؟", "نعم. ما فيه دفع الحين، الدفع لما يوصل الطلب."],
  ["هل هذا علاج لجفاف البشرة؟", "لا. نتكلم عن روتين عناية يعطي إحساس نعومة وراحة للبشرة المشدودة من جو الإمارات، بدون ادعاءات طبية."],
  ["وين أختار العرض؟", "الهوم للشرح بس. اختيارات الكمية والسعر تكون داخل صفحة المنتج بعد ما تدخلين لها."],
  ["متى يصير التأكيد؟", "بعد ما ترسلين الطلب من صفحة المنتج، نتواصل معاج ونأكد البيانات قبل ما نجهز الشحنة."],
];

export default function Home() {
  const featuredProduct = products[0];

  return (
    <div className="store-shell">
      <section className="hero-gradient overflow-hidden text-white">
        <div className="container-grid py-16 text-center lg:py-24">
          <div className="copy-quote copy-quote--inverse mx-auto mt-2 max-w-4xl text-center" dir="rtl">
            <p className="badge mx-auto border-gold-400/50 bg-gold-400/10 text-gold-300">
              عناية لجفاف البشرة في الإمارات
            </p>
            <h1 className="mt-5 text-4xl font-black leading-tight md:text-6xl">
              بشرة مشدودة من المكيف والحر؟
              <br />
              ابدئي الجمال من روتين عود دافئ
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-lg leading-9 text-cream-100/90">
              ليالي بيوتي مبنية على مشكلة واضحة تعيشها نساء الإمارات: مكيف طول اليوم، حرارة، وشمس.
              نعرّفج على روتين عود قصر دبي لإحساس نعومة ورائحة راقية، وتدخلين صفحة المنتج بس لما تكونين جاهزة للتفاصيل.
            </p>
          </div>
          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-3 text-sm md:grid-cols-4">
            {[
              ["جفاف", "إحساس الشد"],
              ["عود", "رائحة دافئة"],
              ["روتين", "بعد الاستحمام"],
              ["دفع", "عند الاستلام"],
            ].map(([title, text]) => (
              <div key={title} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-2xl font-black text-[var(--gold-300)]">{title}</p>
                <p className="mt-1 text-xs font-bold text-cream-100/80">{text}</p>
              </div>
            ))}
          </div>
          <div className="mx-auto mt-10 max-w-sm rounded-[2rem] border border-gold-400/30 bg-white/10 p-4">
            <p className="text-sm font-black text-gold-300">ضمان وضوح الطلب</p>
            <p className="mt-2 text-sm leading-7 text-cream-100">
              الهوم للشرح بس. اختيار العرض وإضافة السلة داخل صفحة المنتج.
            </p>
          </div>
        </div>
      </section>

      <section
        className="section-padding border-y border-[var(--border-gold)] bg-[var(--cream-50)]"
        aria-labelledby="home-visual-spotlights-heading"
      >
        <div className="container-grid">
          <div className="section-heading">
            <p className="badge">من المعرض</p>
            <h2 id="home-visual-spotlights-heading">لمسة بصرية قبل صفحة المنتج</h2>
            <p>صورتين للرئيسية فقط. السعر واختيار العرض يظهر داخل صفحة كل منتج.</p>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-2" dir="rtl">
            {homeVisualSpotlights.map((item) => (
              <Link
                key={item.slug}
                href={item.href}
                className="group block overflow-hidden rounded-[2rem] border border-[var(--border-gold)] bg-white shadow-[0_18px_60px_rgba(42,27,18,0.08)] ring-1 ring-[rgba(201,150,69,0.06)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(42,27,18,0.12)]"
              >
                <div className="relative aspect-[4/3] w-full bg-[var(--cream-100)]">
                  <Image
                    src={item.imageSrc}
                    alt={item.imageAlt}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-[1.02]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-black text-[var(--emerald-950)] transition group-hover:text-[var(--gold-500)]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm font-semibold leading-7 text-[var(--muted)]">{item.caption}</p>
                  <p className="mt-4 text-sm font-black text-[var(--gold-500)]">ادخلي لصفحة المنتج</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="products" className="section-padding bg-cream-50">
        <div className="container-grid">
          <div className="section-heading">
            <p className="badge">روتينات ليالي</p>
            <h2>روتينات ليالي لجفاف البشرة وجو المكيف</h2>
            <p>
              كل بطاقة هنا تدخل لصفحة تفاصيل المنتج بس. ما فيه شراء مباشر في الهوم.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {products.map((product) => (
              <ProductCard key={product.sku} product={product} showAddButton={false} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-grid">
          <div className="section-heading">
            <p className="badge">ليش ليالي؟</p>
            <h2>عناية، مب متجر عشوائي</h2>
            <p>ليالي مبنية على أربعة أركان: مشكلة واضحة، روتين مفهوم، تجربة طلب مريحة، ودفع عند الاستلام.</p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {pillars.map(([title, text]) => (
              <div key={title} className="premium-card">
                <p className="text-2xl text-gold-500">✦</p>
                <h3 className="mt-4 text-xl font-black text-emerald-950">{title}</h3>
                <p className="mt-3 leading-8 text-muted">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-emerald-950 text-white">
        <div className="container-grid">
          <div className="mx-auto max-w-3xl text-center">
            <p className="badge border-gold-400/40 bg-gold-400/10 text-gold-300">
              تجارب عميلات
            </p>
            <h2 className="mt-5 text-3xl font-bold md:text-5xl">
              عميلات قرأن القصة قبل ما يدخلن لصفحة المنتج
            </h2>
            <p className="mt-5 leading-9 text-cream-100">
              عبارات عامة حول إحساس الجفاف وتجربة الطلب. لا نعرض وعود علاجية أو نتائج طبية.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {reviews.map(([name, city, text]) => (
              <div key={`${name}-${city}`} className="rounded-[2rem] border border-gold-400/30 bg-white/5 p-6">
                <p className="text-gold-300">★★★★★</p>
                <p className="mt-5 leading-8 text-cream-100">{text}</p>
                <p className="mt-5 font-bold text-gold-300">{name}</p>
                <p className="text-sm text-cream-100/70">{city} · تجربة ليالي</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-cream-50">
        <div className="container-grid">
          <div className="section-heading">
            <p className="badge">طريقة الطلب</p>
            <h2>من القراءة للاستلام في 3 خطوات</h2>
            <p>الهوم يشرح. صفحة المنتج تعرض الاختيارات. الدفع يكون عند الاستلام.</p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {steps.map(([number, title, text]) => (
              <div key={number} className="premium-card">
                <span className="grid size-12 place-items-center rounded-full bg-emerald-950 text-xl font-black text-gold-300">
                  {number}
                </span>
                <h3 className="mt-5 text-2xl font-black text-emerald-950">{title}</h3>
                <p className="mt-3 leading-8 text-muted">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-emerald-950 text-white">
        <div className="container-grid grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="badge border-gold-400/40 bg-gold-400/10 text-gold-300">
              ابدئي روتينج
            </p>
            <h2 className="mt-5 text-3xl font-bold md:text-5xl">
              عنايتج تستحق وضوح، مب ضغط شراء من الهوم
            </h2>
            <p className="mt-5 leading-9 text-cream-100">
              إذا كانت بشرتج تشد من المكيف والجو الجاف، ادخلي صفحة عود قصر دبي عشان تقرين التفاصيل وتختارين العرض هناك.
            </p>
            <Link href={`/products/${featuredProduct.slug}`} className="btn-primary mt-8 inline-flex">
              ادخلي لصفحة الروتين
            </Link>
          </div>
          <div className="grid gap-4">
            {["جفاف البشرة", "رائحة عود دافئة", "تأكيد قبل الشحن", "الدفع عند الاستلام"].map((item) => (
              <div key={item} className="rounded-3xl border border-gold-400/30 bg-white/5 p-5 text-gold-300">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-cream-50">
        <div className="container-grid">
          <div className="section-heading">
            <p className="badge">أسئلة شائعة</p>
            <h2>أسئلة قبل الطلب</h2>
            <p>كل شيء تحتاجينه قبل تثبيت الطلب بالدفع عند الاستلام.</p>
          </div>
          <div className="mx-auto mt-10 grid max-w-4xl gap-4">
            {faqs.map(([question, answer]) => (
              <div key={question} className="rounded-3xl border border-[var(--border-gold)] bg-white p-6">
                <h3 className="text-xl font-black text-emerald-950">{question}</h3>
                <p className="mt-3 leading-8 text-muted">{answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
