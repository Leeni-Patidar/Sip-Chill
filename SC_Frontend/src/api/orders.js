import api from './api';

// ✅ Place an order
export const placeOrder = async (orderData) => {
  try {
    const { data } = await api.post("/api/orders", orderData);
    return data;
  } catch (error) {
    console.error("Place order API error:", error.response?.data || error.message);
    return { success: false, message: error.response?.data?.message || "Server error placing order" };
  }
};

// ✅ Get all user orders
export const getOrders = async () => {
  try {
    const { data } = await api.get("/api/orders");
    return data;
  } catch (error) {
    console.error("Get orders API error:", error.response?.data || error.message);
    return { success: false, message: error.response?.data?.message || "Server error fetching orders" };
  }
};

// ✅ Get order by ID
export const getOrderById = async (id) => {
  try {
    const { data } = await api.get(`/api/orders/${id}`);
    return data;
  } catch (error) {
    console.error("Get order by ID API error:", error.response?.data || error.message);
    return { success: false, message: error.response?.data?.message || "Server error fetching order" };
  }
};

// ✅ Cancel order
export const cancelOrder = async (id) => {
  try {
    const { data } = await api.put(`/api/orders/${id}/cancel`);
    return data;
  } catch (error) {
    console.error("Cancel order API error:", error.response?.data || error.message);
    return { success: false, message: error.response?.data?.message || "Server error canceling order" };
  }
};

// ✅ Track order by order number
export const trackOrder = async (orderNumber) => {
  try {
    const { data } = await api.get(`/api/orders/track/${orderNumber}`);
    return data;
  } catch (error) {
    console.error("Track order API error:", error.response?.data || error.message);
    return { success: false, message: error.response?.data?.message || "Server error tracking order" };
  }
};
