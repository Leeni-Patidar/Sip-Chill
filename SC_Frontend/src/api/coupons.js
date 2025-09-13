import api from "./api";

// ----------------- USER ROUTES ----------------- //

// Fetch active coupons (user side)
export const getCoupons = async () => {
  try {
    const res = await api.get("/api/coupons");
    return { success: true, data: res.data.data || [] };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Failed to fetch coupons",
      data: [],
    };
  }
};

// Apply a coupon code (user side)
export const applyCoupon = async (code) => {
  try {
    const res = await api.post("/api/coupons/apply", { code });
    return { success: true, data: res.data.data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Invalid or expired coupon",
    };
  }
};

// ----------------- ADMIN ROUTES ----------------- //

// Fetch all coupons (admin)
export const getAllCoupons = async () => {
  try {
    const res = await api.get("/api/admin/coupons");
    return { success: true, data: res.data.data || [] };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Failed to fetch coupons",
      data: [],
    };
  }
};

// Create coupon (admin)
export const createCoupon = async (couponData) => {
  try {
    const res = await api.post("/api/admin/coupons", {
      code: couponData.code,
      discount_value: Number(couponData.discount_value), // ✅ ensure number
      valid_until: couponData.valid_until || null,
      description: couponData.description || null,
    });
    return { success: true, data: res.data.data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Failed to create coupon",
      errors: err.response?.data?.errors || [],
    };
  }
};

// Update coupon (admin)
export const updateCoupon = async (id, couponData) => {
  try {
    const res = await api.put(`/api/admin/coupons/${id}`, {
      code: couponData.code,
      discount_value: Number(couponData.discount_value), // ✅ ensure number
      valid_until: couponData.valid_until || null,
      description: couponData.description || null,
      is_active: couponData.is_active,
    });
    return { success: true, data: res.data.data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Failed to update coupon",
      errors: err.response?.data?.errors || [],
    };
  }
};

// Delete coupon (admin)
export const deleteCoupon = async (id) => {
  try {
    const res = await api.delete(`/api/admin/coupons/${id}`);
    return { success: true, message: res.data.message };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Failed to delete coupon",
    };
  }
};
