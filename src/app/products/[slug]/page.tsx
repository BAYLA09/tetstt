import Link from "next/link";
import { notFound } from "next/navigation";
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
        <div className="container-grid grid items-center gap-10 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <p className="section-kicker">ليش ليالي؟</p>
            <h2 className="section-title">مو منتج عشوائي. تجربة فخامة هادئة.</h2>
            <p className="mt-5 text-lg leading-9 text-[var(--muted)]">
              اخترنا العرض ليحسسك أن العناية بنفسك تستاهل تفاصيل أجمل:
              تغليف أنيق، رائحة راقية، دفع عند الاستلام، وتأكيد قبل الشحن.
            </p>
          </div>
          <div className="order-1 rounded-[2rem] border border-[var(--border-gold)] bg-[var(--emerald-950)] p-8 text-[var(--gold-300)] shadow-2xl lg:order-2">
            <div className="aspect-square rounded-[1.5rem] border border-[var(--border-gold)] bg-[radial-gradient(circle_at_top,#d9ad63,transparent_32%),linear-gradient(145deg,#06472f,#013f2a)] p-8">
              <div className="flex h-full items-center justify-center rounded-full border border-[var(--gold-500)] text-center text-7xl">
                ✦
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16">
        <div className="container-grid grid items-center gap-10 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-[var(--border-gold)] bg-[var(--cream-50)] p-8">
            <p className="section-kicker">طريقة الاستخدام</p>
            <h2 className="section-title">روتين بسيط يعطي حضور مرتب.</h2>
            <div className="mt-8 space-y-4">
              {[
                "استخدمي كمية بسيطة حسب الإرشادات.",
                "خليه جزء من روتينك قبل الطلعة أو بعد الاستحمام.",
                "احتفظي بالعبوة في مكان جاف وبعيد عن الحرارة.",
              ].map((step, index) => (
                <div key={step} className="flex gap-4 rounded-2xl bg-white p-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--emerald-950)] text-sm font-bold text-[var(--gold-300)]">
                    {index + 1}
                  </span>
                  <p className="text-[var(--muted)]">{step}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="section-kicker">ثقة قبل الطلب</p>
            <h2 className="section-title">كل شيء واضح قبل ما يوصل الطلب.</h2>
            <div className="mt-6 grid gap-3">
              {[
                "الدفع عند الاستلام داخل الإمارات.",
                "تأكيد الطلب قبل الشحن.",
                "استخدام لغة واضحة بدون وعود طبية غير مثبتة.",
                "إمكانية إضافة عرض أوفر داخل السلة.",
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
            <p className="section-kicker text-[var(--gold-300)]">أسئلة مهمة</p>
            <h2 className="text-4xl font-bold">قبل ما تطلبين</h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              ["هل الدفع عند الاستلام؟", "نعم، لا تدفعين الآن. يتم الدفع عند وصول الطلب."],
              ["هل السعر ثابت؟", "العرض الحالي مرتبط بتوفر الدفعة وقد يتغير لاحقاً."],
              ["هل يناسب الاستخدام اليومي؟", "استخدميه حسب الإرشادات، وجربي كمية بسيطة إذا كانت بشرتك حساسة."],
            ].map(([question, answer]) => (
              <div key={question} className="rounded-3xl border border-[var(--border-gold)] bg-white/5 p-6">
                <h3 className="font-bold text-[var(--gold-300)]">{question}</h3>
                <p className="mt-3 leading-7 text-white/75">{answer}</p>
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
    </div>
  );
}
