import axios from 'axios';

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
const apiBase = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl;

const api = axios.create({
  baseURL: apiBase,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor: attach JWT bearer token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('nightdrop_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 Unauthorized gracefully and guard against HTML responses
api.interceptors.response.use(
  (response) => {
    // If the server returned HTML when we expected JSON (common when SPA rewrite serves index.html for missing /api routes)
    const contentType = response.headers?.['content-type'] || '';
    if (
      typeof response.data === 'string' &&
      (response.data.trim().startsWith('<!doctype') ||
       response.data.trim().startsWith('<html') ||
       contentType.includes('text/html'))
    ) {
      const url = response.config?.url || '';
      if (url.startsWith('/api') || url.includes('/api/')) {
        return Promise.reject(
          new Error(
            `API endpoint '${url}' returned HTML instead of JSON. Ensure your backend service (VITE_API_BASE_URL) is deployed and online.`
          )
        );
      }
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        localStorage.removeItem('nightdrop_token');
        localStorage.removeItem('nightdrop_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
