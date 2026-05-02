import Link from "next/link";

export function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="inline-flex items-center gap-3" aria-label="Layali Beauty">
      <span className="relative grid size-11 place-items-center rounded-full border border-[var(--border-gold)] bg-[var(--emerald-950)] text-[var(--gold-300)] shadow-[0_0_35px_rgba(201,150,69,0.22)]">
        <span className="absolute right-2 top-2 text-xs">✦</span>
        <span className="text-xl">☾</span>
      </span>
      {!compact && (
        <span className="leading-none">
          <span className="block font-serif text-3xl italic tracking-wide text-[var(--gold-300)]">
            Layali
          </span>
          <span className="block text-[0.62rem] font-bold tracking-[0.45em] text-[var(--gold-400)]">
            BEAUTY
          </span>
        </span>
      )}
    </Link>
  );
}
