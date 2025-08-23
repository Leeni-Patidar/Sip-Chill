import axios from 'axios';

export const createMenuItem = (data) => axios.post('/api/products', data);
export const updateMenuItem = (id, data) => axios.put(`/api/products/${id}`, data);
export const deleteMenuItem = (id) => axios.delete(`/api/products/${id}`);
