
import axios from 'axios';

const api = axios.create({
	baseURL: import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:5002',
	withCredentials: true
});

export const register = (data) => api.post('/api/auth/register', data);
export const login = (data) => api.post('/api/auth/login', data);
export const getMe = () => api.get('/api/auth/me');
export const updateProfile = (data) => api.put('/api/auth/profile', data);
export const changePassword = (data) => api.put('/api/auth/change-password', data);
