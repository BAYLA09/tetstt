"use client";

import Link from "next/link";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import { BrandLogo } from "./BrandLogo";

const nav = [
  { href: "/", label: "الرئيسية" },
  { href: "/products/dubai-palace-oud-serum", label: "عود قصر دبي" },
  { href: "/products/aroma-flame-lamp", label: "موقد الجو الجاف" },
  { href: "/collections", label: "العروض" },
  { href: "/about", label: "عن ليالي" },
  { href: "/contact", label: "تواصل" },
];

const topBarMessages = [
  "جفاف البشرة في الإمارات؟ ابدئي بروتين عود قصر دبي",
  "وحدة 199 · جوج 279 · ثلاثة 349",
  "الدفع عند الاستلام داخل الإمارات - لا تدفعين الآن",
  "تأكيد الطلب قبل الشحن وسعر واضح قبل السلة",
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const count = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0),
  );
  const openCart = useCartStore((state) => state.openCart);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border-gold)] bg-[rgba(25,55,47,0.96)] text-[var(--cream-50)] backdrop-blur">
      <div className="overflow-hidden border-b border-white/10 bg-black/15 py-2">
        <div className="topbar-track flex w-max gap-10 text-xs font-bold text-[var(--gold-300)] md:text-sm">
          {[...topBarMessages, ...topBarMessages].map((message, index) => (
            <span key={`${message}-${index}`} className="whitespace-nowrap">
              ✦ {message}
            </span>
          ))}
        </div>
      </div>
      <div className="container-grid grid grid-cols-[auto_1fr_auto] items-center gap-4 py-3">
        <div className="justify-self-start lg:order-3 lg:justify-self-end">
          <Link href="/" aria-label="العودة للرئيسية" onClick={() => setMenuOpen(false)}>
            <BrandLogo />
          </Link>
        </div>
        <nav className="hidden items-center justify-center gap-7 text-sm font-semibold lg:order-2 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 transition hover:bg-white/10 hover:text-[var(--gold-300)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center justify-self-end gap-3 lg:order-1 lg:justify-self-start">
          <a
            href="https://wa.me/"
            className="hidden rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-bold text-[var(--gold-300)] transition hover:bg-white/10 lg:inline-flex"
          >
            واتساب
          </a>
          <button
            onClick={openCart}
            className="relative rounded-full bg-[var(--gold-500)] p-3 text-[var(--emerald-950)] shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-[var(--gold-400)]"
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
            className="rounded-full border border-white/15 bg-white/5 p-3 lg:hidden"
            aria-label={menuOpen ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav className="border-t border-white/10 bg-[rgba(25,55,47,0.98)] px-4 pb-4 lg:hidden">
          <div className="container-grid grid gap-2 pt-4 text-sm font-bold">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[var(--cream-50)]"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-[var(--emerald-950)] text-[var(--cream-50)]">
      <div className="container-grid grid gap-10 py-12 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <Link href="/">
            <BrandLogo />
          </Link>
          <p className="mt-5 max-w-md text-sm leading-7 text-[var(--cream-100)]">
            ليالي بيوتي تجربة عناية عربية تركّز على جفاف البشرة في الإمارات: روتين عود قصر دبي،
            عروض واضحة، والدفع عند الاستلام.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold text-[var(--gold-300)]">
            {["لجفاف البشرة", "وحدة 199", "دفع عند الاستلام"].map((item) => (
              <span key={item} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                {item}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-bold text-[var(--gold-300)]">روابط مهمة</h3>
          <div className="mt-4 grid gap-3 text-sm">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-[var(--gold-300)]">
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
      <div className="border-t border-white/10 py-4 text-center text-xs text-[var(--cream-100)]">
        © {new Date().getFullYear()} Layali Beauty. جميع الحقوق محفوظة.
      </div>
    </footer>
  );
}
