# SkillLearn — Web (React + Vite)

Aplikasi web SkillLearn: daftar materi, detail + video + kuis, favorit, dan riwayat belajar. Dibangun dengan React 18, Vite, React Router, Axios, Tailwind CSS, dan Context API.

## Menjalankan Lokal

```bash
# 1. Backend harus berjalan lebih dulu
cd ../backend && npm install && npm run seed && npm run dev

# 2. Web
cd web
npm install
cp .env.example .env      # default: http://localhost:5050/api
npm run dev               # http://localhost:5173
```

`VITE_API_URL` menunjuk ke base URL API (termasuk `/api`). Ganti nilainya saat backend di-deploy ke Vercel.

## Perintah

| Perintah | Keterangan |
|----------|-----------|
| `npm run dev` | Dev server Vite (port 5173) |
| `npm run build` | Build produksi ke `dist/` |
| `npm run preview` | Preview hasil build |

## Struktur

```
web/
├── index.html
├── vercel.json                 # SPA rewrite ke index.html
├── vite.config.js
├── tailwind.config.js
└── src/
    ├── main.jsx                # entry + BrowserRouter + AuthProvider
    ├── App.jsx                 # definisi route
    ├── index.css               # Tailwind + class komponen (.btn, .card, .input)
    ├── assets/
    ├── components/             # Navbar, Footer, MateriCard, CategoryFilter,
    │                           # SearchBar, AuthForm, VideoPlayer, QuizCard,
    │                           # ProtectedRoute, Loading, EmptyState, ErrorState
    ├── context/AuthContext.jsx # state login, bootstrap token, logout
    ├── pages/                  # Register, Login, Home, Detail, Favorit,
    │                           # Riwayat, Profil, NotFound
    ├── services/               # api.js (axios + interceptor), index.js (service)
    └── utils/format.js         # embed YouTube, format tanggal
```

## Halaman

| Route | Akses | Isi |
|-------|-------|-----|
| `/` | publik | Daftar materi: filter kategori, filter tipe, pencarian, pagination |
| `/register` | publik | Form registrasi (nama, email, password) |
| `/login` | publik | Form login |
| `/materi/:id` | login | Konten, video embed, kuis, toggle favorit, riwayat otomatis |
| `/favorit` | login | Daftar materi favorit + hapus |
| `/riwayat` | login | Riwayat belajar + progres |
| `/profil` | login | Detail akun + logout |

## Autentikasi

- JWT disimpan di `localStorage` (key `skilllearn_token`).
- Axios request interceptor menambahkan `Authorization: Bearer <token>`.
- Response interceptor 401 menghapus token dan mengarahkan ke `/login` (auto-logout).
- Route yang butuh login dibungkus `ProtectedRoute`; user diarahkan ke `/login` lalu kembali ke halaman asal.

## Deploy ke Vercel

1. Import folder `web` sebagai project Vercel (root directory = `web`).
2. Set environment variable `VITE_API_URL` ke URL API produksi (mis. `https://api-anda.vercel.app/api`).
3. Build command `npm run build`, output `dist`. `vercel.json` sudah menangani SPA rewrite.
