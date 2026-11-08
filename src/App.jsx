import { Route, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Detail from './pages/Detail';
import Favorit from './pages/Favorit';
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Profil from './pages/Profil';
import Register from './pages/Register';
import Riwayat from './pages/Riwayat';

export default function App() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/materi/:id"
            element={
              <ProtectedRoute>
                <Detail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/favorit"
            element={
              <ProtectedRoute>
                <Favorit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/riwayat"
            element={
              <ProtectedRoute>
                <Riwayat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profil"
            element={
              <ProtectedRoute>
                <Profil />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
