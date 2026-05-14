import { ShieldCheck, Sparkles, Truck } from "lucide-react";

const values = [
  ["مشكلة واضحة", "نركز على جفاف البشرة والشد الذي يزيد مع مكيفات وحرارة الإمارات."],
  ["عروض مفهومة", "عبوة، عبوتين، أو ثلاث عبوات بأسعار واضحة قبل إضافة المنتج للسلة."],
  ["عناية بدون مبالغة", "نتحدث عن إحساس النعومة والرائحة الفاخرة بدون وعود علاجية غير مثبتة."],
];

export default function AboutPage() {
  return (
    <main className="bg-cream-50">
      <section className="section-padding bg-emerald-950 text-cream-50">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-[1fr_0.8fr] md:items-center">
          <div>
            <p className="eyebrow text-gold-300">عن ليالي بيوتي</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold md:text-6xl">
              علامة عربية تركز على جفاف البشرة في جو الإمارات.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-9 text-cream-100">
              ليالي بيوتي ليست متجر منتجات عشوائية. زاويتنا الآن واضحة:
              البشرة التي تتعب من المكيف، الشمس، والجو الجاف، مع روتين عود
              قصر دبي وتجربة طلب تناسب عميلة الإمارات.
            </p>
          </div>
          <div className="card-premium bg-white/10 p-8 text-cream-50">
            <Sparkles className="h-10 w-10 text-gold-300" />
            <p className="mt-6 text-2xl font-bold">روتين نعومة برائحة عود.</p>
            <p className="mt-3 leading-8 text-cream-100">
              عناية يومية بعد الاستحمام أو قبل النوم، مصممة كطقس بسيط لإحساس
              الجفاف والشد المنتشر في الإمارات.
            </p>
          </div>
        </div>
      </section>
      <section className="section-padding">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 md:grid-cols-3">
          {values.map(([title, body]) => (
            <div className="card-premium p-7" key={title}>
              <ShieldCheck className="h-8 w-8 text-gold-500" />
              <h2 className="mt-4 text-2xl font-bold text-emerald-950">{title}</h2>
              <p className="mt-3 leading-8 text-muted">{body}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="px-4 pb-20">
        <div className="mx-auto max-w-6xl rounded-[2rem] bg-emerald-900 p-8 text-cream-50 md:p-12">
          <Truck className="h-10 w-10 text-gold-300" />
          <h2 className="mt-4 text-3xl font-bold">خدمة واضحة داخل الإمارات</h2>
          <p className="mt-3 max-w-3xl leading-8 text-cream-100">
            الطلب بالدفع عند الاستلام. بعد الإرسال، يتواصل الفريق لتأكيد
            البيانات قبل تجهيز الشحنة، حتى تكون كل خطوة مفهومة ومريحة.
          </p>
        </div>
      </section>
    </main>
  );
}
