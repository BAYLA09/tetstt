"use client";

import type { CartItem } from "@/lib/products";

type TrackingContext = {
  landing_page: string;
  source_url: string;
  utm: Record<string, string>;
  tracking: Record<string, string>;
};

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];

export function generateEventId(eventName: string) {
  const random = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  return `evt_${eventName}_${random}`;
}

export function getTrackingContext(): TrackingContext {
  if (typeof window === "undefined") {
    return { landing_page: "", source_url: "", utm: {}, tracking: {} };
  }

  const url = new URL(window.location.href);
  const landingPage = window.localStorage.getItem("layali_landing_page") || window.location.href;
  window.localStorage.setItem("layali_landing_page", landingPage);

  const utm: Record<string, string> = {};
  UTM_KEYS.forEach((key) => {
    const value = url.searchParams.get(key) || window.localStorage.getItem(`layali_${key}`) || "";
    if (value) {
      utm[key.replace("utm_", "")] = value;
      window.localStorage.setItem(`layali_${key}`, value);
    }
  });

  const trackingKeys = ["fbclid", "ttclid", "ScCid"];
  const tracking: Record<string, string> = {};
  const readCookie = (name: string) => {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const m = document.cookie.match(new RegExp(`(?:^|; )${escaped}=([^;]*)`));
    return m?.[1] ? decodeURIComponent(m[1]) : "";
  };
  const scid = readCookie("_scid");
  if (scid) {
    tracking.sc_cookie1 = scid;
  }
  trackingKeys.forEach((key) => {
    const storedKey = `layali_${key}`;
    const value = url.searchParams.get(key) || window.localStorage.getItem(storedKey) || "";
    if (value) {
      const normalizedKey = key === "ScCid" ? "sc_click_id" : key;
      tracking[normalizedKey] = value;
      window.localStorage.setItem(storedKey, value);
    }
  });

  return {
    landing_page: landingPage,
    source_url: window.location.href,
    utm,
    tracking,
  };
}

/** Body for POST /analytics/click — only when a paid click id exists (Meta / TikTok / Snap). */
export function buildAdClickBeaconBody():
  | {
      fbclid: string | null;
      ttclid: string | null;
      sc_click_id: string | null;
      landing_page: string;
      path: string;
    }
  | null {
  if (typeof window === "undefined") return null;
  const ctx = getTrackingContext();
  const fb = ctx.tracking.fbclid;
  const tt = ctx.tracking.ttclid;
  const sc = ctx.tracking.sc_click_id;
  if (!fb && !tt && !sc) return null;
  return {
    fbclid: fb ?? null,
    ttclid: tt ?? null,
    sc_click_id: sc ?? null,
    landing_page: ctx.landing_page,
    path: window.location.pathname || "/",
  };
}

export function trackEvent(eventName: string, payload: Record<string, unknown> = {}) {
  if (process.env.NEXT_PUBLIC_ENABLE_PIXELS !== "true") {
    return;
  }
  window.dispatchEvent(new CustomEvent("layali:track", { detail: { eventName, payload } }));
}

export function trackAddToCart(item: CartItem, eventId: string, currency = "AED") {
  trackEvent("AddToCart", {
    event_id: eventId,
    content_ids: [item.sku],
    value: item.price * item.quantity,
    currency,
  });
}
