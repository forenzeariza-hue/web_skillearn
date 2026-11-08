import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import CategoryFilter from '../components/CategoryFilter';
import { ArrowIcon, TYPE_ICONS } from '../components/Icons';
import MateriCard from '../components/MateriCard';
import SearchBar from '../components/SearchBar';
import { EmptyState, ErrorState } from '../components/States';
import { useAuth } from '../context/AuthContext';
import { materiService } from '../services';
import { getErrorMessage } from '../services/api';

const PAGE_SIZE = 9;

const TYPE_FEATURES = [
  { type: 'artikel', title: 'Artikel Ringkas', text: 'Materi tertulis yang padat dan langsung ke inti, cocok dibaca di sela waktu kuliah.' },
  { type: 'video', title: 'Video Tutorial', text: 'Belajar sambil melihat praktik langsung lewat video yang bisa diputar ulang kapan saja.' },
  { type: 'kuis', title: 'Kuis Interaktif', text: 'Uji pemahamanmu. Skor dihitung otomatis dan tersimpan di riwayat belajarmu.' },
  { type: 'latihan', title: 'Latihan Praktik', text: 'Tugas kecil yang bisa langsung dikerjakan untuk mengasah keterampilan nyata.' },
];

const STEPS = [
  { title: 'Buat Akun', text: 'Daftar dalam hitungan detik, lalu langsung masuk.' },
  { title: 'Pilih Materi', text: 'Cari berdasarkan kategori, tipe, atau kata kunci yang kamu butuhkan.' },
  { title: 'Kerjakan Kuis', text: 'Ukur pemahamanmu dan pantau progres di halaman riwayat.' },
];

