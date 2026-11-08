import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowIcon } from '../components/Icons';
import { typeLabel } from '../components/MateriCard';
import { EmptyState, ErrorState, Loading, PageHeader } from '../components/States';
import { riwayatService } from '../services';
import { getErrorMessage } from '../services/api';
import { formatRelative } from '../utils/format';

function RiwayatRow({ item, index }) {
  const materi = item.materi;
  if (!materi) return null;

  const progress = Math.min(100, Math.max(0, item.progress || 0));

  return (
    <li className="grid items-center gap-5 border-t border-line py-6 sm:grid-cols-[48px_128px_minmax(0,1fr)_auto]">
      <span className="hidden font-bold text-muted sm:block">{String(index + 1).padStart(2, '0')}</span>
      <div className="aspect-[4/3] w-32 overflow-hidden rounded-2xl bg-sand/40">
        {materi.thumbnail ? <img src={materi.thumbnail} alt="" loading="lazy" className="h-full w-full object-cover" /> : null}
      </div>

      <div className="min-w-0">
        <p className="font-mono text-xs text-brand-700">
          {materi.category}
          <span className="text-muted">
            {' '}
            · {typeLabel(materi.type)} · Dibuka {formatRelative(item.lastAccessed)}
          </span>
        </p>
        <h3 className="mt-2 truncate font-serif text-2xl text-ink">
          <Link to={`/materi/${materi._id}`} className="hover:text-brand-700">
            {materi.title}
          </Link>
        </h3>
        <div className="mt-3 flex items-center gap-3">
          <div className="h-1 w-full max-w-xs overflow-hidden rounded-full bg-neutral-100">
            <div className={`h-full rounded-full ${item.completed ? 'bg-brand-600' : 'bg-sage'}`} style={{ width: `${progress}%` }} />
          </div>
          <span className="font-mono text-xs text-muted">{progress}%</span>
          {item.completed ? <span className="badge bg-brand-100 text-brand-800">Selesai</span> : null}
        </div>
      </div>

      <Link to={`/materi/${materi._id}`} className="btn-secondary shrink-0">
        Lanjut belajar <ArrowIcon />
      </Link>
    </li>
  );
}

export default function Riwayat() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadRiwayat = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await riwayatService.list();
      setItems(data);
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal memuat riwayat belajar.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRiwayat();
  }, [loadRiwayat]);

  const completedCount = items.filter((item) => item.completed).length;

  return (
    <section className="container-page pb-24">
      <PageHeader eyebrow="Riwayat" title="Riwayat belajar" description="Materi yang pernah kamu buka, terbaru di atas.">
        {!loading && items.length ? (
          <div className="flex gap-10">
            <div>
              <p className="text-[56px] leading-none text-neutral-400">{String(items.length).padStart(2, '0')}</p>
              <p className="mt-2 font-mono text-xs text-muted">dibuka</p>
            </div>
            <div>
              <p className="text-[56px] leading-none text-neutral-400">{String(completedCount).padStart(2, '0')}</p>
              <p className="mt-2 font-mono text-xs text-muted">selesai</p>
            </div>
          </div>
        ) : null}
      </PageHeader>

      {loading ? (
        <Loading label="Memuat riwayat..." />
      ) : error ? (
        <ErrorState message={error} onRetry={loadRiwayat} />
      ) : items.length === 0 ? (
        <div className="border-t border-line pt-12">
          <EmptyState
            title="Belum ada riwayat"
            description="Riwayat akan tercatat otomatis saat kamu membuka materi."
            action={
              <Link to="/" className="btn-primary">
                Mulai belajar
              </Link>
            }
          />
        </div>
      ) : (
        <ul className="border-b border-line">
          {items.map((item, index) => (
            <RiwayatRow key={item._id} item={item} index={index} />
          ))}
        </ul>
      )}
    </section>
  );
}
