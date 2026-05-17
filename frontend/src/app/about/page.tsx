import { ShieldCheck, Sparkles, Truck } from "lucide-react";

const values = [
  ["فخامة هادئة", "نصمم التجربة حول حضور راقٍ وليس ضجيجاً إعلانياً."],
  ["وضوح", "الدفع عند الاستلام، تأكيد قبل الشحن، وسعر واضح في كل خطوة."],
  ["عناية", "نختار الرسائل، التغليف، وطريقة الاستخدام بعقلية براند يملك تجربته."],
];

export default function AboutPage() {
  return (
    <main className="bg-cream-50">
      <section className="section-padding bg-emerald-950 text-cream-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-[1fr_0.8fr] md:items-center">
          <div>
            <p className="eyebrow text-gold-300">عن ليالي بيوتي</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold md:text-6xl">
              براند عربي فاخر للمرأة التي تحب التفاصيل المرتبة.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-9 text-cream-100">
              ليالي بيوتي ليست متجر منتجات عشوائية. هي تجربة عناية عربية
              بلون الزمرد والذهب، مبنية على الوضوح، التغليف الأنيق، وخدمة
              تناسب عميلة الإمارات.
            </p>
          </div>
          <div className="card-premium bg-white/8 p-8 text-cream-50">
            <Sparkles className="h-10 w-10 text-gold-300" />
            <p className="mt-6 text-2xl font-bold">فخامة هادئة تليق بيومك.</p>
            <p className="mt-3 leading-8 text-cream-100">
              منتجات مختارة بعناية، تجربة طلب واضحة، وتفاصيل تشعرك أن العناية
              بنفسك تستاهل الأفضل.
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
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-white/10 bg-emerald-900/95 p-8 text-cream-50 shadow-2xl ring-1 ring-white/5 md:p-12">
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
