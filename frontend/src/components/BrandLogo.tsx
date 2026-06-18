import { Great_Vibes } from "next/font/google";

const layaliWordmark = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const forestPanel =
  "relative isolate inline-flex shrink-0 overflow-hidden rounded-lg border border-[var(--border-gold)] bg-[linear-gradient(165deg,#0f2a1f_0%,#0a1f16_45%,#071812_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]";

const paperGrain =
  "pointer-events-none absolute inset-0 rounded-[inherit] opacity-[0.14] bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.03)_0_1px,transparent_1px_3px),repeating-linear-gradient(90deg,rgba(255,255,255,0.025)_0_1px,transparent_1px_4px)]";

const goldFoil =
  "bg-[linear-gradient(180deg,#fff2d2_0%,#ebc982_38%,#c99645_72%,#9a7030_100%)] bg-clip-text text-transparent drop-shadow-[0_1px_0_rgba(0,0,0,0.35)]";

export function BrandLogo({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <span className="inline-flex" dir="ltr" aria-label="Layali Beauty">
        <span className={`${forestPanel} size-11 items-center justify-center`}>
          <span className={paperGrain} aria-hidden />
          <span className="relative z-10 flex items-center gap-0.5 text-[0.6rem] text-[var(--gold-400)]">
            <span aria-hidden>✦</span>
            <span aria-hidden>✦</span>
            <span className="text-base leading-none" aria-hidden>
              ☾
            </span>
          </span>
        </span>
      </span>
    );
  }

  return (
    <span className="inline-flex" dir="ltr" aria-label="Layali Beauty">
      <span className={`${forestPanel} items-stretch px-4 py-2 pr-11`}>
        <span className={paperGrain} aria-hidden />
        <span
          className="pointer-events-none absolute right-2 top-2 z-10 flex items-start gap-0.5 text-[0.65rem] leading-none text-[var(--gold-400)] drop-shadow-[0_1px_1px_rgba(0,0,0,0.45)]"
          aria-hidden
        >
          <span>✦</span>
          <span className="-translate-y-px">✦</span>
          <span className="text-sm">☾</span>
        </span>
        <span className="relative z-10 min-w-0 text-left">
          <span
            className={`${layaliWordmark.className} block text-[2.35rem] leading-[0.95] sm:text-[2.65rem] ${goldFoil}`}
          >
            Layali
          </span>
          <span
            className={`mt-1 block pl-[2.15rem] font-[family-name:var(--font-inter)] text-[0.62rem] font-bold uppercase tracking-[0.42em] ${goldFoil}`}
          >
            beauty
          </span>
        </span>
      </span>
    </span>
  );
}
