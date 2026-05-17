"use client";

import Link from "next/link";
import { Menu, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { BrandLogo } from "./BrandLogo";

const nav = [
  { href: "/", label: "الرئيسية" },
  { href: "/products/aroma-flame-lamp", label: "موقد ليالي" },
  { href: "/about", label: "عن ليالي" },
  { href: "/contact", label: "تواصل" },
];

const topBarMessages = [
  "الدفع عند الاستلام داخل الإمارات - لا تدفعين الآن",
  "تأكيد الطلب قبل الشحن لتقليل الإلغاء وضمان الجدية",
  "عرض اليوم محجوز حسب السعر الظاهر في صفحة المنتج والسلة",
  "تجربة ليالي بيوتي: تغليف فاخر، رائحة راقية، ودعم واتساب",
];

export function SiteHeader() {
  const count = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0),
  );
  const openCart = useCartStore((state) => state.openCart);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border-gold)] bg-[rgba(1,63,42,0.98)] text-[var(--cream-50)] shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-sm">
      <div className="overflow-hidden border-b border-white/10 bg-black/18 py-2.5">
        <div className="topbar-track flex w-max gap-12 text-xs font-bold tracking-wide text-[var(--gold-300)]/95 md:text-sm">
          {[...topBarMessages, ...topBarMessages].map((message, index) => (
            <span key={`${message}-${index}`} className="whitespace-nowrap">
              ✦ {message}
            </span>
          ))}
        </div>
      </div>
      <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-3.5 lg:px-8">
        <div className="justify-self-start lg:order-3 lg:justify-self-end">
          <BrandLogo />
        </div>
        <nav className="hidden items-center justify-center gap-7 text-sm font-semibold lg:order-2 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-[var(--cream-50)]/90 transition-colors duration-200 ease-out hover:bg-white/10 hover:text-[var(--gold-300)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center justify-self-end gap-3 lg:order-1 lg:justify-self-start">
          <a
            href="https://wa.me/"
            className="hidden rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-bold text-[var(--gold-300)] shadow-sm transition-colors duration-200 ease-out hover:border-[var(--gold-400)]/40 hover:bg-white/10 lg:inline-flex"
          >
            واتساب
          </a>
          <button
            onClick={openCart}
            className="relative rounded-full bg-[var(--gold-500)] p-3 text-[var(--emerald-950)] shadow-lg shadow-black/25 transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-[var(--gold-400)] hover:shadow-xl active:translate-y-0"
            aria-label="افتحي السلة"
          >
            <ShoppingBag size={20} />
            {count > 0 && (
              <span className="absolute -left-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-white text-xs font-bold text-[var(--emerald-950)]">
                {count}
              </span>
            )}
          </button>
          <button className="rounded-full border border-white/15 bg-white/5 p-3 text-[var(--cream-50)] transition-colors duration-200 hover:bg-white/10 lg:hidden" aria-label="القائمة">
            <Menu size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[var(--emerald-950)] text-[var(--cream-50)] shadow-[0_-12px_40px_rgba(0,0,0,0.08)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-[1.3fr_1fr_1fr] lg:px-8">
        <div>
          <BrandLogo />
          <p className="mt-5 max-w-md text-sm leading-7 text-[var(--cream-100)]">
            ليالي بيوتي تجربة عناية عربية فاخرة للمرأة التي تحب الرائحة الراقية، الوضوح، والدفع عند الاستلام داخل الإمارات.
          </p>
        </div>
        <div>
          <h3 className="font-bold text-[var(--gold-300)]">روابط مهمة</h3>
          <div className="mt-4 grid gap-3 text-sm">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="transition-colors duration-200 hover:text-[var(--gold-300)]">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-bold text-[var(--gold-300)]">الثقة والطلب</h3>
          <ul className="mt-4 grid gap-3 text-sm text-[var(--cream-100)]">
            <li>الدفع عند الاستلام</li>
            <li>تأكيد الطلب قبل الشحن</li>
            <li>توصيل داخل الإمارات</li>
            <li>دعم عبر واتساب</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
