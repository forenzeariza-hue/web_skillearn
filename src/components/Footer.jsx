import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-auto">
      <div className="container-page">
        <div className="hairline flex flex-col gap-8 py-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link to="/" className="text-[28px] font-medium tracking-tight text-ink">
              SkillLearn
            </Link>
            <p className="lead mt-2 max-w-md">
              Platform belajar keterampilan praktis: pemrograman, desain grafis, digital marketing, dan teknologi.
            </p>
          </div>
          <nav className="flex flex-wrap items-center gap-x-7 gap-y-2" aria-label="Navigasi footer">
            <Link to="/" className="text-sm font-bold text-ink hover:opacity-70">
              Home
            </Link>
            <Link to="/favorit" className="text-sm font-bold text-ink hover:opacity-70">
              Favorit
            </Link>
            <Link to="/riwayat" className="text-sm font-bold text-ink hover:opacity-70">
              Riwayat
            </Link>
            <Link to="/profil" className="text-sm font-bold text-ink hover:opacity-70">
              Profil
            </Link>
          </nav>
        </div>
        <p className="pb-10 text-sm text-muted">© SkillLearn. {new Date().getFullYear()} All Rights Reserved.</p>
      </div>
    </footer>
  );
}
