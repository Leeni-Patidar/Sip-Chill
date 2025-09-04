const express = require("express");
const { query } = require("../config/database");
const { protect } = require("../middleware/auth");

const router = express.Router();

// ✅ Get all active & valid coupons
router.get("/", protect, async (req, res) => {
  try {
    const coupons = await query(
      `SELECT id, code, description, discount_type, discount_value, minimum_order_amount, valid_until 
       FROM coupons 
       WHERE is_active = 1
         AND (valid_until IS NULL OR valid_until > NOW())
         AND (max_uses IS NULL OR used_count < max_uses)
       ORDER BY created_at DESC`
    );

    res.json({ success: true, data: coupons });
  } catch (error) {
    console.error("Get coupons error:", error);
    res.status(500).json({ success: false, message: "Server error fetching coupons" });
  }
});

module.exports = router;
