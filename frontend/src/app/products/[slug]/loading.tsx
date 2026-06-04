/** Instant shell while ProductLandingView JS loads — ad links feel responsive. */
export default function ProductLoading() {
  return (
    <div
      className="min-h-[70vh] animate-pulse bg-[#fffaf2]"
      aria-busy="true"
      aria-label="جاري تحميل صفحة المنتج"
    >
      <div className="mx-auto max-w-lg px-4 pt-4">
        <div className="aspect-[3/4] w-full rounded-2xl bg-[#f0e6d8]" />
        <div className="mt-6 h-8 w-3/4 rounded-lg bg-[#f0e6d8]" />
        <div className="mt-3 h-4 w-full rounded bg-[#f0e6d8]" />
        <div className="mt-2 h-4 w-5/6 rounded bg-[#f0e6d8]" />
      </div>
    </div>
  );
}
