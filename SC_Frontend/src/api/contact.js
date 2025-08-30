
import api from './api';

export const submitContactForm = (data) => api.post('/api/contact', data);
export const getCafeInfo = () => api.get('/api/contact/info');
export const getCafeHours = () => api.get('/api/contact/hours');
export const isCafeOpen = () => api.get('/api/contact/is-open');
