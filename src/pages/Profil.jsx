import { Link, useNavigate } from 'react-router-dom';
import { ArrowIcon } from '../components/Icons';
import { PageHeader } from '../components/States';
import { useAuth } from '../context/AuthContext';

function StatRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 border-t border-line py-5 text-[15px]">
      <span className="text-muted">{label}</span>
      <span className="truncate font-medium text-ink">{value}</span>
    </div>
  );
}

export default function Profil() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const initial = user?.name?.charAt(0)?.toUpperCase() || '?';

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <section className="container-page pb-24">
      <PageHeader eyebrow="Profil" title={`Halo, ${user?.name?.split(' ')[0] || 'pelajar'}.`} description="Informasi akun SkillLearn kamu." />

      <div className="grid gap-5 lg:grid-cols-[420px_minmax(0,1fr)]">
        <div className="relative flex min-h-[360px] flex-col justify-between overflow-hidden rounded-4xl bg-sage p-8 text-white">
          <span className="font-mono text-xs text-white/80">Akun aktif</span>
          <div>
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/25 font-serif text-5xl backdrop-blur">
              {initial}
            </div>
            <h2 className="mt-6 font-serif text-4xl">{user?.name}</h2>
            <p className="mt-1 text-[15px] text-white/80">{user?.email}</p>
          </div>
        </div>

        <div className="rounded-4xl bg-neutral-50 p-8">
          <p className="eyebrow">Detail akun</p>
          <div className="mt-6">
            <StatRow label="Nama" value={user?.name || '-'} />
            <StatRow label="Email" value={user?.email || '-'} />
            <StatRow label="ID pengguna" value={<span className="font-mono text-xs">{user?._id || '-'}</span>} />
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/riwayat" className="btn-secondary">
              Lihat riwayat <ArrowIcon />
            </Link>
            <button type="button" onClick={handleLogout} className="btn-outline">
              Keluar dari akun
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
