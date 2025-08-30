
import api from './api';

export const getCart = () => api.get('/api/cart');
export const addToCart = (data) => api.post('/api/cart/add', data);
export const updateCartItem = (itemId, data) => api.put(`/api/cart/update/${itemId}`, data);
export const removeCartItem = (itemId) => api.delete(`/api/cart/remove/${itemId}`);
export const clearCart = () => api.delete('/api/cart/clear');
export const mergeCart = (data) => api.post('/api/cart/merge', data);
