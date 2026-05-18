"use client";

import Image from "next/image";

export function PremiumPlaceholder({
  alt,
  caption,
  className = "",
}: {
  alt: string;
  caption?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative grid aspect-[4/5] w-full place-items-center overflow-hidden rounded-[2rem] border-2 border-dashed bg-[var(--lp-bg)] p-6 text-center shadow-inner ${className}`}
      style={{ borderColor: "var(--lp-accent)", backgroundImage: "linear-gradient(145deg, rgba(1,63,42,0.06), rgba(217,173,99,0.12))" }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(217,173,99,0.35),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(1,63,42,0.18),transparent_38%)]" />
      <div className="relative z-[1] max-w-xs space-y-2">
        <p className="text-xs font-black tracking-[0.25em] text-[var(--lp-primary)]">PLACEHOLDER</p>
        <p className="text-lg font-black leading-snug text-[var(--lp-text)]">{caption ?? alt}</p>
        <p className="text-xs font-semibold leading-6 text-[var(--lp-muted)]">صورة قريباً — التصميم جاهز بدون أيقونة صورة مكسورة.</p>
      </div>
    </div>
  );
}

export function PremiumImage({
  src,
  alt,
  className = "",
  priority,
  objectFit = "cover",
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  /** `contain` keeps wide marketing composites (before/after) uncropped inside the frame. */
  objectFit?: "cover" | "contain";
}) {
  if (!src?.trim()) {
    return <PremiumPlaceholder alt={alt} />;
  }
  const fitClass = objectFit === "contain" ? "object-contain" : "object-cover";
  /** Local raster assets under `/public/merchant/` or `/public/products/` — plain `<img>` avoids Next/Image optimizer blank frames on large PNG/JPEG. */
  const useNativeImg =
    src.startsWith("/merchant/") || /^\/products\/[^/]+\.(png|jpg|jpeg|webp)$/i.test(src);
  if (useNativeImg) {
    return (
      <div className={`relative w-full overflow-hidden rounded-[2rem] bg-[var(--lp-bg)] ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element -- static /public raster assets */}
        <img
          src={src}
          alt={alt}
          className={`block h-auto w-full ${fitClass}`}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
        />
      </div>
    );
  }
  return (
    <div className={`relative w-full overflow-hidden rounded-[2rem] bg-[var(--lp-card)] ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={1500}
        className={`h-auto w-full ${fitClass}`}
        priority={priority}
        sizes="100vw"
      />
    </div>
  );
}
