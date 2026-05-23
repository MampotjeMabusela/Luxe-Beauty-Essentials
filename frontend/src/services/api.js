import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('luxe_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 403 && !original._retry) {
      const refresh = localStorage.getItem('luxe_refresh');
      if (refresh) {
        original._retry = true;
        try {
          const { data } = await axios.post(`${API_BASE}/auth/refresh-token`, {
            refreshToken: refresh,
          });
          localStorage.setItem('luxe_token', data.token);
          localStorage.setItem('luxe_refresh', data.refreshToken);
          original.headers.Authorization = `Bearer ${data.token}`;
          return api(original);
        } catch {
          localStorage.removeItem('luxe_token');
          localStorage.removeItem('luxe_refresh');
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
