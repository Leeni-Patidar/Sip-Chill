import axios from 'axios';

export const submitContactForm = (data) => axios.post('/api/contact', data);
export const getCafeInfo = () => axios.get('/api/contact/info');
export const getCafeHours = () => axios.get('/api/contact/hours');
export const isCafeOpen = () => axios.get('/api/contact/is-open');
