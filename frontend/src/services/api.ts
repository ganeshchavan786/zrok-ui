import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3666';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Tunnel API
export const tunnelApi = {
  // Get account metrics
  metrics: () => api.get('/api/tunnels/metrics'),
  
  // Get specific share metrics
  shareMetrics: (shareToken: string) => api.get(`/api/tunnels/metrics/${shareToken}`),
  
  // List tunnels
  list: () => api.get('/api/tunnels'),
  
  // Create tunnel
  create: (data: { type: string; port: number; subdomain?: string }) => 
    api.post('/api/tunnels', data),
  
  // Delete tunnel
  delete: (id: string) => api.delete(`/api/tunnels/${id}`),
  
  // Get tunnel details
  get: (id: string) => api.get(`/api/tunnels/${id}`),
};

// Auth API
export const authApi = {
  register: (email: string, password: string) =>
    api.post('/api/auth/register', { email, password }),
  
  login: (email: string, password: string) =>
    api.post('/api/auth/login', { email, password }),
  
  me: () => api.get('/api/auth/me'),
};

// Token API
export const tokenApi = {
  list: () => api.get('/api/tokens'),
  
  create: (name: string) => api.post('/api/tokens', { name }),
  
  delete: (id: string) => api.delete(`/api/tokens/${id}`),
};

export default api;
