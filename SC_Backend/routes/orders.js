const express = require('express');
const { body, validationResult } = require('express-validator');
const { query, transaction } = require('../config/database');
const { protect, optionalAuth } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Helper function to generate order number
const generateOrderNumber = () => {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `SC${timestamp}${random}`;
};

// Helper function to calculate order totals
const calculateOrderTotals = (items) => {
  const subtotal = items.reduce((sum, item) => sum + item.product_price * item.quantity, 0);
  const tax = subtotal * 0.08; // 8% tax
  const deliveryFee = subtotal >= 25 ? 0 : 3.99;
  const total = subtotal + tax + deliveryFee;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    delivery_fee: deliveryFee,
    total: Math.round(total * 100) / 100,
  };
};

// ================= PLACE ORDER =================
router.post(
  '/',
  protect,
  [
    body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
    body('items.*.product_id').isInt().withMessage('Valid product ID is required'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('delivery_address').notEmpty().withMessage('Delivery address is required'),
    body('contact_phone').notEmpty().withMessage('Contact phone is required'),
    body('payment_method')
      .isIn(['cash', 'card', 'online'])
      .withMessage('Valid payment method is required'),
    body('special_instructions').optional().isString(),
    body('coupon_code').optional().isString(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const {
        items,
        delivery_address,
        contact_phone,
        payment_method,
        special_instructions,
        coupon_code,
      } = req.body;

      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
      }

      // Fetch products
      const productIds = items.map((i) => i.product_id);
      const products = await query(
        `SELECT id, name, price, stock_quantity, is_available FROM products WHERE id IN (${productIds
          .map(() => '?')
          .join(',')})`,
        productIds
      );

      if (products.length !== productIds.length) {
        return res.status(400).json({ success: false, message: 'Some products not found' });
      }

      // Check stock and availability
      const orderItems = [];
      for (const item of items) {
        const product = products.find((p) => p.id === item.product_id);
        if (!product.is_available) {
          return res.status(400).json({ success: false, message: `${product.name} is not available` });
        }
        if (product.stock_quantity < item.quantity) {
          return res
            .status(400)
            .json({ success: false, message: `Only ${product.stock_quantity} ${product.name} available` });
        }
        orderItems.push({ ...item, product_name: product.name, product_price: product.price });
      }

      // Apply coupon if any
      let discountAmount = 0;
      if (coupon_code) {
        const coupons = await query(
          `SELECT * FROM coupons 
           WHERE code = ? AND is_active = TRUE 
           AND (valid_until IS NULL OR valid_until > NOW())
           AND (max_uses IS NULL OR used_count < max_uses)`,
          [coupon_code]
        );
        if (coupons.length) {
          const coupon = coupons[0];
          const subtotal = orderItems.reduce((sum, i) => sum + i.product_price * i.quantity, 0);
          if (subtotal >= coupon.minimum_order_amount) {
            discountAmount =
              coupon.discount_type === 'percentage'
                ? subtotal * (coupon.discount_value / 100)
                : coupon.discount_value;
          }
        }
      }

      // Calculate totals
      const totals = calculateOrderTotals(orderItems);
      const finalTotal = totals.total - discountAmount;

      // Transaction to insert order, items, update stock, and coupon
      const orderResult = await transaction(async (connection) => {
        const orderNumber = generateOrderNumber();
        const [orderInsert] = await connection.execute(
          `INSERT INTO orders 
            (user_id, order_number, total_amount, tax_amount, delivery_fee, payment_method, delivery_address, contact_phone, special_instructions)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            userId,
            orderNumber,
            finalTotal,
            totals.tax,
            totals.delivery_fee,
            payment_method,
            delivery_address,
            contact_phone,
            special_instructions,
          ]
        );

        const orderId = orderInsert.insertId;

        for (const item of orderItems) {
          await connection.execute(
            `INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity, special_instructions)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [orderId, item.product_id, item.product_name, item.product_price, item.quantity, item.special_instructions]
          );

          await connection.execute(`UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?`, [
            item.quantity,
            item.product_id,
          ]);
        }

        if (coupon_code && discountAmount > 0) {
          await connection.execute(`UPDATE coupons SET used_count = used_count + 1 WHERE code = ?`, [coupon_code]);
        }

        await connection.execute('DELETE FROM cart WHERE user_id = ?', [userId]);

        return { orderId, orderNumber };
      });

      // Fetch order details
      const orders = await query(
        `SELECT o.*, u.first_name, u.last_name, u.email FROM orders o 
         LEFT JOIN users u ON o.user_id = u.id 
         WHERE o.id = ?`,
        [orderResult.orderId]
      );

      const orderItemsResult = await query(`SELECT * FROM order_items WHERE order_id = ?`, [
        orderResult.orderId,
      ]);

      const order = { ...orders[0], items: orderItemsResult };

      res.status(201).json({ success: true, message: 'Order placed successfully', data: { order, order_number: orderResult.orderNumber } });
    } catch (error) {
      console.error('Place order error:', error);
      res.status(500).json({ success: false, message: 'Server error placing order' });
    }
  }
);

