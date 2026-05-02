"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";

export function Header() {
  const count = useCart((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));
  const openCart = useCart((state) => state.openCart);
  return <>
    <div style={{ background: "var(--oud)", color: "white", textAlign: "center", padding: 9, fontSize: 14 }}>الدفع عند الاستلام داخل الإمارات | عروض محدودة اليوم</div>
    <header className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "18px 0" }}>
      <Link href="/" style={{ fontWeight: 900, fontSize: 22 }}>ليالي بيوتي</Link>
      <nav style={{ display: "flex", gap: 14, color: "var(--muted)", fontSize: 14 }}>
        <Link href="/collections">العروض</Link><Link href="/about">القصة</Link><Link href="/contact">تواصل</Link>
      </nav>
      <button className="btn secondary" onClick={openCart}>السلة ({count})</button>
    </header>
  </>;
}
