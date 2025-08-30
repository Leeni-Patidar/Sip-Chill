
import api from './api';

export const getAllProducts = (params) => api.get('/api/products', { params });
export const getFeaturedProducts = () => api.get('/api/products/featured');
export const getProductById = (id) => api.get(`/api/products/${id}`);
export const searchProducts = (query) => api.get(`/api/products/search/${query}`);
