import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import AuthLayout from '../components/AuthLayout';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../services/api';

export default function Register() {
  const { register, isAuthenticated, initializing } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!initializing && isAuthenticated) {
    return <Navigate to={location.state?.from?.pathname || '/'} replace />;
  }

  async function handleSubmit(payload) {
    setLoading(true);
    setError('');
    try {
      await register(payload);
      navigate('/', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, 'Registrasi gagal. Coba lagi.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      eyebrow="Daftar"
      title="Mulai perjalanan belajarmu."
      description="Daftar untuk mengakses seluruh materi, favorit, dan riwayat belajar."
      footer={
        <>
          Sudah punya akun?{' '}
          <Link to="/login" className="font-bold text-ink underline underline-offset-4">
            Masuk di sini
          </Link>
        </>
      }
    >
      <AuthForm mode="register" onSubmit={handleSubmit} loading={loading} error={error} />
    </AuthLayout>
  );
}
