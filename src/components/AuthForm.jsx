import { ArrowIcon } from './Icons';

export default function AuthForm({
  mode = 'login',
  initialValues = { name: '', email: '', password: '' },
  onSubmit,
  loading = false,
  error = '',
}) {
  const isRegister = mode === 'register';

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      email: String(formData.get('email') || '').trim(),
      password: String(formData.get('password') || ''),
      ...(isRegister ? { name: String(formData.get('name') || '').trim() } : {}),
    };
    onSubmit?.(payload);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {isRegister ? (
        <div>
          <label htmlFor="name" className="label">
            Nama lengkap
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            minLength={2}
            defaultValue={initialValues.name}
            placeholder="Nama kamu"
            className="input"
          />
        </div>
      ) : null}

      <div>
        <label htmlFor="email" className="label">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={initialValues.email}
          placeholder="nama@email.com"
          className="input"
        />
      </div>

      <div>
        <label htmlFor="password" className="label">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete={isRegister ? 'new-password' : 'current-password'}
          required
          minLength={6}
          placeholder="Minimal 6 karakter"
          className="input"
        />
      </div>

      {error ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
        {loading ? 'Memproses...' : isRegister ? 'Daftar' : 'Masuk'} {!loading ? <ArrowIcon /> : null}
      </button>
    </form>
  );
}
