import { MessageCircle, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <main>
      <section className="section container">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="panel p-8">
            <p className="eyebrow">تواصل معنا</p>
            <h1 className="mt-3 text-4xl font-bold text-[var(--emerald-950)]">
              نحن هنا لتأكيد طلبك ومساعدتك.
            </h1>
            <p className="mt-4 text-lg leading-8 text-[var(--muted)]">
              بعد الطلب، يتواصل معك فريق ليالي بيوتي لتأكيد الاسم والرقم قبل الشحن.
            </p>
          </div>
          <div className="grid gap-4">
            {[
              ["واتساب", "تواصلي معنا لتأكيد الطلب أو الاستفسار.", MessageCircle],
              ["هاتف", "أدخلي رقمك في الطلب وسنتواصل معك قبل الشحن.", Phone],
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
