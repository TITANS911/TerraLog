import axios from 'axios';

// Determine API base URL based on environment
const getBaseURL = () => {
  // For development: use localhost
  if (import.meta.env.MODE === 'development') {
    return import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
  }
  
  // For production: use environment variable or current domain
  return import.meta.env.VITE_API_BASE_URL || `${window.location.origin.replace(':3000', ':8080')}/api`;
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
  
  // Add more endpoints as needed
  get: (url, config) => apiClient.get(url, config),
  post: (url, data, config) => apiClient.post(url, data, config),
  put: (url, data, config) => apiClient.put(url, data, config),
  delete: (url, config) => apiClient.delete(url, config),
  patch: (url, data, config) => apiClient.patch(url, data, config),
};

export default apiClient;
