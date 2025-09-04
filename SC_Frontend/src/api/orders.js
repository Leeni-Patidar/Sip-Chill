
import api from './api';

export const placeOrder = (data) => api.post('/api/orders', data);
export const getOrders = () => api.get('/api/orders');
export const getOrderById = (id) => api.get(`/api/orders/${id}`);
export const cancelOrder = (id) => api.put(`/api/orders/${id}/cancel`);
export const trackOrder = (orderNumber) => api.get(`/api/orders/track/${orderNumber}`);


