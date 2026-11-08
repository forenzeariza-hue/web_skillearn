import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { StarIcon } from '../components/Icons';
import { typeLabel } from '../components/MateriCard';
import QuizCard from '../components/QuizCard';
import { EmptyState, ErrorState, Loading } from '../components/States';
import VideoPlayer from '../components/VideoPlayer';
import { useAuth } from '../context/AuthContext';
import { favoriteService, materiService, riwayatService } from '../services';
import { getErrorMessage } from '../services/api';
import { formatDate, formatRelative } from '../utils/format';

function FavoriteButton({ materiId, isFavorite, onChange }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function handleClick() {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/materi/${materiId}` } } });
      return;
    }

    setBusy(true);
    setError('');
    try {
      if (isFavorite) {
        await favoriteService.remove(materiId);
        onChange(false);
      } else {
        await favoriteService.add(materiId);
        onChange(true);
      }
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal memperbarui favorit.'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={busy}
        aria-pressed={isFavorite}
        className={isFavorite ? 'btn-primary' : 'btn-secondary'}
      >
        <StarIcon filled={isFavorite} />
        {busy ? 'Menyimpan...' : isFavorite ? 'Tersimpan di favorit' : 'Tambah favorit'}
      </button>
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </div>
  );
}

function ContentBlock({ content }) {
  if (!content) return <p className="lead">Konten materi belum tersedia.</p>;

  return (
    <div className="space-y-5 text-[17px] leading-[1.75] text-ink/85">
      {content
        .split(/\n{2,}/)
        .filter((paragraph) => paragraph.trim())
        .map((paragraph, index) => (
          <p key={index}>{paragraph.trim()}</p>
        ))}
    </div>
  );
}

function SummaryRow({ label, value, capitalize = false }) {
  return (
    <div className="flex justify-between gap-3 border-t border-line py-4 text-[15px]">
      <dt className="text-muted">{label}</dt>
      <dd className={`text-right font-medium text-ink ${capitalize ? 'capitalize' : ''}`}>{value}</dd>
    </div>
  );
}

export default function Detail() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();

  const [materi, setMateri] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const recordedFor = useRef(null);

  const loadMateri = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await materiService.detail(id);
      setMateri(data);
      setIsFavorite(Boolean(data.isFavorite));
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal memuat materi.'));
      setMateri(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadMateri();
  }, [loadMateri]);

  // Catat riwayat otomatis sekali setiap materi dibuka oleh pengguna yang login.
  useEffect(() => {
    if (!isAuthenticated || !materi || recordedFor.current === materi._id) return;
    recordedFor.current = materi._id;
    riwayatService.record(materi._id, {}).catch(() => {
      recordedFor.current = null;
    });
  }, [isAuthenticated, materi]);

  if (loading) {
    return (
      <div className="container-page py-10">
        <Loading label="Memuat materi..." fullScreen />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-page py-10">
        <ErrorState message={error} onRetry={loadMateri} />
        <div className="mt-6 text-center">
          <Link to="/" className="btn-outline">
            ← Kembali ke home
          </Link>
        </div>
      </div>
    );
  }

  if (!materi) {
    return (
      <div className="container-page py-10">
        <EmptyState
          title="Materi tidak ditemukan"
          description="Materi mungkin sudah dihapus atau tautannya tidak valid."
          action={
            <Link to="/" className="btn-primary">
              Lihat semua materi
            </Link>
          }
        />
      </div>
    );
  }

  const hasVideo = Boolean(materi.videoUrl);

  return (
    <article className="container-page pb-24">
      <nav className="pt-6 font-mono text-xs text-muted sm:pt-10" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-ink">
          Home
        </Link>
        <span className="mx-2">›</span>
        <Link to={`/?category=${encodeURIComponent(materi.category)}`} className="text-brand-700 hover:text-ink">
          {materi.category}
        </Link>
        <span className="mx-2">›</span>
        <span className="text-ink">{typeLabel(materi.type)}</span>
      </nav>

      <header className="pb-12 pt-8">
        <h1 className="display max-w-5xl text-5xl sm:text-7xl lg:text-[88px]">{materi.title}</h1>
        <p className="lead mt-8 max-w-2xl text-[17px]">{materi.description}</p>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
          <p className="text-[15px] text-muted">
            Oleh <span className="font-bold text-ink">{materi.author}</span> · {formatDate(materi.createdAt)}
          </p>
          <FavoriteButton materiId={materi._id} isFavorite={isFavorite} onChange={setIsFavorite} />
        </div>
      </header>

      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-16">
        <div className="min-w-0">
          {hasVideo ? (
            <section className="mb-16">
              <p className="eyebrow mb-5">Video tutorial</p>
              <VideoPlayer url={materi.videoUrl} title={materi.title} />
            </section>
          ) : materi.thumbnail ? (
            <div className="mb-16 overflow-hidden rounded-4xl bg-sand">
              <img src={materi.thumbnail} alt="" className="aspect-[16/9] w-full object-cover" />
            </div>
          ) : null}

          <section className="mb-20">
            <p className="eyebrow mb-5">Materi</p>
            <ContentBlock content={materi.content} />
          </section>

          <section id="kuis" className="scroll-mt-24 border-t border-line pt-14">
            <p className="eyebrow">Kuis</p>
            <h2 className="mt-4 font-serif text-4xl text-ink sm:text-5xl">Uji pemahamanmu.</h2>
            <div className="mt-10">
              {isAuthenticated ? (
                <QuizCard materiId={materi._id} hasKuis={Boolean(materi.kuis)} />
              ) : (
                <EmptyState
                  title="Masuk untuk mengerjakan kuis"
                  description="Kuis dan pencatatan skor hanya tersedia untuk pengguna yang sudah login."
                  action={
                    <Link to="/login" state={{ from: { pathname: `/materi/${materi._id}` } }} className="btn-primary">
                      Masuk sekarang
                    </Link>
                  }
                />
              )}
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-4xl bg-neutral-50 p-7">
            <p className="eyebrow">Ringkasan</p>
            <dl className="mt-6">
              <SummaryRow label="Kategori" value={materi.category} />
              <SummaryRow label="Tipe" value={typeLabel(materi.type)} />
              <SummaryRow label="Level" value={materi.level} capitalize />
              <SummaryRow label="Durasi" value={materi.durationMinutes ? `${materi.durationMinutes} menit` : '-'} />
              <SummaryRow label="Kuis" value={materi.kuis ? `${materi.kuis.totalQuestions} soal` : 'Tidak ada'} />
              <SummaryRow label="Dibuat" value={formatRelative(materi.createdAt)} />
            </dl>
            {materi.kuis ? (
              <a href="#kuis" className="btn-primary mt-6 w-full">
                Kerjakan kuis
              </a>
            ) : null}
            <Link to="/" className="btn-outline mt-3 w-full">
              ← Kembali ke daftar
            </Link>
          </div>
        </aside>
      </div>
    </article>
  );
}
