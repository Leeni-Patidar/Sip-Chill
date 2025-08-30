
import api from './api';

export const getAllCategories = () => api.get('/api/categories');
export const getCategoryById = (id) => api.get(`/api/categories/${id}`);
export const getCategoryBySlug = (slug) => api.get(`/api/categories/slug/${slug}`);
