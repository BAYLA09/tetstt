"use client";

import Link from "next/link";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import { BrandLogo } from "./BrandLogo";

const nav = [
  { href: "/", label: "الرئيسية" },
  { href: "/collections", label: "المجموعة" },
  { href: "/products/luxury-bundle", label: "الباقة" },
  { href: "/about", label: "عن ليالي" },
  { href: "/contact", label: "تواصل" },
];

const WHATSAPP = "https://wa.me/971500000000";

const topBarMessages = [
  "الدفع عند الاستلام داخل الإمارات - لا تدفعين الآن",
  "تأكيد الطلب قبل الشحن لتقليل الإلغاء وضمان الجدية",
  "عرض اليوم محجوز حسب السعر الظاهر في صفحة المنتج والسلة",
  "تجربة ليالي بيوتي: تغليف فاخر، رائحة راقية، ودعم واتساب",
];

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const count = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0),
  );
  const openCart = useCartStore((state) => state.openCart);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[var(--border-gold)] bg-[rgba(1,63,42,0.97)] text-[var(--cream-50)] backdrop-blur">
        {/* Top scrolling bar */}
        <div className="overflow-hidden border-b border-[var(--border-gold)] bg-black/20 py-2">
          <div className="topbar-track flex w-max gap-10 text-xs font-bold text-[var(--gold-300)] md:text-sm">
            {[...topBarMessages, ...topBarMessages].map((message, index) => (
              <span key={`${message}-${index}`} className="whitespace-nowrap">
                ✦ {message}
              </span>
            ))}
          </div>
        </div>

        {/* Main nav row */}
        <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-3 lg:px-8">
          {/* Logo — right on mobile, right on desktop too (RTL) */}
          <div className="justify-self-start lg:order-3 lg:justify-self-end">
            <Link href="/">
              <BrandLogo />
            </Link>
          </div>

          {/* Desktop nav — center */}
          <nav className="hidden items-center justify-center gap-7 text-sm font-semibold lg:order-2 lg:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition hover:text-[var(--gold-300)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions — left */}
          <div className="flex items-center justify-self-end gap-3 lg:order-1 lg:justify-self-start">
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-full border border-[var(--border-gold)] px-4 py-2 text-sm font-bold text-[var(--gold-300)] transition hover:bg-white/10 lg:inline-flex"
            >
              واتساب
            </a>
            <button
              onClick={openCart}
              className="relative rounded-full bg-[var(--gold-500)] p-3 text-[var(--emerald-950)] shadow-lg shadow-black/20 transition hover:bg-[var(--gold-400)]"
              aria-label="افتحي السلة"
            >
              <ShoppingBag size={20} />
              {count > 0 && (
                <span className="absolute -left-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-white text-xs font-bold text-[var(--emerald-950)]">
                  {count}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-full border border-[var(--border-gold)] p-3 transition hover:bg-white/10 lg:hidden"
              aria-label="القائمة"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="إغلاق القائمة"
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <nav className="absolute right-0 top-0 flex h-full w-72 flex-col bg-[var(--emerald-950)] shadow-2xl">
            <div className="flex items-center justify-between p-5">
              <BrandLogo />
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-full border border-[var(--border-gold)] p-2 text-[var(--cream-50)]"
                aria-label="إغلاق"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 pb-5">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block border-b border-[var(--border-gold)] py-4 text-lg font-semibold text-[var(--cream-50)] transition hover:text-[var(--gold-300)]"
                >
                  {item.label}
                </Link>
              ))}
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex items-center justify-center rounded-full bg-[var(--gold-500)] px-6 py-4 font-bold text-[var(--emerald-950)]"
              >
                تواصل عبر واتساب
              </a>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}

export function Footer() {
  return (
    <footer className="bg-[var(--emerald-950)] text-[var(--cream-50)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-[1.3fr_1fr_1fr] lg:px-8">
        <div>
          <Link href="/">
            <BrandLogo />
          </Link>
          <p className="mt-5 max-w-md text-sm leading-7 text-[var(--cream-100)]">
            ليالي بيوتي تجربة عناية عربية فاخرة للمرأة التي تحب الرائحة الراقية،
            الوضوح، والدفع عند الاستلام داخل الإمارات.
          </p>
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-[var(--border-gold)] px-4 py-2 text-sm font-bold text-[var(--gold-300)] transition hover:bg-white/10"
          >
            تواصل عبر واتساب
          </a>
        </div>
        <div>
          <h3 className="font-bold text-[var(--gold-300)]">روابط مهمة</h3>
          <div className="mt-4 grid gap-3 text-sm">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-[var(--gold-300)] transition"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-bold text-[var(--gold-300)]">الثقة والطلب</h3>
          <ul className="mt-4 grid gap-3 text-sm text-[var(--cream-100)]">
            <li>✓ الدفع عند الاستلام</li>
            <li>✓ تأكيد الطلب قبل الشحن</li>
            <li>✓ توصيل داخل الإمارات</li>
            <li>✓ دعم عبر واتساب</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[var(--border-gold)] px-4 py-5 text-center text-xs text-[var(--cream-100)]/60">
        © {new Date().getFullYear()} ليالي بيوتي — جميع الحقوق محفوظة
      </div>
    </footer>
  );
}
