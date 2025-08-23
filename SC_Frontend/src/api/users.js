import axios from 'axios';

export const getUserProfile = () => axios.get('/api/users/profile');
export const getUserOrders = () => axios.get('/api/users/orders');
export const getUserOrderDetails = (id) => axios.get(`/api/users/orders/${id}`);
export const getUserFavorites = () => axios.get('/api/users/favorites');
export const getUserReviews = () => axios.get('/api/users/reviews');
export const addUserReview = (data) => axios.post('/api/users/reviews', data);
export const getUserStats = () => axios.get('/api/users/stats');
