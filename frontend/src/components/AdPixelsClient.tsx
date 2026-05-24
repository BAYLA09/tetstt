"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/** Snap Pixel + `layali:track` bridge (PAGE_VIEW, VIEW_CONTENT, ADD_CART, START_CHECKOUT, PURCHASE). */

function loadSnapSdk(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  const w = window as Window & { snaptr?: (...args: unknown[]) => void };
  if (w.snaptr) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[src="https://sc-static.net/scevent.min.js"]');
    if (existing) {
      if (w.snaptr) {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("snap load error")), { once: true });
      return;
    }

    const boot = document.createElement("script");
    boot.textContent =
      "(function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function(){a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};a.queue=[];var s='script',r=t.createElement(s);r.async=!0;r.src=n;var u=t.getElementsByTagName(s)[0];u.parentNode.insertBefore(r,u);})(window,document,'https://sc-static.net/scevent.min.js');";
    boot.async = true;
    document.head.appendChild(boot);

    const deadline = window.setTimeout(() => resolve(), 8000);
    const check = window.setInterval(() => {
      if (w.snaptr) {
        window.clearInterval(check);
        window.clearTimeout(deadline);
        resolve();
      }
    }, 50);
    window.setTimeout(() => {
      window.clearInterval(check);
      window.clearTimeout(deadline);
      resolve();
    }, 8000);
  });
}

function num(p: unknown, fallback = 0): number {
  if (typeof p === "number" && !Number.isNaN(p)) return p;
  if (typeof p === "string" && p.trim() !== "") {
    const n = Number(p);
    return Number.isNaN(n) ? fallback : n;
  }
  return fallback;
}

function str(p: unknown): string {
  return typeof p === "string" ? p : p != null ? String(p) : "";
}

function compactParams(params: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== ""));
}

function mapLayaliToSnap(detail: { eventName: string; payload: Record<string, unknown> }): { event: string; params: Record<string, unknown> } | null {
  const { eventName, payload: p } = detail;
  const currency = str(p.currency) || "AED";

  if (eventName === "ViewContent") {
    const ids = (p.content_ids as string[] | undefined) ?? (p.sku ? [str(p.sku)] : []);
    return {
      event: "VIEW_CONTENT",
      params: compactParams({
        item_ids: ids.length ? ids : undefined,
        item_category: str(p.content_category) || "product",
        price: num(p.value, 0),
        currency,
        description: str(p.content_name) || undefined,
      }),
    };
  }

  if (eventName === "AddToCart") {
    const dedup = str(p.event_id) || str(p.eventId);
    const ids = (p.content_ids as string[] | undefined) ?? (p.sku ? [str(p.sku)] : []);
    return {
      event: "ADD_CART",
      params: compactParams({
        client_dedup_id: dedup || undefined,
        item_ids: ids.length ? ids : undefined,
        item_category: str(p.content_category) || "product",
        number_items: num(p.number_items, 1),
        price: num(p.value, 0),
        currency,
      }),
    };
  }

  if (eventName === "InitiateCheckout") {
    const dedup = str(p.event_id) || str(p.eventId);
    const ids = (p.content_ids as string[] | undefined) ?? [];
    return {
      event: "START_CHECKOUT",
      params: compactParams({
        client_dedup_id: dedup || undefined,
        item_ids: ids.length ? ids : undefined,
        item_category: str(p.content_category) || "product",
        number_items: num(p.number_items, 0),
        price: num(p.value, 0),
        currency,
      }),
    };
  }

  if (eventName === "Purchase") {
    const dedup = str(p.event_id) || str(p.eventId);
    const tx = str(p.transaction_id);
    if (!tx) return null;
    const ids = (p.content_ids as string[] | undefined) ?? [];
    return {
      event: "PURCHASE",
      params: compactParams({
        client_dedup_id: dedup || tx,
        transaction_id: tx,
        item_ids: ids.length ? ids : undefined,
        item_category: str(p.content_category) || "product",
        number_items: num(p.number_items, 0),
        price: num(p.value, 0),
        currency,
      }),
    };
  }

  return null;
}

export function AdPixelsClient() {
  const pathname = usePathname();
  const pixelId = process.env.NEXT_PUBLIC_SNAP_PIXEL_ID;
  const enabled = process.env.NEXT_PUBLIC_ENABLE_PIXELS === "true";
  const initedRef = useRef(false);

  async function ensureSnap(): Promise<void> {
    if (!pixelId) return;
    await loadSnapSdk();
    const snap = (window as Window & { snaptr?: (...args: unknown[]) => void }).snaptr;
    if (!snap) return;
    if (!initedRef.current) {
      snap("init", pixelId);
      initedRef.current = true;
    }
  }

  useEffect(() => {
    if (!enabled || !pixelId) return;
    let cancelled = false;
    void (async () => {
      await ensureSnap();
      if (cancelled) return;
      (window as Window & { snaptr?: (...args: unknown[]) => void }).snaptr?.("track", "PAGE_VIEW");
    })();
    return () => {
      cancelled = true;
    };
  }, [enabled, pixelId, pathname]);

  useEffect(() => {
    if (!enabled || !pixelId) return;

    const onTrack = (ev: Event) => {
      const ce = ev as CustomEvent<{ eventName: string; payload: Record<string, unknown> }>;
      if (!ce.detail?.eventName) return;
      const mapped = mapLayaliToSnap(ce.detail);
      if (!mapped) return;
      void ensureSnap().then(() => {
        (window as Window & { snaptr?: (...args: unknown[]) => void }).snaptr?.("track", mapped.event, mapped.params);
      });
    };

    window.addEventListener("layali:track", onTrack);
    return () => window.removeEventListener("layali:track", onTrack);
  }, [enabled, pixelId]);

  return null;
}
