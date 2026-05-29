import axios from 'axios';

// Create central Axios instance using Vite env variables
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatic authorization token propagation
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('gadgethub_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Centralized error interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Unpack clean message from server if it exists
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default api;
