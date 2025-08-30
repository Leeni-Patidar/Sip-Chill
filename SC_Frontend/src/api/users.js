
import api from './api';

export const getUserProfile = () => api.get('/api/users/profile');
export const getUserOrders = () => api.get('/api/users/orders');
export const getUserOrderDetails = (id) => api.get(`/api/users/orders/${id}`);
export const getUserFavorites = () => api.get('/api/users/favorites');
export const getUserReviews = () => api.get('/api/users/reviews');
export const addUserReview = (data) => api.post('/api/users/reviews', data);
export const getUserStats = () => api.get('/api/users/stats');
