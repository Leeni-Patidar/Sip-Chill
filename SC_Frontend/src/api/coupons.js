// src/api/coupons.js
import api from "./api"; // your axios instance

// ✅ Fetch all available coupons
export const getCoupons = async () => {
  try {
    const res = await api.get("/api/coupons");
    return { success: true, data: res.data };
  } catch (err) {
    console.error("Get coupons error:", err.response?.data || err.message);
    return { success: false, message: err.response?.data?.message || "Failed to fetch coupons" };
  }
};

// ✅ Validate a coupon by code (optional)
export const validateCoupon = async (code) => {
  try { 
    const res = await api.post("/api/coupons/validate", { code });
    return { success: true, data: res.data };
  } catch (err) {
    console.error("Validate coupon error:", err.response?.data || err.message);
    return { success: false, message: err.response?.data?.message || "Invalid coupon" };
  }
};
