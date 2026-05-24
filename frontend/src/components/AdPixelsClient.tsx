"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    snaptr?: (...args: unknown[]) => void;
  }
}

/** Snap base snippet: defines `snaptr` queue and loads `scevent.min.js`. */
function installSnapBase(): void {
  const w = window as Window & { snaptr?: (...args: unknown[]) => void };
  if (w.snaptr) return;
  (function (e: Window & { snaptr?: (...args: unknown[]) => void }, t: Document, n: string) {
    if (e.snaptr) return;
    const a = function (...args: unknown[]) {
      const fn = a as unknown as { handleRequest?: (...x: unknown[]) => void; queue: unknown[][] };
      if (fn.handleRequest) fn.handleRequest.apply(a, args);
      else fn.queue.push(args);
    } as unknown as ((...args: unknown[]) => void) & { queue: unknown[][]; handleRequest?: (...x: unknown[]) => void };
    a.queue = [];
    e.snaptr = a;
    const s = "script";
    const r = t.createElement(s);
    r.async = true;
    r.src = n;
    const u = t.getElementsByTagName(s)[0];
    u?.parentNode?.insertBefore(r, u);
  })(window, document, "https://sc-static.net/scevent.min.js");
}

function dedupFromPayload(payload: Record<string, unknown>): string | undefined {
  const id = payload.event_id ?? payload.eventId;
  return typeof id === "string" && id.length > 0 ? id : undefined;
}

function asNumber(v: unknown): number | undefined {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}

function contentIdsFromPayload(payload: Record<string, unknown>): string[] {
  const raw = payload.content_ids;
  if (Array.isArray(raw)) {
    return raw.filter((x): x is string => typeof x === "string" && x.length > 0);
  }
  if (typeof payload.sku === "string" && payload.sku.length > 0) return [payload.sku];
  return [];
}

function trackSnapRetail(eventName: string, payload: Record<string, unknown>) {
  const snap = window.snaptr;
  if (!snap) return;

  const currency = typeof payload.currency === "string" ? payload.currency : "AED";
  const itemIds = contentIdsFromPayload(payload);
  const price = asNumber(payload.value);
  const clientDedupId = dedupFromPayload(payload);

  if (eventName === "ViewContent") {
    snap("track", "VIEW_CONTENT", {
      ...(clientDedupId ? { client_dedup_id: clientDedupId } : {}),
      ...(itemIds.length ? { item_ids: itemIds } : {}),
      ...(typeof payload.content_name === "string" ? { description: payload.content_name } : {}),
      ...(price !== undefined ? { price } : {}),
      currency,
      ...(typeof payload.item_category === "string" ? { item_category: payload.item_category } : {}),
    });
    return;
  }

  if (eventName === "AddToCart") {
    const qty = asNumber(payload.number_items) ?? 1;
    snap("track", "ADD_CART", {
      ...(clientDedupId ? { client_dedup_id: clientDedupId } : {}),
      ...(itemIds.length ? { item_ids: itemIds } : {}),
      ...(price !== undefined ? { price } : {}),
      currency,
      number_items: qty,
    });
    return;
  }

  if (eventName === "InitiateCheckout") {
    const nItems = asNumber(payload.number_items);
    snap("track", "START_CHECKOUT", {
      ...(clientDedupId ? { client_dedup_id: clientDedupId } : {}),
      ...(itemIds.length ? { item_ids: itemIds } : {}),
      ...(price !== undefined ? { price } : {}),
      currency,
      ...(nItems !== undefined ? { number_items: nItems } : {}),
    });
    return;
  }

  if (eventName === "Purchase") {
    const tx = typeof payload.transaction_id === "string" ? payload.transaction_id : undefined;
    const nItems = asNumber(payload.number_items);
    snap("track", "PURCHASE", {
      ...(clientDedupId ? { client_dedup_id: clientDedupId } : {}),
      ...(tx ? { transaction_id: tx } : {}),
      ...(price !== undefined ? { price } : {}),
      currency,
      ...(itemIds.length ? { item_ids: itemIds } : {}),
      ...(nItems !== undefined ? { number_items: nItems } : {}),
    });
  }
}

/**
 * Loads the Snap Pixel when `NEXT_PUBLIC_SNAP_PIXEL_ID` is set and maps `layali:track`
 * (from `trackEvent`) to Snap standard events.
 */
export function AdPixelsClient() {
  const pathname = usePathname();
  const pathKey = pathname;

  const pixelId = process.env.NEXT_PUBLIC_SNAP_PIXEL_ID?.trim();
  const pixelsEnabled = process.env.NEXT_PUBLIC_ENABLE_PIXELS === "true";
  const [snapReady, setSnapReady] = useState(false);
  const routeKeyRef = useRef<string>("");

  useEffect(() => {
    if (!pixelsEnabled || !pixelId) return;

    installSnapBase();
    const scScript = [...document.getElementsByTagName("script")].find((s) => s.src.includes("sc-static.net/scevent.min.js")) as
      | HTMLScriptElement
      | undefined;
    if (!scScript) return;

    const boot = () => {
      const gate = window as unknown as { __layaliSnapDidBoot?: string };
      if (gate.__layaliSnapDidBoot === pixelId) return;
      gate.__layaliSnapDidBoot = pixelId;
      window.snaptr?.("init", pixelId);
      routeKeyRef.current = `${window.location.pathname}${window.location.search}`;
      window.snaptr?.("track", "PAGE_VIEW");
      setSnapReady(true);
    };

    scScript.addEventListener("load", boot, { once: true });
    if ((scScript as unknown as { complete?: boolean }).complete) {
      boot();
    }
  }, [pixelsEnabled, pixelId]);

  useEffect(() => {
    if (!pixelsEnabled || !pixelId || !snapReady) return;
    if (routeKeyRef.current === pathKey) return;
    routeKeyRef.current = pathKey;
    window.snaptr?.("track", "PAGE_VIEW");
  }, [pathKey, pixelsEnabled, pixelId, snapReady]);

  useEffect(() => {
    if (!pixelsEnabled || !pixelId) return;

    const handler = (ev: Event) => {
      const ce = ev as CustomEvent<{ eventName: string; payload: Record<string, unknown> }>;
      const name = ce.detail?.eventName;
      const payload = ce.detail?.payload ?? {};
      if (!name) return;
      if (name === "PageView") {
        window.snaptr?.("track", "PAGE_VIEW");
        return;
      }
      if (["ViewContent", "AddToCart", "InitiateCheckout", "Purchase"].includes(name)) {
        trackSnapRetail(name, payload);
      }
    };

    window.addEventListener("layali:track", handler as EventListener);
    return () => window.removeEventListener("layali:track", handler as EventListener);
  }, [pixelsEnabled, pixelId]);

  return null;
}
