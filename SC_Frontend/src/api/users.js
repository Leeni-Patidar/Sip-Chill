
import api from './api';

export const getUserProfile = () => api.get('/api/users/profile');
export const getUserOrders = () => api.get('/api/users/orders');
export const getUserOrderDetails = (id) => api.get(`/api/users/orders/${id}`);
export const getUserStats = () => api.get('/api/users/stats');
