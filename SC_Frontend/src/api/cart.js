import axios from 'axios';

export const getCart = () => axios.get('/api/cart');
export const addToCart = (data) => axios.post('/api/cart/add', data);
export const updateCartItem = (itemId, data) => axios.put(`/api/cart/update/${itemId}`, data);
export const removeCartItem = (itemId) => axios.delete(`/api/cart/remove/${itemId}`);
export const clearCart = () => axios.delete('/api/cart/clear');
export const mergeCart = (data) => axios.post('/api/cart/merge', data);
