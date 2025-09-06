// src/api/products.js
import api from './api';

// ✅ Get all products (with filters, pagination, etc.)
export const getAllProducts = (params) => api.get('/api/products', { params });

// ✅ Get featured products
export const getFeaturedProducts = () => api.get('/api/products/featured');

// ✅ Get single product
export const getProductById = (id) => api.get(`/api/products/${id}`);

// ✅ Search products
export const searchProducts = (query) => api.get(`/api/products/search/${query}`);

// ====================
// 🔹 CRUD (Admin only)
// ====================

// ✅ Add new product
export const addProduct = (data) => api.post('/api/products', data);

// ✅ Update product
export const updateProduct = (id, data) => api.put(`/api/products/${id}`, data);

// ✅ Delete product
export const deleteProduct = (id) => api.delete(`/api/products/${id}`);
