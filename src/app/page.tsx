import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/lib/products";

const proofCards = [
  "تأكيد الطلب قبل الشحن يقلل النسيان ويلغي الطلبات غير الجادة.",
  "الدفع عند الاستلام يخلي القرار أسهل بدون خوف من الدفع المسبق.",
  "عرض السلة يقترح الإضافة المناسبة بدل ما يترك العميلة تطلع بطلب صغير.",
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
                <p className="text-sm text-gold-300">Layali Beauty</p>
                <div className="mx-auto mt-6 h-52 w-40 rounded-t-full border border-gold-400/50 bg-gradient-to-b from-gold-300/70 to-cream-100/90 shadow-xl" />
                <p className="mt-6 text-2xl font-semibold text-gold-300">
                  باقة ليالي بيوتي
                </p>
              </div>
            </div>
          </div>
          <div className="order-1 text-white lg:order-2">
            <p className="badge border-gold-400/50 bg-gold-400/10 text-gold-300">
              الدفع عند الاستلام داخل الإمارات
            </p>
            <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
              فخامة هادئة تبدأ من تفاصيل العناية اليومية
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-9 text-cream-100/90">
              باقة مختارة للمرأة التي تحب النظافة، النعومة، والرائحة الراقية.
              تجربة عربية فاخرة مع تأكيد قبل الشحن ودفع عند الاستلام.
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
              {["COD", "توصيل الإمارات", "تغليف أنيق", "تأكيد قبل الشحن"].map((item) => (
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
            <p className="badge">ثقة قبل الشحن</p>
            <h2>طلب واضح يقلل التردد ويزيد فرصة الاستلام</h2>
            <p>
              العميلة لا تحتاج وعود كبيرة؛ تحتاج تجربة مفهومة: ماذا ستستلم،
              لماذا السعر منطقي، ومتى سيتم تأكيد الطلب.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {proofCards.map((proof) => (
              <div key={proof} className="premium-card">
                <p className="text-gold-500">✦</p>
                <p className="mt-4 leading-8 text-emerald-950">{proof}</p>
                <p className="mt-4 text-sm text-muted">مصمم لرفع التأكيد والتوصيل</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-grid">
          <div className="section-heading">
            <p className="badge">اختاري عرضك</p>
            <h2>العرض الرئيسي واللمسات التي ترفع التجربة</h2>
            <p>الباقة هي الاختيار الأفضل، والسيرومات تكمل الطلب داخل السلة.</p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.sku} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-emerald-950 text-white">
        <div className="container-grid grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="badge border-gold-400/40 bg-gold-400/10 text-gold-300">
              لماذا السعر أعلى؟
            </p>
            <h2 className="mt-5 text-3xl font-bold md:text-5xl">
              لأنك تطلبين تجربة كاملة، مو منتج عشوائي
            </h2>
            <p className="mt-5 leading-9 text-cream-100">
              اختيار، عرض، تغليف، تعليمات استعمال، دعم قبل الشحن، ودفع عند
              الاستلام. كل تفصيلة مصممة لتعطي إحساس فخم وواضح.
            </p>
          </div>
          <div className="grid gap-4">
            {["مختارة بعناية لتناسب الذوق الخليجي", "طريقة استعمال واضحة", "تأكيد الطلب قبل الشحن", "تجربة دفع عند الاستلام"].map((item) => (
              <div key={item} className="rounded-3xl border border-gold-400/30 bg-white/5 p-5 text-gold-300">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
