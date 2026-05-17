import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/lib/products";

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
  ["متى يصير التأكيد؟", "بعد ما ترسلين الطلب من صفحة المنتج، نتواصل معاك ونأكد البيانات قبل ما نجهز الشحنة."],
];

export default function Home() {
  const featuredProduct = products[0];

  return (
    <div className="store-shell">
      <section className="hero-gradient overflow-hidden text-white">
        <div className="container-grid py-16 text-center lg:py-24">
          <p className="badge border-gold-400/50 bg-gold-400/10 text-gold-300">
            عناية لجفاف البشرة في الإمارات
          </p>
          <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-black leading-tight md:text-6xl">
            بشرة مشدودة من المكيف والحر؟
            <br />
            ابدئي الجمال من روتين عود دافئ
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-9 text-cream-100/90">
            ليالي بيوتي مبنية على مشكلة واضحة تعيشها نساء الإمارات: مكيف طول اليوم، حرارة، وشمس.
            نعرّفج على روتين عود قصر دبي لإحساس نعومة ورائحة راقية، وتدخلين صفحة المنتج بس لما تكونين جاهزة للتفاصيل.
          </p>
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
