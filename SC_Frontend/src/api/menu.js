
import api from './api';

export const createMenuItem = (data) => api.post('/api/products', data);
export const updateMenuItem = (id, data) => api.put(`/api/products/${id}`, data);
export const deleteMenuItem = (id) => api.delete(`/api/products/${id}`);