// ================= GET USER ORDERS =================
router.get('/', protect, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE o.user_id = ?';
    const params = [req.user.id];

    if (status) {
      whereClause += ' AND o.status = ?';
      params.push(status);
    }

    const orders = await query(
      `SELECT o.id, o.order_number, o.total_amount, o.status, o.payment_status, o.payment_method, o.delivery_address, o.contact_phone, o.created_at
       FROM orders o ${whereClause} ORDER BY o.created_at DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), parseInt(offset)]
    );

    const countResult = await query(`SELECT COUNT(*) AS total FROM orders o ${whereClause}`, params);
    const totalPages = Math.ceil(countResult[0].total / limit);

    res.json({ success: true, data: { orders, pagination: { current_page: parseInt(page), total_pages: totalPages, total_items: countResult[0].total, items_per_page: parseInt(limit) } } });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ success: false, message: 'Server error getting orders' });
  }
});

// ================= GET SINGLE ORDER =================
router.get('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;

    const orders = await query(
      `SELECT o.*, u.first_name, u.last_name, u.email FROM orders o 
       LEFT JOIN users u ON o.user_id = u.id 
       WHERE o.id = ? AND o.user_id = ?`,
      [id, req.user.id]
    );

    if (!orders.length) return res.status(404).json({ success: false, message: 'Order not found' });

    const orderItems = await query(`SELECT * FROM order_items WHERE order_id = ?`, [id]);
    res.json({ success: true, data: { ...orders[0], items: orderItems } });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ success: false, message: 'Server error getting order' });
  }
});

// ================= CANCEL ORDER =================
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const { id } = req.params;

    const orders = await query(`SELECT id, status FROM orders WHERE id = ? AND user_id = ?`, [
      id,
      req.user.id,
    ]);

    if (!orders.length) return res.status(404).json({ success: false, message: 'Order not found' });

    const order = orders[0];
    if (order.status === 'cancelled')
      return res.status(400).json({ success: false, message: 'Order is already cancelled' });
    if (['ready', 'delivered'].includes(order.status))
      return res.status(400).json({ success: false, message: 'Order cannot be cancelled at this stage' });

    await transaction(async (connection) => {
      await connection.execute(`UPDATE orders SET status = 'cancelled' WHERE id = ?`, [id]);

      const [orderItems] = await connection.execute(`SELECT product_id, quantity FROM order_items WHERE order_id = ?`, [id]);
      for (const item of orderItems) {
        await connection.execute(`UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?`, [
          item.quantity,
          item.product_id,
        ]);
      }
    });

    res.json({ success: true, message: 'Order cancelled successfully' });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ success: false, message: 'Server error cancelling order' });
  }
});

// ================= TRACK ORDER =================
router.get('/track/:orderNumber', async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const orders = await query(`SELECT * FROM orders WHERE order_number = ?`, [orderNumber]);
    if (!orders.length) return res.status(404).json({ success: false, message: 'Order not found' });

    const orderItems = await query(`SELECT * FROM order_items WHERE order_id = ?`, [orders[0].id]);
    res.json({ success: true, data: { ...orders[0], items: orderItems } });
  } catch (error) {
    console.error('Track order error:', error);
    res.status(500).json({ success: false, message: 'Server error tracking order' });
  }
});

module.exports = router;
