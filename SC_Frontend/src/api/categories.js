import axios from 'axios';

export const getAllCategories = () => axios.get('/api/categories');
export const getCategoryById = (id) => axios.get(`/api/categories/${id}`);
export const getCategoryBySlug = (slug) => axios.get(`/api/categories/slug/${slug}`);
