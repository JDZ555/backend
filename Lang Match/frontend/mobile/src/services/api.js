import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://54.221.176.45:5000/api';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Servicios de autenticación
export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Servicios de sesiones
export const sessionService = {
  create: async (sessionData) => {
    const response = await api.post('/sessions', sessionData);
    return response.data;
  },

  getAll: async (params = {}) => {
    const response = await api.get('/sessions', { params });
    return response.data;
  },

  getById: async (sessionId) => {
    const response = await api.get(`/sessions/${sessionId}`);
    return response.data;
  },

  endSession: async (sessionId) => {
    const response = await api.put(`/sessions/${sessionId}/end`);
    return response.data;
  },

  deleteSession: async (sessionId) => {
    const response = await api.delete(`/sessions/${sessionId}`);
    return response.data;
  },

  getAvailable: async () => {
    const response = await api.get('/sessions/available');
    return response.data;
  },
};

// Servicios de mensajes
export const messageService = {
  send: async (messageData) => {
    const response = await api.post('/messages', messageData);
    return response.data;
  },

  getBySession: async (sessionId, params = {}) => {
    const response = await api.get(`/messages/${sessionId}`, { params });
    return response.data;
  },

  getAll: async (params = {}) => {
    const response = await api.get('/messages', { params });
    return response.data;
  },
};

// Servicios de estadísticas
export const statsService = {
  getUserStats: async (userId) => {
    const response = await api.get(`/stats/user/${userId}`);
    return response.data;
  },

  getGlobalStats: async () => {
    const response = await api.get('/stats/global');
    return response.data;
  },
};

export default api;
