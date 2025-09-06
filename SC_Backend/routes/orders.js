const express = require("express");
const router = express.Router();
const { query } = require("../config/database");
const { protect } = require("../middleware/auth");

// Place new order
router.post("/", protect, async (req, res) => {
  const {
    cartItems,
    totalAmount,
    taxAmount,
    deliveryFee,
    paymentMethod,
    deliveryAddress,
    contactPhone,
    specialInstructions,
  } = req.body;

  if (!cartItems || cartItems.length === 0) {
    return res.status(400).json({ success: false, message: "Cart is empty" });
  }

  try {
    const orderNumber = "ORD-" + Date.now();

    // insert order
    const orderResult = await query(
      `INSERT INTO orders 
      (user_id, order_number, total_amount, tax_amount, delivery_fee, payment_method, delivery_address, contact_phone, special_instructions) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        orderNumber,
        totalAmount,
        taxAmount || 0,
        deliveryFee || 0,
        paymentMethod || "cash",
        deliveryAddress || null,
        contactPhone || null,
        specialInstructions || null,
      ]
    );

    const orderId = orderResult.insertId;

    // insert order items
    for (const item of cartItems) {
      await query(
        `INSERT INTO order_items 
        (order_id, product_id, product_name, product_price, quantity, special_instructions) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          item.product_id,
          item.name,
          item.price,
          item.quantity,
          item.special_instructions || null,
        ]
      );
    }

    res.json({
      success: true,
      message: "Order placed successfully",
      orderId,
      orderNumber,
    });
  } catch (error) {
    console.error("Order placement error:", error);
    res.status(500).json({ success: false, message: "Server error placing order" });
  }
});


// Get logged-in user's orders
router.get("/", protect, async (req, res) => {
  try {
    const orders = await query(
      `SELECT o.id, o.order_number, o.total_amount, o.status, o.created_at,
              COUNT(oi.id) as items_count
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       WHERE o.user_id = ?
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [req.user.id]
    );

    res.json({ success: true, data: { orders } });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ success: false, message: "Server error fetching orders" });
  }
});

module.exports = router;
