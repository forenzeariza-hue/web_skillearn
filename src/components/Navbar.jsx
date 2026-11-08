import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowIcon } from './Icons';

const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/favorit', label: 'Favorit', protected: true },
  { to: '/riwayat', label: 'Riwayat', protected: true },
  { to: '/profil', label: 'Profil', protected: true },
];

function NavItem({ to, label, end, onClick, mobile = false }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        mobile
          ? `rounded-2xl px-4 py-3 font-serif text-2xl transition ${
              isActive ? 'bg-brand-100 text-ink' : 'text-ink hover:bg-neutral-100'
            }`
          : `relative px-3 py-1 text-sm font-bold text-ink transition hover:opacity-70 ${
              isActive ? 'after:absolute after:inset-x-3 after:-bottom-0.5 after:h-px after:bg-ink' : ''
            }`
      }
    >
      {label}
    </NavLink>
  );
}

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  const visibleLinks = NAV_LINKS.filter((link) => !link.protected || isAuthenticated);
  const fade = scrolled ? 'md:pointer-events-none md:opacity-0' : '';

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur md:bg-transparent md:backdrop-blur-none' : 'bg-white'
      }`}
    >
      <div className="container-page relative flex h-[88px] items-center justify-between gap-4">
        <Link to="/" className={`text-[28px] font-medium tracking-tight text-ink transition-opacity duration-300 ${fade}`}>
          SkillLearn
        </Link>

        {/* Navigasi tengah — berubah jadi pill kaca saat halaman di-scroll, seperti template */}
        <nav
          aria-label="Navigasi utama"
          className={`absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full px-5 py-4 transition-all duration-300 md:flex ${
            scrolled ? 'border border-white/60 bg-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl' : ''
          }`}
        >
          {visibleLinks.map((link) => (
            <NavItem key={link.to} {...link} />
          ))}
        </nav>

        <div className={`hidden items-center gap-3 transition-opacity duration-300 md:flex ${fade}`}>
          {isAuthenticated ? (
            <>
              <span className="max-w-[160px] truncate text-sm text-muted" title={user?.email}>
                {user?.name}
              </span>
              <button type="button" onClick={handleLogout} className="btn-primary">
                Keluar <ArrowIcon />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">
                Masuk
              </Link>
              <Link to="/register" className="btn-primary">
                Daftar <ArrowIcon />
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label="Buka menu navigasi"
        >
          <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" aria-hidden="true">
            {open ? (
              <path d="M5 5l10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            ) : (
              <path d="M3 7h14M3 13h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open ? (
        <div id="mobile-menu" className="border-t border-line bg-white md:hidden">
          <nav className="container-page flex flex-col gap-1 py-4" aria-label="Navigasi mobile">
            {visibleLinks.map((link) => (
              <NavItem key={link.to} {...link} mobile onClick={() => setOpen(false)} />
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-line pt-4">
              {isAuthenticated ? (
                <>
                  <span className="px-4 text-sm text-muted">{user?.name}</span>
                  <button type="button" onClick={handleLogout} className="btn-primary">
                    Keluar
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn-outline" onClick={() => setOpen(false)}>
                    Masuk
                  </Link>
                  <Link to="/register" className="btn-primary" onClick={() => setOpen(false)}>
                    Daftar
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
