import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { money, products } from "@/lib/products";

const pillars = [
  ["عرض واضح", "صفحة واحدة تشرح المنتج، الباقات، وطريقة التأكيد قبل الشحن بدون تشتيت."],
  ["دفع عند الاستلام", "لا يوجد دفع إلكتروني مسبق. يتم الدفع عند وصول الطلب وبعد تأكيده."],
  ["تجربة منزلية راقية", "موقد عطر وإضاءة يضيف دفئاً للمساحة بدون نار حقيقية أو تعقيد."],
  ["سلة منظمة", "اختاري الباقة ثم راجعي السلة قبل إدخال الاسم ورقم الهاتف الإماراتي."],
];

const reviews = [
  ["مريم", "دبي", "حبيت أن السعر والباقة واضحين قبل ما أكتب بياناتي."],
  ["نورة", "أبوظبي", "الصفحة مرتبة، والسلة توضّح أنه ما في دفع قبل الاستلام."],
  ["سارة", "الشارقة", "التأكيد قبل الشحن خلاني أحس أن الطلب جدي ومفهوم."],
];

const steps = [
  ["١", "اختاري الباقة", "افتحي صفحة موقد ليالي واختاري العرض المناسب من الخيارات المعروضة."],
  ["٢", "راجعي السلة", "تأكدي من السعر والكمية، ثم انتقلي لنموذج التأكيد بدون دفع الآن."],
  ["٣", "استلمي وادفعي", "فريق التأكيد يتواصل قبل الشحن، والدفع يكون عند الاستلام داخل الإمارات."],
];

const faqs = [
  ["هل الدفع عند الاستلام؟", "نعم. لا يوجد دفع الآن، يتم الدفع عند وصول الطلب."],
  ["هل المنتج أو السعر تغيّر؟", "لا. أبقينا المنتج والباقات الحالية كما هي، وتم تحسين عرض الواجهة فقط."],
  ["لماذا تظهر أكثر من باقة؟", "لأن صفحة المنتج تعرض خيارات مختلفة لنفس موقد ليالي مع إضافات اختيارية."],
  ["متى يتم التأكيد؟", "بعد إرسال الطلب، يتم التواصل معك لتأكيد البيانات قبل تجهيز الشحنة."],
];

