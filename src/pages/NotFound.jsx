import { Link } from 'react-router-dom';
import { ArrowIcon } from '../components/Icons';

export default function NotFound() {
  return (
    <section className="container-page flex min-h-[65vh] flex-col items-center justify-center py-16 text-center">
      <p className="eyebrow">404</p>
      <h1 className="display mt-8 text-[72px] sm:text-[128px]">Tersesat.</h1>
      <p className="lead mt-6 max-w-md">Tautan yang kamu buka mungkin salah atau halaman sudah dipindahkan.</p>
      <Link to="/" className="btn-primary mt-10">
        Kembali ke home <ArrowIcon />
      </Link>
    </section>
  );
}
