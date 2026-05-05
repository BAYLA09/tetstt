import { ShieldCheck, Sparkles, Truck } from "lucide-react";

const values = [
  ["فخامة هادئة", "نصمم التجربة حول حضور راقٍ وليس ضجيجاً إعلانياً."],
  ["وضوح", "الدفع عند الاستلام، تأكيد قبل الشحن، وسعر واضح في كل خطوة."],
  ["عناية", "نختار الرسائل، التغليف، وطريقة الاستخدام بعقلية براند يملك تجربته."],
];

export const metadata = {
  title: "عن ليالي بيوتي | فخامة هادئة تليق بيومك",
};

export default function AboutPage() {
  return (
    <main className="bg-[var(--cream-50)]">
      <section className="bg-[var(--emerald-950)] px-4 py-20 text-[var(--cream-50)]">
        <div className="container-grid grid gap-10 md:grid-cols-[1fr_0.8fr] md:items-center">
          <div>
            <span className="eyebrow text-[var(--gold-300)]">عن ليالي بيوتي</span>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold md:text-6xl">
              براند عربي فاخر للمرأة التي تحب التفاصيل المرتبة.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-9 text-[var(--cream-100)]">
              ليالي بيوتي ليست متجر منتجات عشوائية. هي تجربة عناية عربية
              بلون الزمرد والذهب، مبنية على الوضوح، التغليف الأنيق، وخدمة
              تناسب عميلة الإمارات.
            </p>
          </div>
          <div className="rounded-[2rem] border border-[var(--border-gold)] bg-white/10 p-8 text-[var(--cream-50)]">
            <Sparkles className="h-10 w-10 text-[var(--gold-300)]" />
            <p className="mt-6 text-2xl font-bold">فخامة هادئة تليق بيومك.</p>
            <p className="mt-3 leading-8 text-[var(--cream-100)]">
              منتجات مختارة بعناية، تجربة طلب واضحة، وتفاصيل تشعرك أن العناية
              بنفسك تستاهل الأفضل.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-20">
        <div className="container-grid grid gap-6 md:grid-cols-3">
          {values.map(([title, body]) => (
            <div className="premium-card" key={title}>
              <ShieldCheck className="h-8 w-8 text-[var(--gold-500)]" />
              <h2 className="mt-4 text-2xl font-bold text-[var(--emerald-950)]">{title}</h2>
              <p className="mt-3 leading-8 text-[var(--muted)]">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 pb-20">
        <div className="container-grid rounded-[2rem] bg-[var(--emerald-900)] p-8 text-[var(--cream-50)] md:p-12">
          <Truck className="h-10 w-10 text-[var(--gold-300)]" />
          <h2 className="mt-4 text-3xl font-bold">خدمة واضحة داخل الإمارات</h2>
          <p className="mt-3 max-w-3xl leading-8 text-[var(--cream-100)]">
            الطلب بالدفع عند الاستلام. بعد الإرسال، يتواصل الفريق لتأكيد
            البيانات قبل تجهيز الشحنة، حتى تكون كل خطوة مفهومة ومريحة.
          </p>
        </div>
      </section>
    </main>
  );
}
