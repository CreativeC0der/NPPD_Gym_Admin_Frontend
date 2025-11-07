import axios, { type InternalAxiosRequestConfig } from 'axios';

// Get environment variables with fallbacks
const backendHost = import.meta.env.VITE_BACKEND_HOST || 'http://localhost:10000';
const baseURL = `${backendHost}/api`;

const api = axios.create({
    baseURL,
});

// Add Authorization header automatically
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
