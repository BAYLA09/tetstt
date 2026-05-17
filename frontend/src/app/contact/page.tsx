import { MessageCircle, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <main>
      <section className="section container">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="panel p-8">
            <p className="eyebrow">تواصل معنا</p>
            <h1 className="mt-3 text-4xl font-bold text-[var(--emerald-950)]">
              إحنا هني عشان نأكد لج عرض عود قصر دبي ونساعدج.
            </h1>
            <p className="mt-4 text-lg leading-8 text-[var(--muted)]">
              بعد ما تختارين عرض الجفاف المناسب، فريق ليالي بيوتي يتواصل معاج ويأكد الاسم والرقم قبل الشحن.
            </p>
          </div>
          <div className="grid gap-4">
            {[
              ["واتساب", "تواصلي معنا لتأكيد عرض عبوة، عبوتين، أو ثلاث عبوات.", MessageCircle],
              ["هاتف", "أدخلي رقمك في الطلب وبنتواصل معاج قبل الشحن.", Phone],
            ].map(([title, text, Icon]) => (
              <div className="panel flex gap-4 p-6" key={title as string}>
                <Icon className="mt-1 text-[var(--gold-500)]" />
                <div>
                  <h2 className="text-xl font-bold text-[var(--emerald-950)]">{title as string}</h2>
                  <p className="mt-2 text-[var(--muted)]">{text as string}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
