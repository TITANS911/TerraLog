import axios from 'axios';

// Determine API base URL based on environment
const getBaseURL = () => {
  // Log environment variables for debugging
  console.log('🔧 ENV MODE:', import.meta.env.MODE);
  console.log('🔧 VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
  
  // Priority: always use VITE_API_BASE_URL if available
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // For development: use localhost
  if (import.meta.env.MODE === 'development') {
    return 'http://localhost:8080/api';
  }
  
  // Fallback for production (if env var not set)
  return `${window.location.origin}/api`;
};

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token if available
apiClient.interceptors.request.use(
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

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('❌ API ERROR DETAILS:');
    console.error('URL:', error.config?.url);
    console.error('Method:', error.config?.method);
    console.error('Status Code:', error.response?.status);
    console.error('Response Data:', error.response?.data);
    
    if (error.response?.status === 401) {
      // Unauthorized - clear localStorage and redirect to login
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API service functions
export const apiService = {
    // Auth endpoints
    login: (username, password) => {
        return apiClient.post('/auth/login', { username, password });
    },
    
    googleLogin: (credential) => {
        return apiClient.post('/auth/google-login', { credential });
    },
    
    register: (data) => {
        return apiClient.post('/auth/register', data);
    },
    
    // User endpoints
    getUsers: () => apiClient.get('/users'),
    getUserById: (id) => apiClient.get(`/users/${id}`),
    createUser: (data) => apiClient.post('/users', data),
    updateUser: (id, data) => apiClient.put(`/users/${id}`, data),
    deleteUser: (id) => apiClient.delete(`/users/${id}`),
    
    // Sampah endpoints
    getSampah: () => apiClient.get('/sampah'),
    getSampahById: (id) => apiClient.get(`/sampah/${id}`),
    createSampah: (data) => apiClient.post('/sampah', data),
    updateSampah: (id, data) => apiClient.put(`/sampah/${id}`, data),
    deleteSampah: (id) => apiClient.delete(`/sampah/${id}`),
    
    // Kategori endpoints
    getKategori: () => apiClient.get('/kategori'),
    getKategoriById: (id) => apiClient.get(`/kategori/${id}`),
    createKategori: (data) => apiClient.post('/kategori', data),
    updateKategori: (id, data) => apiClient.put(`/kategori/${id}`, data),
    deleteKategori: (id) => apiClient.delete(`/kategori/${id}`),
    
    // Transaksi endpoints
    getTransaksi: () => apiClient.get('/transaksi'),
    getTransaksiById: (id) => apiClient.get(`/transaksi/${id}`),
    createTransaksi: (data) => apiClient.post('/transaksi', data),
    updateTransaksi: (id, data) => apiClient.put(`/transaksi/${id}`, data),
    deleteTransaksi: (id) => apiClient.delete(`/transaksi/${id}`),
    
    // Jadwal endpoints
    getJadwal: () => apiClient.get('/jadwal'),
    getJadwalById: (id) => apiClient.get(`/jadwal/${id}`),
    createJadwal: (data) => apiClient.post('/jadwal', data),
    updateJadwal: (id, data) => apiClient.put(`/jadwal/${id}`, data),
    deleteJadwal: (id) => apiClient.delete(`/jadwal/${id}`),
    
    // Generic methods for custom endpoints
    get: (url, config) => apiClient.get(url, config),
    post: (url, data, config) => apiClient.post(url, data, config),
    put: (url, data, config) => apiClient.put(url, data, config),
    delete: (url, config) => apiClient.delete(url, config),
    patch: (url, data, config) => apiClient.patch(url, data, config),
};

export default apiClient;