export default function Home() {
  const featuredProduct = products[0];
  const defaultTier = featuredProduct.offerTiers?.find((tier) => tier.default) ?? featuredProduct.offerTiers?.[0];
  const startingPrice = defaultTier?.price ?? featuredProduct.price;

  return (
    <div className="store-shell">
      <section className="hero-gradient overflow-hidden">
        <div className="container-grid grid gap-10 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:py-24">
          <div className="order-2 lg:order-1">
            <div className="product-illustration grid min-h-[420px] place-items-end rounded-[2.75rem] p-6 lg:min-h-[560px]">
              <div className="relative z-10 w-full max-w-md rounded-[2rem] border border-white/10 bg-black/20 p-5 text-white backdrop-blur">
                <p className="text-sm font-black text-[var(--gold-300)]">عرض اليوم</p>
                <h2 className="mt-2 text-3xl font-black">{featuredProduct.shortName}</h2>
                <p className="mt-3 leading-8 text-[var(--cream-100)]">{featuredProduct.subheading}</p>
                <div className="mt-5 rounded-2xl bg-white p-4 text-[var(--emerald-950)]">
                  <p className="text-xs font-black text-[var(--gold-500)]">السعر المعروض</p>
                  <div className="price-lockup mt-1">
                    <span>يبدأ من</span>
                    <strong>{startingPrice}</strong>
                    <span>درهم</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 text-white lg:order-2">
            <p className="badge border-gold-400/50 bg-gold-400/10 text-gold-300">
              ليالي بيوتي · متجر منظم بالدفع عند الاستلام
            </p>
            <h1 className="mt-6 max-w-3xl text-4xl font-black leading-tight md:text-6xl">
              أجواء بيت أهدأ مع تجربة طلب واضحة من أول نقرة
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-9 text-cream-100/90">
              موقد ليالي الفاخر يجمع الإضاءة الهادئة، الضباب البارد، والرائحة المنزلية في صفحة شراء مرتبة:
              باقات واضحة، سعر ظاهر، وسلة سهلة قبل التأكيد.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products/aroma-flame-lamp" className="btn-primary">
                شاهدي العروض والأسعار
              </Link>
              <Link href="#products" className="btn-secondary border-gold-400/50 bg-white/5 text-gold-300">
                تصفحي المنتج
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
              {["دفع عند الاستلام", "تأكيد قبل الشحن", "داخل الإمارات", "سلة منظمة"].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center text-cream-50">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="products" className="section-padding bg-cream-50">
        <div className="container-grid">
          <div className="section-heading">
            <p className="badge">اختيار ليالي</p>
            <h2>منتج رئيسي واحد، وباقات واضحة داخل صفحة المنتج</h2>
            <p>
              حافظنا على المنتج الحالي ومسار الشراء كما هو، ورتبنا العرض ليظهر مثل متجر احترافي: صورة/بطاقة،
              اسم، وصف، سعر، وزر واضح.
            </p>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(320px,0.55fr)] lg:items-stretch">
            <ProductCard product={featuredProduct} />
            <div className="premium-card flex flex-col justify-between">
              <div>
                <p className="badge">الباقات الحالية</p>
                <h3 className="mt-4 text-3xl font-black leading-tight text-[var(--emerald-950)]">
                  اختاري العرض من صفحة المنتج نفسها
                </h3>
                <div className="mt-6 grid gap-3">
                  {(featuredProduct.offerTiers ?? []).map((tier) => (
                    <div key={tier.sku} className="rounded-2xl border border-[var(--border-gold)] bg-white p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          {tier.badge && (
                            <span className="rounded-full bg-[var(--sage-100)] px-2.5 py-1 text-xs font-black text-[var(--emerald-950)]">
                              {tier.badge}
                            </span>
                          )}
                          <p className="mt-2 font-black text-[var(--emerald-950)]">{tier.title}</p>
                          <p className="mt-1 text-sm leading-7 text-[var(--muted)]">{tier.description}</p>
                        </div>
                        <p className="shrink-0 text-lg font-black text-[var(--gold-500)]">{money(tier.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <Link href="/products/aroma-flame-lamp" className="btn-primary mt-6">
                افتحي صفحة موقد ليالي
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-grid">
          <div className="section-heading">
            <p className="badge">لماذا ليالي</p>
            <h2>واجهة أوضح لقرار شراء أسرع وأكثر ثقة</h2>
            <p>أربع نقاط تجعل التجربة مفهومة من الهيدر إلى السلة.</p>
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
              متجر مرتب يشرح قبل أن يطلب بيانات العميلة
            </h2>
            <p className="mt-5 leading-9 text-cream-100">
              هذه عبارات عامة حول تجربة الطلب والوضوح، وليست ادعاءات علاجية أو نتائج غير مثبتة.
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
            <p>بدون دفع أونلاين. بدون تعقيد. طلب واضح من الاختيار حتى الاستلام.</p>
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
              ابدئي من صفحة منتج واحدة واضحة
            </h2>
            <p className="mt-5 leading-9 text-cream-100">
              اختاري الباقة المناسبة، أضيفيها للسلة، ثم ثبتي الطلب بالاسم ورقم الهاتف فقط. لا يوجد دفع الآن.
            </p>
            <Link href="/products/aroma-flame-lamp" className="btn-primary mt-8 inline-flex">
              انتقلي إلى صفحة الموقد
            </Link>
          </div>
          <div className="grid gap-4">
            {["الدفع عند الاستلام", "تأكيد الطلب قبل الشحن", "باقات واضحة السعر", "واجهة مناسبة للجوال"].map((item) => (
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
