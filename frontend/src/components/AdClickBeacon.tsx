"use client";

import { useEffect, useRef } from "react";
import { buildAdClickBeaconBody } from "@/lib/events";

const SESSION_KEY = "layali_ad_click_beacon_v1";

/**
 * Records one backend row per browser session when the landing URL (or stored params)
 * includes fbclid, ttclid, or Snap sc_click_id — used for admin conversion metrics.
 */
export function AdClickBeacon() {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    if (typeof window === "undefined") return;
    const path = window.location.pathname || "/";
    if (path.startsWith("/admin")) return;
    if (sessionStorage.getItem(SESSION_KEY)) return;

    const body = buildAdClickBeaconBody();
    if (!body) return;

    sent.current = true;
    const payload = JSON.stringify(body);

    const mark = () => {
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* ignore */
      }
    };

    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      const ok = navigator.sendBeacon("/api/analytics/click", blob);
      if (ok) mark();
      else {
        void fetch("/api/analytics/click", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        })
          .then(() => mark())
          .catch(() => {
            sent.current = false;
          });
      }
    } else {
      void fetch("/api/analytics/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      })
        .then(() => mark())
        .catch(() => {
          sent.current = false;
        });
    }
  }, []);

  return null;
}
