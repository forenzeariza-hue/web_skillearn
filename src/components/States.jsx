// Komponen status bersama: Loading, EmptyState, ErrorState, PageHeader
export function Loading({ label = 'Memuat...', fullScreen = false }) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3 py-14" role="status" aria-live="polite">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-brand-600" />
      <span className="font-mono text-xs text-muted">{label}</span>
    </div>
  );
  if (fullScreen) return <div className="flex min-h-[60vh] items-center justify-center">{content}</div>;
  return content;
}

export function EmptyState({
  title = 'Belum ada data',
  description = 'Data akan muncul di sini setelah tersedia.',
  action = null,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl bg-neutral-50 px-6 py-16 text-center">
      <span className="mb-5 h-10 w-10 rounded-full bg-brand-100" aria-hidden="true" />
      <h3 className="font-serif text-3xl text-ink">{title}</h3>
      <p className="lead mt-2 max-w-sm">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

export function ErrorState({ message = 'Terjadi kesalahan.', onRetry = null }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-red-200 bg-red-50/60 px-6 py-14 text-center">
      <p className="font-mono text-xs text-red-700">Gagal memuat</p>
      <h3 className="mt-2 font-serif text-3xl text-ink">Ada yang tidak beres.</h3>
      <p className="mt-2 max-w-md text-[15px] text-red-700">{message}</p>
      {onRetry ? (
        <button type="button" onClick={onRetry} className="btn-outline mt-6">
          Coba lagi
        </button>
      ) : null}
    </div>
  );
}

export function PageHeader({ eyebrow, title, description, children }) {
  return (
    <header className="pb-10 pt-6 sm:pt-12">
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-3xl">
          <h1 className="heading">{title}</h1>
          {description ? <p className="lead mt-5">{description}</p> : null}
        </div>
        {children}
      </div>
    </header>
  );
}
