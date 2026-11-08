import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MateriCard from '../components/MateriCard';
import { EmptyState, ErrorState, Loading, PageHeader } from '../components/States';
import { favoriteService } from '../services';
import { getErrorMessage } from '../services/api';

function RemoveButton({ materiId, onRemoved }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function handleRemove() {
    setBusy(true);
    setError('');
    try {
      await favoriteService.remove(materiId);
      onRemoved(materiId);
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal menghapus favorit.'));
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-end">
      <button
        type="button"
        onClick={handleRemove}
        disabled={busy}
        className="rounded-full bg-neutral-100 px-3.5 py-1.5 text-xs font-bold text-ink transition hover:bg-red-50 hover:text-red-700 disabled:opacity-60"
      >
        {busy ? 'Menghapus...' : 'Hapus'}
      </button>
      {error ? <span className="mt-1 text-xs text-red-600">{error}</span> : null}
    </div>
  );
}

export default function Favorit() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadFavorites = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await favoriteService.list();
      setItems(data);
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal memuat daftar favorit.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  function handleRemoved(materiId) {
    setItems((prev) => prev.filter((item) => item.materi?._id !== materiId));
  }

  return (
    <section className="container-page pb-24">
      <PageHeader eyebrow="Favorit" title="Materi favorit" description="Materi yang kamu simpan untuk dipelajari kembali.">
        {!loading && items.length ? <span className="badge bg-brand-100 text-brand-800">{items.length} materi</span> : null}
      </PageHeader>

      <div className="border-t border-line pt-12">
        {loading ? (
          <Loading label="Memuat favorit..." />
        ) : error ? (
          <ErrorState message={error} onRetry={loadFavorites} />
        ) : items.length === 0 ? (
          <EmptyState
            title="Belum ada materi favorit"
            description="Buka materi lalu tekan tombol favorit untuk menyimpannya di sini."
            action={
              <Link to="/" className="btn-primary">
                Jelajahi materi
              </Link>
            }
          />
        ) : (
          <div className="grid gap-x-5 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {items
              .filter((item) => item.materi)
              .map((item) => (
                <MateriCard
                  key={item._id}
                  materi={item.materi}
                  footer={<RemoveButton materiId={item.materi._id} onRemoved={handleRemoved} />}
                />
              ))}
          </div>
        )}
      </div>
    </section>
  );
}
