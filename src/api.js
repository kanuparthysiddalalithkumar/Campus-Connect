import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
console.log('📡 API Base URL:', baseURL);

const api = axios.create({
    baseURL,
});

// Add token to requests
api.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('cc_user'));
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

export default api;

