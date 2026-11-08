import api from './api';

export const authService = {
  register: (payload) => api.post('/auth/register', payload).then((res) => res.data.data),
  login: (payload) => api.post('/auth/login', payload).then((res) => res.data.data),
  me: () => api.get('/auth/me').then((res) => res.data.data.user),
};

export const materiService = {
  list: (params) => api.get('/materi', { params }).then((res) => res.data),
  detail: (id) => api.get(`/materi/${id}`).then((res) => res.data.data),
  categories: () => api.get('/materi/categories').then((res) => res.data.data),
  trending: () => api.get('/materi/trending').then((res) => res.data.data),
};

export const favoriteService = {
  list: () => api.get('/favorites').then((res) => res.data.data),
  add: (materiId) => api.post(`/favorites/${materiId}`).then((res) => res.data),
  remove: (materiId) => api.delete(`/favorites/${materiId}`).then((res) => res.data),
};

export const riwayatService = {
  list: () => api.get('/riwayat').then((res) => res.data.data),
  record: (materiId, payload = {}) => api.post(`/riwayat/${materiId}`, payload).then((res) => res.data.data),
};

export const kuisService = {
  get: (materiId) => api.get(`/kuis/${materiId}`).then((res) => res.data.data),
  submit: (materiId, answers) =>
    api.post(`/kuis/${materiId}/submit`, { answers }).then((res) => res.data.data),
  history: () => api.get('/kuis/history').then((res) => res.data.data),
};
