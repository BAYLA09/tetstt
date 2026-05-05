import { MessageCircle, Phone } from "lucide-react";

export const metadata = {
  title: "تواصل معنا | ليالي بيوتي",
};

const WHATSAPP = "https://wa.me/971500000000";

export default function ContactPage() {
  return (
    <main className="bg-[var(--cream-50)]">
      <section className="px-4 py-20">
        <div className="container-grid grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-[2rem] border border-[var(--border-gold)] bg-white p-8 shadow-[0_20px_60px_rgba(1,63,42,0.1)]">
            <span className="eyebrow">تواصل معنا</span>
            <h1 className="mt-3 text-4xl font-bold text-[var(--emerald-950)]">
              نحن هنا لتأكيد طلبك ومساعدتك.
            </h1>
            <p className="mt-4 text-lg leading-8 text-[var(--muted)]">
              بعد الطلب، يتواصل معك فريق ليالي بيوتي لتأكيد الاسم والرقم قبل الشحن.
            </p>
          </div>
          <div className="grid gap-4">
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-4 rounded-[2rem] border border-[var(--border-gold)] bg-white p-6 shadow-[0_10px_30px_rgba(1,63,42,0.08)] transition hover:border-[var(--gold-400)] hover:shadow-[0_20px_50px_rgba(1,63,42,0.15)]"
            >
              <MessageCircle className="mt-1 shrink-0 text-[var(--gold-500)]" />
              <div>
                <h2 className="text-xl font-bold text-[var(--emerald-950)]">واتساب</h2>
                <p className="mt-2 text-[var(--muted)]">تواصلي معنا لتأكيد الطلب أو الاستفسار.</p>
              </div>
            </a>
            <div className="flex gap-4 rounded-[2rem] border border-[var(--border-gold)] bg-white p-6 shadow-[0_10px_30px_rgba(1,63,42,0.08)]">
              <Phone className="mt-1 shrink-0 text-[var(--gold-500)]" />
              <div>
                <h2 className="text-xl font-bold text-[var(--emerald-950)]">هاتف</h2>
                <p className="mt-2 text-[var(--muted)]">أدخلي رقمك في الطلب وسنتواصل معك قبل الشحن.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
