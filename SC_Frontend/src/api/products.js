import axios from 'axios';

export const getAllProducts = (params) => axios.get('/api/products', { params });
export const getFeaturedProducts = () => axios.get('/api/products/featured');
export const getProductById = (id) => axios.get(`/api/products/${id}`);
export const searchProducts = (query) => axios.get(`/api/products/search/${query}`);
