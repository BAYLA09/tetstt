import Link from "next/link";
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

export default function Home() {
  return (
    <>
      <section className="hero-gradient overflow-hidden">
        <div className="container-grid grid gap-10 py-16 lg:grid-cols-[1fr_0.85fr] lg:items-center lg:py-24">
          <div className="order-2 lg:order-1">
            <div className="product-visual min-h-[420px]">
              <span className="absolute left-10 top-8 text-5xl text-gold-300">☾</span>
              <div className="relative z-10 rounded-[2rem] border border-gold-400/40 bg-emerald-900/80 p-8 text-center shadow-2xl">
                <p className="text-sm text-gold-300">ليالي بيوتي</p>
                <div className="mx-auto mt-6 h-52 w-40 rounded-t-full border border-gold-400/50 bg-gradient-to-b from-gold-300/70 to-cream-100/90 shadow-xl" />
                <p className="mt-6 text-2xl font-semibold text-gold-300">
                  باقة ليالي بيوتي
                </p>
              </div>
            </div>
          </div>
          <div className="order-1 text-white lg:order-2">
            <p className="badge border-gold-400/50 bg-gold-400/10 text-gold-300">
              ليالي بيوتي · الدفع عند الاستلام
            </p>
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
              <Link href="/collections" className="btn-secondary border-gold-400/50 text-gold-300">
                شاهدي المنتجات
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
              {["الدفع عند الاستلام", "تأكيد قبل الشحن", "تغليف أنيق", "إضافات ذكية"].map((item) => (
                <div key={item} className="rounded-2xl border border-gold-400/25 bg-white/5 p-3 text-center text-cream-50">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-cream-50">
        <div className="container-grid">
          <div className="section-heading">
            <p className="badge">طقوس ليالي</p>
            <h2>ثلاث اختيارات. تجربة ليالي واحدة.</h2>
            <p>
              اختاري الباقة أو السيروم الذي يناسب يومك. المنتجات نفسها باقية،
              لكن طريقة العرض تخليك تفهمين القيمة قبل ما تثبتين الطلب.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.sku} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-grid">
          <div className="section-heading">
            <p className="badge">لماذا ليالي</p>
            <h2>علامة عناية، مو متجر يبيع أي شيء</h2>
            <p>أربع نقاط تخلي العميلة تفهم لماذا الطلب يستحق التأكيد والاستلام.</p>
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
              تجارب واضحة
            </p>
            <h2 className="mt-5 text-3xl font-bold md:text-5xl">
              عميلات يطلبن لأن التجربة واضحة، مو لأن الإعلان صرخ عليهن
            </h2>
            <p className="mt-5 leading-9 text-cream-100">
              مراجعات صياغية جاهزة للاستبدال بمراجعات حقيقية بعد أول دفعات.
              لا نستخدم وعود طبية أو شهادات غير موجودة.
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
            <h2>من السلة لباب بيتك في 3 خطوات</h2>
            <p>بدون دفع أونلاين. بدون تعقيد. طلب واضح يقلل الإلغاء ويرفع فرصة الاستلام.</p>
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
              ابدئي طقسك
            </p>
            <h2 className="mt-5 text-3xl font-bold md:text-5xl">
              طلبك يستحق وضوح وفخامة، مو وعود كثيرة
            </h2>
            <p className="mt-5 leading-9 text-cream-100">
              ثبتي طلبك الآن بالدفع عند الاستلام. إذا كان الرقم صحيحاً،
              فريقنا يتواصل للتأكيد قبل الشحن حتى توصلك ليالي كتجربة مرتبة.
            </p>
            <Link href="/products/luxury-bundle" className="btn-primary mt-8 inline-flex">
              ابدئي بالباقة الفاخرة
            </Link>
          </div>
          <div className="grid gap-4">
            {["الدفع عند الاستلام", "تأكيد الطلب قبل الشحن", "إضافات ذكية في السلة", "تغليف وتجربة راقية"].map((item) => (
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
    </>
  );
}
