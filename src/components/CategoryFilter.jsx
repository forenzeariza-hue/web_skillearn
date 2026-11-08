const ALL = { name: 'Semua', total: null };

export default function CategoryFilter({ categories = [], active = '', onChange, loading = false }) {
  const items = [ALL, ...categories];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter kategori">
      {loading
        ? Array.from({ length: 5 }).map((_, index) => (
            <span key={index} className="h-10 w-28 shrink-0 animate-pulse rounded-full bg-neutral-100" />
          ))
        : items.map((item) => {
            const isActive = (item.name === 'Semua' && !active) || active === item.name;
            return (
              <button
                key={item.name}
                type="button"
                onClick={() => onChange?.(item.name === 'Semua' ? '' : item.name)}
                aria-pressed={isActive}
                className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-bold transition ${
                  isActive ? 'bg-ink text-white' : 'bg-neutral-100 text-ink hover:bg-brand-100'
                }`}
              >
                {item.name}
                {typeof item.total === 'number' ? (
                  <span className={`ml-2 font-mono text-[11px] font-normal ${isActive ? 'text-white/60' : 'text-muted'}`}>
                    {item.total}
                  </span>
                ) : null}
              </button>
            );
          })}
    </div>
  );
}
