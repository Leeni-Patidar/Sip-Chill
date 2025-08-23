import axios from 'axios';

export const placeOrder = (data) => axios.post('/api/orders', data);
export const getOrders = () => axios.get('/api/orders');
export const getOrderById = (id) => axios.get(`/api/orders/${id}`);
export const cancelOrder = (id) => axios.put(`/api/orders/${id}/cancel`);
export const trackOrder = (orderNumber) => axios.get(`/api/orders/track/${orderNumber}`);
