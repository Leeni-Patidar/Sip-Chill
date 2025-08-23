import axios from 'axios';

export const getAllPosts = () => axios.get('/api/blog');
export const getFeaturedPosts = () => axios.get('/api/blog/featured');
export const getPostById = (id) => axios.get(`/api/blog/${id}`);
export const getPostBySlug = (slug) => axios.get(`/api/blog/slug/${slug}`);
export const searchPosts = (query) => axios.get(`/api/blog/search/${query}`);
export const getBlogCategories = () => axios.get('/api/blog/categories');
