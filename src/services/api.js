import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050/api';

export const TOKEN_KEY = 'skilllearn_token';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 20000,
});

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function getErrorMessage(error, fallback = 'Terjadi kesalahan. Coba lagi.') {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return error.code === 'ECONNABORTED'
        ? 'Permintaan melebihi batas waktu. Periksa koneksi Anda.'
        : 'Tidak dapat terhubung ke server. Pastikan API berjalan.';
    }
    return error.response.data?.message || fallback;
  }
  return error?.message || fallback;
}

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let unauthorizedHandler = null;

export function registerUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRoute = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/register');
    if (error.response?.status === 401 && !isAuthRoute) {
      setToken(null);
      if (unauthorizedHandler) unauthorizedHandler();
    }
    return Promise.reject(error);
  }
);

export default api;
