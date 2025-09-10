import api from './api';

// ✅ Get all products (with filters, pagination, etc.)
export const getAllProducts = (params) => api.get('/api/products', { params });

// ✅ Get featured products
export const getFeaturedProducts = () => api.get('/api/products/featured');

// ✅ Get single product
export const getProductById = async (id) => {
  try {
    const response = await api.get(`/api/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch product with ID ${id}:`, error);
    throw error; // Re-throw the error for the calling component to handle
  }
};

// ✅ Search products
export const searchProducts = (query) => api.get(`/api/products/search/${query}`);

// ====================
// 🔹 CRUD (Admin only)
// ====================
export const addProduct = (data) => api.post('/api/products', data);
export const updateProduct = (id, data) => api.put(`/api/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/api/products/${id}`);
