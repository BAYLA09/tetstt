"use client";

import { useEffect } from "react";

export function PixelBoot() {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_ENABLE_PIXELS !== "true") return;
    const enabled = [process.env.NEXT_PUBLIC_META_PIXEL_ID, process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID, process.env.NEXT_PUBLIC_SNAP_PIXEL_ID].filter(Boolean);
    if (!enabled.length) return;
    window.setTimeout(() => console.info("Layali pixels deferred", enabled.length), 1200);
  }, []);
  return null;
}
