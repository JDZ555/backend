import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://54.221.176.45:5000/api';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token de autenticación (si es necesario)
api.interceptors.request.use(
  (config) => {
  // Usar exclusivamente el token del dashboard
  const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Servicios de estadísticas
export const statsService = {
  getGlobalStats: async () => {
    // stats/global ya requiere auth; para admin podríamos reutilizar
    const response = await api.get('/stats/global');
    return response.data;
  },

  getUserStats: async (userId) => {
    const response = await api.get(`/stats/user/${userId}`);
    return response.data;
  },
};

// Servicios de autenticación
export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
};

// Servicios de sesiones
export const sessionService = {
  getAll: async (params = {}) => {
    // Usar endpoint admin que lista todas las sesiones
    const response = await api.get('/admin/sessions', { params });
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
};

// Servicios de mensajes
export const messageService = {
  getAll: async (params = {}) => {
    // Usar endpoint admin que lista todos los mensajes
    const response = await api.get('/admin/messages', { params });
    return response.data;
  },

  getBySession: async (sessionId, params = {}) => {
    const response = await api.get(`/messages/${sessionId}`, { params });
    return response.data;
  },
};

// Servicios de usuarios
export const userService = {
  getAll: async (params = {}) => {
    const response = await api.get('/users', { params });
    return response.data;
  },
};

export default api;
