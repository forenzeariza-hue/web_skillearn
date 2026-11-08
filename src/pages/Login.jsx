import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import AuthLayout from '../components/AuthLayout';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../services/api';

export default function Login() {
  const { login, isAuthenticated, initializing } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectTo = location.state?.from?.pathname || '/';

  if (!initializing && isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  async function handleSubmit(payload) {
    setLoading(true);
    setError('');
    try {
      await login(payload);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, 'Login gagal. Periksa email dan password.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      eyebrow="Masuk"
      title="Selamat datang kembali."
      description="Lanjutkan belajar — akses materi, favorit, dan riwayat kamu."
      footer={
        <>
          Belum punya akun?{' '}
          <Link to="/register" className="font-bold text-ink underline underline-offset-4">
            Daftar sekarang
          </Link>
        </>
      }
    >
      <AuthForm mode="login" onSubmit={handleSubmit} loading={loading} error={error} />
    </AuthLayout>
  );
}
