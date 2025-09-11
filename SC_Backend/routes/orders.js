// const express = require("express");
// const router = express.Router();
// const { query } = require("../config/database");
// const { protect } = require("../middleware/auth");

// // Place new order
// router.post("/", protect, async (req, res) => {
//   const {
//     cartItems,
//     totalAmount,
//     taxAmount,
//     deliveryFee,
//     paymentMethod,
//     deliveryAddress,
//     contactPhone,
//     specialInstructions,
//   } = req.body;

//   if (!cartItems || cartItems.length === 0) {
//     return res.status(400).json({ success: false, message: "Cart is empty" });
//   }

//   try {
//     const orderNumber = "ORD-" + Date.now();

//     // insert order
//     const orderResult = await query(
//       `INSERT INTO orders 
//       (user_id, order_number, total_amount, tax_amount, delivery_fee, payment_method, delivery_address, contact_phone, special_instructions) 
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//       [
//         req.user.id,
//         orderNumber,
//         totalAmount,
//         taxAmount || 0,
//         deliveryFee || 0,
//         paymentMethod || "cash",
//         deliveryAddress || null,
//         contactPhone || null,
//         specialInstructions || null,
//       ]
//     );

//     const orderId = orderResult.insertId;

//     // insert order items
//     for (const item of cartItems) {
//       await query(
//         `INSERT INTO order_items 
//         (order_id, product_id, product_name, product_price, quantity, special_instructions) 
//         VALUES (?, ?, ?, ?, ?, ?)`,
//         [
//           orderId,
//           item.product_id,
//           item.name,
//           item.price,
//           item.quantity,
//           item.special_instructions || null,
//         ]
//       );
//     }

//     res.json({
//       success: true,
//       message: "Order placed successfully",
//       orderId,
//       orderNumber,
//     });
//   } catch (error) {
//     console.error("Order placement error:", error);
//     res.status(500).json({ success: false, message: "Server error placing order" });
//   }
// });

// // Get logged-in user's orders
// router.get("/", protect, async (req, res) => {
//   try {
//     const orders = await query(
//       `SELECT o.id, o.order_number, o.total_amount, o.status, o.created_at,
//               COUNT(oi.id) as items_count
//        FROM orders o
//        LEFT JOIN order_items oi ON o.id = oi.order_id
//        WHERE o.user_id = ?
//        GROUP BY o.id
//        ORDER BY o.created_at DESC`,
//       [req.user.id]
//     );

//     res.json({ success: true, data: { orders } });
//   } catch (error) {
//     console.error("Get orders error:", error);
//     res.status(500).json({ success: false, message: "Server error fetching orders" });
//   }
// });

// module.exports = router;


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
      (user_id, order_number, total_amount, tax_amount, delivery_fee, payment_method, delivery_address, contact_phone, special_instructions, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        "pending", // default status
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

// Get single order by ID
router.get("/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;

    // fetch order
    const [order] = await query(`SELECT * FROM orders WHERE id = ?`, [id]);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // check ownership
    if (order.user_id !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    // fetch order items
    const items = await query(
      `SELECT * FROM order_items WHERE order_id = ?`,
      [id]
    );

    res.json({
      success: true,
      data: {
        id: order.id,
        userId: order.user_id,
        orderNumber: order.order_number,
        total: order.total_amount,
        taxAmount: order.tax_amount,
        deliveryFee: order.delivery_fee,
        paymentMethod: order.payment_method,
        deliveryAddress: order.delivery_address,
        contactPhone: order.contact_phone,
        specialInstructions: order.special_instructions,
        status: order.status,
        createdAt: order.created_at,
        items: items.map(item => ({
          product_id: item.product_id,
          name: item.product_name,
          price: item.product_price,
          quantity: item.quantity,
          special_instructions: item.special_instructions,
        })),
      },
    });
  } catch (error) {
    console.error("Get order by ID error:", error);
    res.status(500).json({ success: false, message: "Server error fetching order" });
  }
});

module.exports = router;
