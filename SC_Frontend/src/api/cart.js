import api from "./api";

// Match the backend routes exactly
export const getCart = () => api.get("/api/cart");
export const addToCart = (data) => api.post("/api/cart", data); // POST /api/cart
export const updateCartItem = (itemId, data) => api.put(`/api/cart/${itemId}`, data); // PUT /api/cart/:id
export const removeCartItem = (itemId) => api.delete(`/api/cart/${itemId}`); // DELETE /api/cart/:id
export const getCartTotal = () => api.get("/api/cart/total/value"); // GET /api/cart/total/value
