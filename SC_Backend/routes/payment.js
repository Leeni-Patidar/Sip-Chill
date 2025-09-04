// routes/payment.js
const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order
router.post("/razorpay", async (req, res) => {
  try {
    let { amount } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }

    amount = Math.round(amount); // Razorpay requires integer paise

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
    });

    if (!order) throw new Error("Razorpay order creation failed");

    res.json({ success: true, ...order });
  } catch (err) {
    console.error("Razorpay create order error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
