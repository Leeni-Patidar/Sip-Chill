// import axios from 'axios';

// export const getDashboardStats = () => axios.get('/api/admin/dashboard');
// export const getAllOrders = () => axios.get('/api/admin/orders');
// export const updateOrderStatus = (id, data) => axios.put(`/api/admin/orders/${id}/status`, data);
// export const getAllUsers = () => axios.get('/api/admin/users');
// export const updateUserStatus = (id, data) => axios.put(`/api/admin/users/${id}/status`, data);
// export const getContactMessages = () => axios.get('/api/admin/contact-messages');
// export const markMessageRead = (id) => axios.put(`/api/admin/contact-messages/${id}/read`);
// export const getProductAnalytics = () => axios.get('/api/admin/analytics/products');



import api from './api';

// ---- Admin API Calls ---- //
export const getDashboardStats = () =>
  api.get("/api/admin/dashboard");

export const getAllOrders = () =>
  api.get("/api/admin/orders");

export const updateOrderStatus = (id, data) =>
  api.put(`/api/admin/orders/${id}/status`, data);

export const getAllUsers = () =>
  api.get("/api/admin/users");

export const updateUserStatus = (id, data) =>
  api.put(`/api/admin/users/${id}/status`, data);

export const getContactMessages = () =>
  api.get("/api/admin/contact-messages");

export const markMessageRead = (id) =>
  axios.put(`/api/admin/contact-messages/${id}/read`, {}, config);

export const getProductAnalytics = () =>
  axios.get("/api/admin/analytics/products", config);
