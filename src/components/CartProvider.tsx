"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Minus, Plus, ShoppingBag, X } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import { getCrossSells, getProductBySku, money, Product } from "@/lib/products";
import { normalizeUaePhone } from "@/lib/phone";
import { generateEventId, trackEvent } from "@/lib/events";

function MiniProduct({ product, onAdd }: { product: Product; onAdd: () => void }) {
  return (
    <div className="rounded-2xl border border-[var(--border-gold)] bg-white p-3 shadow-[0_10px_30px_rgba(1,63,42,0.08)]">
      <div className="flex items-center gap-3">
        <div className="relative size-14 shrink-0 overflow-hidden rounded-xl">
          <Image
            src={product.cardImage}
            alt={product.name}
            fill
            sizes="56px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-bold text-[var(--emerald-950)]">{product.name}</p>
          <p className="text-xs text-[var(--muted)] line-clamp-1">{product.subheading}</p>
          <p className="mt-1 font-bold text-[var(--gold-500)]">{money(product.price)}</p>
        </div>
        <button onClick={onAdd} className="rounded-full bg-[var(--emerald-950)] px-3 py-2 text-xs font-bold text-[var(--gold-300)]">
          أضيفيه
        </button>
      </div>
    </div>
  );
}


export function CartProvider({ children }: { children: React.ReactNode }) {
  const { items, isCartOpen, checkoutState, addItem, removeItem, updateQuantity, closeCart, openCheckout, closeCheckout, clearCart } = useCartStore();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const total = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);
  const crossSells = getCrossSells(items.map((item) => item.sku));
  const normalizedPhone = normalizeUaePhone(phone);
  const canSubmit = name.trim().length >= 2 && Boolean(normalizedPhone) && items.length > 0 && !submitting;

  function submitOrder(event: FormEvent) {
    event.preventDefault();
    if (!canSubmit || !normalizedPhone) return;
    setSubmitting(true);

    // Generate local order ID — no backend needed
    const orderId = `LB-${new Date().toISOString().slice(0,10).replace(/-/g,"")}${Math.random().toString(36).slice(2,6).toUpperCase()}`;

    trackEvent("Purchase", { value: total });
    closeCheckout();
    clearCart();
    window.location.href = `/thank-you/${orderId}`;
  }


  return (
    <>
      {children}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50">
            <button aria-label="إغلاق السلة" className="absolute inset-0 bg-black/50" onClick={closeCart} />
            <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 28 }} className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
              <div className="flex items-center justify-between bg-[var(--emerald-950)] p-5 text-white">
                <div>
                  <p className="text-sm text-[var(--gold-300)]">طلبك محفوظ الآن</p>
                  <h2 className="text-xl font-black">سلة ليالي بيوتي</h2>
                </div>
                <button onClick={closeCart} className="rounded-full border border-white/20 p-2"><X /></button>
              </div>
              <div className="flex-1 space-y-4 overflow-y-auto p-5">
                <div className="rounded-3xl bg-[var(--emerald-950)] p-4 text-white">
                  <p className="text-xs font-bold text-[var(--gold-300)]">مهم قبل التأكيد</p>
                  <p className="mt-1 text-sm leading-7">سنؤكد طلبك عبر الهاتف/واتساب قبل الشحن. الطلبات المؤكدة فقط تدخل التجهيز حتى توصلك التجربة مثل ما اخترتيها.</p>
                </div>
                {crossSells.length > 0 && (
                  <div className="space-y-3 rounded-3xl border border-[var(--border-gold)] bg-[var(--cream-50)] p-4">
                    <div>
                      <p className="text-xs font-bold text-[var(--gold-500)]">لرفع قيمة الطلب اليوم</p>
                      <p className="font-black text-[var(--emerald-950)]">أضيفي ثنائي السيروم قبل التأكيد</p>
                      <p className="mt-1 text-xs leading-6 text-[var(--muted)]">بدل طلب سيروم واحد لاحقاً، خذي الإضافة الآن مع نفس التوصيل والتأكيد.</p>
                    </div>
                    {crossSells.map((product) => <MiniProduct key={product.sku} product={product} onAdd={() => addItem(product)} />)}
                  </div>
                )}
                {items.length === 0 ? (
                  <div className="rounded-3xl bg-[var(--cream-50)] p-8 text-center">
                    <ShoppingBag className="mx-auto mb-3 text-[var(--gold-500)]" />
                    <p className="font-bold">السلة فارغة حالياً</p>
                  </div>
                ) : items.map((item) => {
                  const productData = getProductBySku(item.sku);
                  return (
                    <div key={item.sku} className="rounded-2xl border border-[var(--border-gold)] p-3">
                      <div className="flex gap-3">
                        {productData && (
                          <div className="relative size-16 shrink-0 overflow-hidden rounded-xl">
                            <Image
                              src={productData.cardImage}
                              alt={item.name}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between gap-2">
                            <p className="font-bold text-[var(--emerald-950)] leading-snug">{item.name}</p>
                            <button onClick={() => removeItem(item.sku)} className="shrink-0 text-xs text-red-600 hover:text-red-800">حذف</button>
                          </div>
                          <p className="mt-1 text-sm font-bold text-[var(--gold-500)]">{money(item.price)}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <button onClick={() => updateQuantity(item.sku, item.quantity - 1)} className="rounded-full border border-[var(--border-gold)] p-1.5"><Minus size={12} /></button>
                            <span className="min-w-6 text-center text-sm font-bold">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.sku, item.quantity + 1)} className="rounded-full border border-[var(--border-gold)] p-1.5"><Plus size={12} /></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-[var(--border-gold)] bg-[var(--cream-50)] p-5">
                <div className="mb-3 flex justify-between text-lg font-black">
                  <span>الإجمالي</span>
                  <span>{money(total)}</span>
                </div>
                <p className="mb-4 flex items-center gap-2 text-sm text-[var(--emerald-950)]"><CheckCircle2 size={16} /> الدفع عند الاستلام - لا تدفعين الآن</p>
                <button disabled={!items.length} onClick={openCheckout} className="w-full rounded-full bg-[var(--gold-500)] px-6 py-4 font-black text-[var(--emerald-950)] disabled:opacity-50">ثبتي الطلب للتأكيد</button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {checkoutState === "checkout" && (
          <div className="fixed inset-0 z-[60] grid place-items-center bg-black/45 p-4 lg:place-items-center">
            <motion.form onSubmit={submitOrder} initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 24, opacity: 0 }} className="w-full max-w-lg rounded-[2rem] border border-[var(--border-gold)] bg-white p-6 shadow-2xl">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-[var(--gold-500)]">خطوة التأكيد - الدفع عند الاستلام</p>
                  <h2 className="text-2xl font-black text-[var(--emerald-950)]">اكتبي بياناتك ونثبت لك الطلب</h2>
                  <p className="mt-2 text-sm leading-7 text-[var(--muted)]">لا يوجد دفع الآن. سنراجع الرقم ونتواصل معك لتأكيد الشحنة قبل التجهيز حتى تقل الأخطاء والتأخير.</p>
                </div>
                <button type="button" onClick={closeCheckout} className="rounded-full border p-2"><X /></button>
              </div>
              <div className="mb-5 rounded-2xl bg-[var(--cream-50)] p-4">
                <div className="flex justify-between font-black"><span>ملخص الطلب</span><span>{money(total)}</span></div>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">طلبك محجوز مؤقتاً. إذا كان الرقم صحيحاً، فريق التأكيد يتواصل قبل الشحن.</p>
              </div>
              <div className="grid gap-3">
                <label className="grid gap-2 text-sm font-bold text-[var(--emerald-950)]">الاسم الكامل
                  <input value={name} onChange={(e) => setName(e.target.value)} dir="rtl" className="rounded-2xl border border-[var(--border-gold)] px-4 py-3 text-right outline-none placeholder:text-right focus:ring-2 focus:ring-[var(--gold-400)]" placeholder="مثال: فاطمة علي" />
                </label>
                <label className="grid gap-2 text-sm font-bold text-[var(--emerald-950)]">رقم الهاتف الإماراتي
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} dir="ltr" inputMode="tel" className="rounded-2xl border border-[var(--border-gold)] px-4 py-3 text-left outline-none placeholder:text-left focus:ring-2 focus:ring-[var(--gold-400)]" placeholder="+971 50 123 4567" />
                </label>
              </div>
              {phone && !normalizedPhone && <p className="mt-2 text-sm text-red-700">أدخلي رقم إماراتي صحيح — مثال: 0501234567 أو +971501234567</p>}
              <button disabled={!canSubmit} className="mt-5 w-full rounded-full bg-[var(--emerald-950)] px-6 py-4 font-black text-[var(--gold-300)] disabled:opacity-50">
                {submitting ? "جاري تثبيت الطلب..." : "ثبتي الطلب الآن"}
              </button>
              <p className="mt-3 text-center text-xs leading-6 text-[var(--muted)]">الطلب لا يدخل الشحن إلا بعد تأكيدك. هذا يساعدنا نوصل الطلبات المؤكدة بسرعة ونقلل الإلغاءات.</p>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

    </>
  );
}
