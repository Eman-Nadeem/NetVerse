import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  // Point this to your Express Backend
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor, runs before every request to backend
// Runs before every request. It grabs the token and adds it to the Authorization header.
// It is like a security pass for protected routes.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Let browser set Content-Type for FormData (multipart/form-data with boundary)
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor, runs after every response from backend
// (Optional - handles global errors like 401 Unauthorized)
api.interceptors.response.use(
  (response) => response, // Just return the response if successful
  (error) => { // Handle errors globally
    if (error.response?.status === 401) {
      // Token expired or invalid - log out the user and redirect to login page
      console.error('Unauthorized access - logging out');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;