function scrollToCatalog() {
  document.getElementById('daftar-materi')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Pola garis vertikal ala template — dekoratif, tingginya diambil dari jumlah materi
function DataLines({ categories }) {
  const values = categories.length
    ? categories.flatMap((cat, i) => [cat.total + 2, cat.total + i + 3, cat.total + 1, cat.total + i + 5])
    : [3, 5, 4, 6, 5, 7, 6, 8];
  const max = Math.max(...values);
  return (
    <div className="absolute inset-x-10 bottom-0 hidden h-[48%] items-end justify-between sm:flex">
      {values.map((value, index) => {
        const height = 30 + (value / max) * 60;
        const offset = (index * 37) % 30;
        return (
          <span key={index} className="relative block w-px bg-white/80" style={{ height: `${height - offset}%`, marginBottom: `${offset}%` }}>
            <span className="absolute -left-[3px] -top-[3px] h-[7px] w-[7px] rounded-[2px] bg-white" />
            <span className="absolute -bottom-[3px] -left-[3px] h-[7px] w-[7px] rounded-[2px] bg-white" />
          </span>
        );
      })}
    </div>
  );
}

function HeroShowcase({ featured, total, categories }) {
  return (
    <div className="relative mt-14 sm:mt-20">
      <div className="absolute inset-x-0 bottom-0 h-[62%] rounded-4xl bg-sage" aria-hidden="true" />
      <div className="relative mx-auto w-[92%] max-w-[906px] rounded-t-[30px] bg-ink px-2.5 pt-2.5 sm:px-4 sm:pt-4">
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-[20px] bg-sage sm:aspect-[16/10]">
          {featured?.thumbnail ? (
            <img src={featured.thumbnail} alt="" className="absolute inset-0 h-full w-full object-cover" />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/15 to-black/30" />

          <div className="absolute inset-x-6 top-6 text-white sm:inset-x-10 sm:top-9">
            <p className="font-mono text-[10px] text-white/70 sm:text-xs">
              Materi <span className="mx-1">›</span> <span className="text-white">Ringkasan</span>
            </p>
            <div className="mt-4 flex flex-wrap items-end justify-between gap-3 sm:mt-6">
              <p className="flex items-baseline gap-3 font-serif sm:gap-5">
                <span className="text-5xl leading-none sm:text-7xl">{total ?? '–'}</span>
                <span className="text-lg sm:text-3xl">Materi siap dipelajari</span>
              </p>
              <button
                type="button"
                onClick={scrollToCatalog}
                className="hidden rounded-full border border-white/30 bg-white/20 px-4 py-2 text-xs text-white backdrop-blur sm:inline-flex"
              >
                Semua kategori ({categories.length || 0}) ▾
              </button>
            </div>
            <div className="mt-4 hidden justify-between border-t border-white/40 pt-3 font-mono text-[10px] text-white/90 sm:flex">
              {(categories.length ? categories : [{ name: '' }]).map((cat) => (
                <span key={cat.name}>{cat.name}</span>
              ))}
            </div>
          </div>

          <DataLines categories={categories} />

          {featured ? (
            <Link
              to={`/materi/${featured._id}`}
              className="absolute bottom-4 left-4 right-4 hidden items-center justify-between gap-3 rounded-2xl border border-white/30 bg-white/20 px-4 py-3 text-white backdrop-blur-md sm:bottom-6 sm:left-auto sm:right-6 sm:flex sm:max-w-xs"
            >
              <span className="min-w-0">
                <span className="block font-mono text-[10px] text-white/70">Sorotan</span>
                <span className="block truncate font-serif text-lg">{featured.title}</span>
              </span>
              <ArrowIcon className="h-3 w-3 shrink-0" />
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Pagination({ meta, onPageChange }) {
  if (!meta || meta.totalPages <= 1) return null;

  const pages = Array.from({ length: meta.totalPages }, (_, index) => index + 1);
  const visible = pages.filter((page) => page === 1 || page === meta.totalPages || Math.abs(page - meta.page) <= 1);

  return (
    <nav className="mt-14 flex flex-wrap items-center justify-center gap-2" aria-label="Navigasi halaman">
      <button type="button" onClick={() => onPageChange(meta.page - 1)} disabled={meta.page <= 1} className="btn-outline">
        ← Sebelumnya
      </button>
      {visible.map((page, index) => {
        const previous = visible[index - 1];
        const showGap = previous && page - previous > 1;
        return (
          <span key={page} className="flex items-center gap-2">
            {showGap ? <span className="px-1 text-muted">…</span> : null}
            <button
              type="button"
              onClick={() => onPageChange(page)}
              aria-current={page === meta.page ? 'page' : undefined}
              className={`h-11 w-11 rounded-full font-mono text-sm transition ${
                page === meta.page ? 'bg-ink text-white' : 'bg-neutral-100 text-ink hover:bg-brand-100'
              }`}
            >
              {String(page).padStart(2, '0')}
            </button>
          </span>
        );
      })}
      <button type="button" onClick={() => onPageChange(meta.page + 1)} disabled={!meta.hasNextPage} className="btn-outline">
        Berikutnya →
      </button>
    </nav>
  );
}

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get('category') || '';
  const type = searchParams.get('type') || '';
  const search = searchParams.get('search') || '';
  const page = Number(searchParams.get('page')) || 1;

  const [materi, setMateri] = useState([]);
  const [meta, setMeta] = useState(null);
  const [categories, setCategories] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [highlightsMode, setHighlightsMode] = useState('trending');
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoadingCategories(true);
    materiService
      .categories()
      .then((data) => active && setCategories(data))
      .catch(() => active && setCategories([]))
      .finally(() => active && setLoadingCategories(false));
    return () => {
      active = false;
    };
  }, []);

  // Sorotan: hanya materi yang benar-benar punya riwayat belajar (tanpa padding),
  // sehingga materi yang belum pernah dipelajari tidak ikut muncul.
  // Jika belum ada satu pun materi dipelajari, ubah menjadi rekomendasi.
  useEffect(() => {
    let active = true;

    async function loadHighlights() {
      try {
        const rows = await materiService.trending();
        const studied = rows.map((row) => row.materi).filter(Boolean).slice(0, 5);

        if (studied.length > 0) {
          if (active) {
            setHighlights(studied);
            setHighlightsMode('trending');
          }
          return;
        }

        const latest = await materiService.list({ limit: 5 });
        if (active) {
          setHighlights(latest.data || []);
          setHighlightsMode('recommendation');
        }
      } catch {
        if (active) {
          setHighlights([]);
          setHighlightsMode('recommendation');
        }
      }
    }

    loadHighlights();
    return () => {
      active = false;
    };
  }, []);

  const fetchMateri = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await materiService.list({
        page,
        limit: PAGE_SIZE,
        ...(category ? { category } : {}),
        ...(type ? { type } : {}),
        ...(search ? { search } : {}),
      });
      setMateri(response.data);
      setMeta(response.meta);
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal memuat daftar materi.'));
      setMateri([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  }, [page, category, type, search]);

  useEffect(() => {
    fetchMateri();
  }, [fetchMateri]);

  const updateParams = useCallback(
    (changes) => {
      const next = new URLSearchParams(searchParams);
      Object.entries(changes).forEach(([key, value]) => {
        if (value) next.set(key, String(value));
        else next.delete(key);
      });
      if (!('page' in changes)) next.delete('page');
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  const activeFilters = useMemo(() => [category, type, search].filter(Boolean).length, [category, type, search]);
  const totalAll = useMemo(() => categories.reduce((sum, cat) => sum + (cat.total || 0), 0) || meta?.total, [categories, meta]);
  const hasResults = materi.length > 0;
  const featured = highlights[0];

  function filterAndScroll(changes) {
    updateParams(changes);
    scrollToCatalog();
  }

  return (
    <>
      {/* HERO */}
      <section className="container-page pt-6 sm:pt-10">
        <h1 className="display text-center text-[64px] sm:text-[112px] lg:text-[160px]">Belajar apa saja.</h1>
        <p className="lead mx-auto mt-6 max-w-xl text-center">
          Pemrograman, desain grafis, digital marketing, dan teknologi — dalam bentuk artikel, video tutorial, kuis, dan
          latihan praktik.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {isAuthenticated ? (
            <button type="button" onClick={scrollToCatalog} className="btn-primary">
              Mulai belajar <ArrowIcon />
            </button>
          ) : (
            <>
              <Link to="/register" className="btn-primary">
                Daftar <ArrowIcon />
              </Link>
              <Link to="/login" className="btn-secondary">
                Sudah punya akun
              </Link>
            </>
          )}
        </div>
        <HeroShowcase featured={featured} total={totalAll} categories={categories} />
      </section>

      {/* STRIP KATEGORI (pengganti "Trusted by") */}
      <section className="container-page">
        <div className="flex flex-col gap-6 border-b border-line py-12 lg:flex-row lg:items-center">
          <p className="shrink-0 text-[15px] text-muted lg:w-40">Kategori:</p>
          <div className="grid flex-1 grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
            {categories.map((cat) => (
              <button
                key={cat.name}
                type="button"
                onClick={() => filterAndScroll({ category: cat.name })}
                className="group text-left sm:text-center"
              >
                <span className="text-xl font-medium text-neutral-400 transition group-hover:text-ink sm:text-2xl">{cat.name}</span>
                <span className="ml-2 font-mono text-xs text-neutral-400">{cat.total}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* KEUNGGULAN (pengganti "Benefits") */}
      <section className="container-page py-20 sm:py-24">
        <p className="eyebrow">Keunggulan</p>
        <h2 className="heading mt-10">Belajar tanpa ribet.</h2>
        <p className="lead mt-8">SkillLearn menyajikan keterampilan praktis, tanpa teori yang berlebihan.</p>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TYPE_FEATURES.map((feature) => {
            const Icon = TYPE_ICONS[feature.type];
            return (
              <button
                key={feature.type}
                type="button"
                onClick={() => filterAndScroll({ type: feature.type })}
                className="group flex flex-col items-start justify-start border-t border-line pt-10 text-left"
              >
                <Icon className="h-6 w-6 text-ink" />
                <h3 className="mt-6 font-serif text-[22px] text-ink group-hover:text-brand-700">{feature.title}</h3>
                <p className="lead mt-4 pr-6">{feature.text}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* SOROTAN (pengganti "See the Big Picture") */}
      {highlights.length ? (
        <section className="container-page pb-20 sm:pb-28">
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="border-t border-line pt-14">
              <h2 className="heading">
                {highlightsMode === 'trending' ? 'Paling sering dipelajari' : 'Mungkin kamu tertarik'}
              </h2>
              <p className="lead mt-8 max-w-lg">
                {highlightsMode === 'trending'
                  ? 'Materi yang paling banyak dibuka pelajar lain. Mulai dari sini jika kamu bingung memilih.'
                  : 'Belum ada materi yang dipelajari. Beberapa materi pilihan ini bisa jadi titik awal yang baik.'}
              </p>
              <ol className="mt-12">
                {highlights.map((item, index) => (
                  <li key={item._id} className="border-t border-line">
                    <Link to={`/materi/${item._id}`} className="group flex gap-8 py-5 text-[15px] text-ink">
                      <span className="w-6 shrink-0 font-bold text-muted">{String(index + 1).padStart(2, '0')}</span>
                      <span className="flex-1 group-hover:text-brand-700">
                        {item.title}
                        <span className="text-muted">: {item.category}</span>
                      </span>
                      <ArrowIcon className="mt-1.5 h-2.5 w-2.5 opacity-0 transition group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ol>
              <button type="button" onClick={scrollToCatalog} className="btn-secondary mt-10">
                Lihat semua materi
              </button>
            </div>
            <Link to={featured ? `/materi/${featured._id}` : '/'} className="group relative min-h-[360px] overflow-hidden rounded-4xl bg-sand">
              {featured?.thumbnail ? (
                <img src={featured.thumbnail} alt={featured.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
              ) : null}
            </Link>
          </div>
        </section>
      ) : null}

      {/* KATALOG (pengganti "Specs") */}
      <section id="daftar-materi" className="container-page scroll-mt-24">
        <div className="border-t border-line pt-20 text-center sm:pt-24">
          <p className="eyebrow">Katalog</p>
          <h2 className="heading mt-8">Daftar materi</h2>
          <p className="lead mt-6">
            {meta ? `${meta.total} materi ditemukan` : 'Menampilkan materi'}
            {activeFilters > 0 ? ` · ${activeFilters} filter aktif` : ''}
            {activeFilters > 0 ? (
              <>
                {' · '}
                <button type="button" onClick={() => setSearchParams({}, { replace: true })} className="font-bold text-ink underline underline-offset-4">
                  Reset filter
                </button>
              </>
            ) : null}
          </p>
        </div>

        <div className="mx-auto mt-12 flex max-w-4xl flex-col gap-5">
          <SearchBar
            value={search}
            type={type}
            onSearch={(value) => updateParams({ search: value })}
            onTypeChange={(value) => updateParams({ type: value })}
          />
          <div className="flex justify-center">
            <CategoryFilter
              categories={categories}
              active={category}
              loading={loadingCategories}
              onChange={(value) => updateParams({ category: value })}
            />
          </div>
        </div>

        <div className="mt-14">
          {loading ? (
            <div className="grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index}>
                  <div className="aspect-[4/3] animate-pulse rounded-3xl bg-neutral-100" />
                  <div className="mt-5 h-3 w-32 animate-pulse rounded bg-neutral-100" />
                  <div className="mt-3 h-6 w-full animate-pulse rounded bg-neutral-100" />
                  <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-neutral-100" />
                </div>
              ))}
            </div>
          ) : error ? (
            <ErrorState message={error} onRetry={fetchMateri} />
          ) : !hasResults ? (
            <EmptyState
              title="Materi tidak ditemukan"
              description="Coba kata kunci lain atau reset filter untuk melihat semua materi."
              action={
                <button type="button" onClick={() => setSearchParams({}, { replace: true })} className="btn-secondary">
                  Reset filter
                </button>
              }
            />
          ) : (
            <>
              <div className="grid gap-x-5 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                {materi.map((item) => (
                  <MateriCard key={item._id} materi={item} />
                ))}
              </div>
              <Pagination meta={meta} onPageChange={(nextPage) => updateParams({ page: nextPage })} />
            </>
          )}
        </div>
      </section>

      {/* CARA MULAI (pengganti "Map Your Success") */}
      <section className="container-page py-24 sm:py-32">
        <p className="eyebrow">Cara mulai</p>
        <h2 className="heading mt-8">Tiga langkah untuk mulai.</h2>
        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <div key={step.title} className="border-t border-line pt-12">
              <p className="text-[64px] leading-none text-neutral-400 sm:text-[80px]">{String(index + 1).padStart(2, '0')}</p>
              <h3 className="mt-14 font-serif text-[22px] text-ink">{step.title}</h3>
              <p className="lead mt-4">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA (pengganti "Connect with us") */}
      <section className="container-page">
        <div className="border-t border-line py-24 text-center sm:py-28">
          <h2 className="heading">Mulai belajar hari ini</h2>
          <p className="lead mx-auto mt-8 max-w-xl">
            Pilih satu materi, selesaikan kuisnya, dan lihat progresmu bertambah di halaman riwayat.
          </p>
          {isAuthenticated ? (
            <button type="button" onClick={scrollToCatalog} className="btn-primary mx-auto mt-10 flex w-full max-w-[760px]">
              Jelajahi materi <ArrowIcon />
            </button>
          ) : (
            <Link to="/register" className="btn-primary mx-auto mt-10 flex w-full max-w-[760px]">
              Daftar <ArrowIcon />
            </Link>
          )}
        </div>
      </section>
    </>
  );
}
