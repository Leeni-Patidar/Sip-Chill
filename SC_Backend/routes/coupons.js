const express = require("express");
const { query } = require("../config/database");

const router = express.Router();

/**
 * ---------------- GET ACTIVE COUPONS ----------------
 * Public / User side (only show active + not expired coupons)
 */
router.get("/", async (req, res) => {
  try {
    const coupons = await query(
      `SELECT id, code, description, discount_value, valid_until 
       FROM coupons 
       WHERE is_active = 1 
         AND (valid_until IS NULL OR valid_until >= NOW())
       ORDER BY created_at DESC`
    );

    res.json({ success: true, data: coupons });
  } catch (err) {
    console.error("Fetch coupons error:", err);
    res.status(500).json({ success: false, message: "Server error fetching coupons" });
  }
});

/**
 * ---------------- VALIDATE / APPLY COUPON ----------------
 * User provides a coupon code → check if valid and return discount
 */
router.post("/apply", async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ success: false, message: "Coupon code is required" });
  }

  try {
    const [coupon] = await query(
      `SELECT id, code, description, discount_value, valid_until 
       FROM coupons 
       WHERE code = ? 
         AND is_active = 1
         AND (valid_until IS NULL OR valid_until >= NOW())
       LIMIT 1`,
      [code]
    );

    if (!coupon) {
      return res.status(404).json({ success: false, message: "Invalid or expired coupon" });
    }

    res.json({ success: true, data: coupon });
  } catch (err) {
    console.error("Apply coupon error:", err);
    res.status(500).json({ success: false, message: "Server error applying coupon" });
  }
});

module.exports = router;
