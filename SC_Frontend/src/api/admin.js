import api from "./api";

// ---- Admin Dashboard ---- //
export const getDashboardStats = async () => {
  try {
    const res = await api.get("/api/admin/dashboard");
    return { success: true, data: res.data };
  } catch (err) {
    console.error("Get dashboard stats error:", err.response?.data || err.message);
    return {
      success: false,
      message: err.response?.data?.message || "Failed to fetch dashboard stats",
    };
  }
};

// ---- Orders ---- //
export const getAllOrders = async (params = { page: 1, limit: 20 }) => {
  try {
    const res = await api.get("/api/admin/orders", { params });
    return { success: true, data: res.data.data };
  } catch (err) {
    console.error("Get admin orders error:", err.response?.data || err.message);
    return {
      success: false,
      message: err.response?.data?.message || "Failed to fetch orders",
    };
  }
};

export const updateOrderStatus = async (id, data) => {
  try {
    const res = await api.put(`/api/admin/orders/${id}/status`, data);
    return { success: true, data: res.data };
  } catch (err) {
    console.error("Update order status error:", err.response?.data || err.message);
    return {
      success: false,
      message: err.response?.data?.message || "Failed to update order status",
    };
  }
};

// ---- Users ---- //
export const getAllUsers = async (params = { page: 1, limit: 20 }) => {
  try {
    const res = await api.get("/api/admin/users", { params });
    return { success: true, data: res.data.data };
  } catch (err) {
    console.error("Get admin users error:", err.response?.data || err.message);
    return {
      success: false,
      message: err.response?.data?.message || "Failed to fetch users",
    };
  }
};

export const updateUserStatus = async (id, data) => {
  try {
    const res = await api.put(`/api/admin/users/${id}/status`, data);
    return { success: true, data: res.data };
  } catch (err) {
    console.error("Update user status error:", err.response?.data || err.message);
    return {
      success: false,
      message: err.response?.data?.message || "Failed to update user status",
    };
  }
};

// ---- Contact Messages ---- //
export const getContactMessages = async (params = { page: 1, limit: 20 }) => {
  try {
    const res = await api.get("/api/admin/contact-messages", { params });
    return { success: true, data: res.data };
  } catch (err) {
    console.error("Get contact messages error:", err.response?.data || err.message);
    return {
      success: false,
      message: err.response?.data?.message || "Failed to fetch contact messages",
    };
  }
};

export const markMessageRead = async (id) => {
  try {
    const res = await api.put(`/api/admin/contact-messages/${id}/read`);
    return { success: true, data: res.data };
  } catch (err) {
    console.error("Mark message read error:", err.response?.data || err.message);
    return {
      success: false,
      message: err.response?.data?.message || "Failed to mark message as read",
    };
  }
};

// ---- Analytics ---- //
export const getProductAnalytics = async () => {
  try {
    const res = await api.get("/api/admin/analytics/products");
    return { success: true, data: res.data };
  } catch (err) {
    console.error("Get product analytics error:", err.response?.data || err.message);
    return {
      success: false,
      message: err.response?.data?.message || "Failed to fetch product analytics",
    };
  }
};
