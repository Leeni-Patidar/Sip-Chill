const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../config/database');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Apply admin authorization to all routes
router.use(protect);
router.use(authorize('admin'));

// Helper to ensure params are always an array
const safeParams = (params) => (Array.isArray(params) ? params : []);

// -------------------- DASHBOARD -------------------- //
router.get('/dashboard', async (req, res) => {
  try {
    const totalOrders = await query('SELECT COUNT(*) as count FROM orders');
    const totalRevenue = await query(
      'SELECT SUM(total_amount) as total FROM orders WHERE payment_status = "paid"'
    );
    const totalUsers = await query(
      'SELECT COUNT(*) as count FROM users WHERE role = "customer"'
    );
    const totalProducts = await query('SELECT COUNT(*) as count FROM products');

    const recentOrders = await query(`
      SELECT 
        o.id,
        o.order_number,
        o.total_amount,
        o.status,
        o.created_at,
        u.first_name,
        u.last_name
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
      LIMIT 10
    `);

    const recentUsers = await query(`
      SELECT 
        id,
        first_name,
        last_name,
        email,
        created_at
      FROM users
      ORDER BY created_at DESC
      LIMIT 5
    `);

    const lowStockProducts = await query(`
      SELECT id, name, stock_quantity
      FROM products
      WHERE stock_quantity <= 10 AND is_available = TRUE
      ORDER BY stock_quantity ASC
      LIMIT 5
    `);

    const ordersByStatus = await query(`
      SELECT status, COUNT(*) as count
      FROM orders
      GROUP BY status
    `);

    // Format recent users with name and createdAt
    const formattedRecentUsers = recentUsers.map((u) => ({
      ...u,
      name: `${u.first_name || ''} ${u.last_name || ''}`.trim(),
      createdAt: u.created_at,
    }));

    res.json({
      success: true,
      data: {
        stats: {
          total_orders: totalOrders[0].count,
          total_revenue: totalRevenue[0].total || 0,
          total_users: totalUsers[0].count,
          total_products: totalProducts[0].count,
        },
        recent_orders: recentOrders,
        recent_users: formattedRecentUsers,
        low_stock_products: lowStockProducts,
        orders_by_status: ordersByStatus,
      },
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res
      .status(500)
      .json({ success: false, message: 'Server error getting dashboard stats' });
  }
});

// -------------------- ORDERS -------------------- //
router.get('/orders', async (req, res) => {
  try {
    const { page = 1, limit = 20, status, payment_status, search } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let conditions = [];
    let params = [];

    if (status) {
      conditions.push('o.status = ?');
      params.push(status);
    }
    if (payment_status) {
      conditions.push('o.payment_status = ?');
      params.push(payment_status);
    }
    if (search) {
      conditions.push(
        '(o.order_number LIKE ? OR u.first_name LIKE ? OR u.last_name LIKE ? OR u.email LIKE ?)'
      );
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Get paginated orders
    // const orders = await query(
    //   `
    //   SELECT 
    //     o.id,
    //     o.order_number,
    //     o.total_amount,
    //     o.status,
    //     o.payment_status,
    //     o.payment_method,
    //     o.delivery_address,
    //     o.contact_phone,
    //     o.created_at,
    //     o.estimated_delivery_time,
    //     u.first_name,
    //     u.last_name,
    //     u.email
    //   FROM orders o
    //   LEFT JOIN users u ON o.user_id = u.id
    //   ${whereClause}
    //   ORDER BY o.created_at DESC
    //   LIMIT ? OFFSET ?
    //   `,
    //   [...params, parseInt(limit), offset]
    // );

    const orders = await query(
  `
  SELECT 
    o.id,
    o.order_number,
    o.total_amount,
    o.status,
    o.payment_status,
    o.payment_method,
    o.delivery_address,
    o.contact_phone,
    o.created_at,
    o.estimated_delivery_time,
    u.first_name,
    u.last_name,
    u.email
  FROM orders o
  LEFT JOIN users u ON o.user_id = u.id
  ${whereClause}
  ORDER BY o.created_at DESC
  LIMIT ? OFFSET ?
  `,
  [...safeParams(params), parseInt(limit), offset]
);


    // Attach order items (product name + quantity)
    for (const order of orders) {
      const items = await query(
        `
        SELECT 
          oi.product_name, 
          oi.quantity, 
          oi.product_price
        FROM order_items oi
        WHERE oi.order_id = ?
        `,
        [order.id]
      );
      order.items = items;
    }

    // Count total for pagination
    const countResult = await query(
      `
      SELECT COUNT(*) as total
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ${whereClause}
      `,
      params
    );

    const total = countResult[0]?.total || 0;
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          current_page: parseInt(page),
          total_pages: totalPages,
          total_items: total,
          items_per_page: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error('Get admin orders error:', error);
    res
      .status(500)
      .json({ success: false, message: 'Server error getting orders' });
  }
});

router.put(
  '/orders/:id/status',
  [
    body('status')
      .isIn([
        'pending',
        'confirmed',
        'preparing',
        'ready',
        'delivered',
        'cancelled',
      ])
      .withMessage('Valid status is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { id } = req.params;
      const { status } = req.body;

      const orders = await query('SELECT id FROM orders WHERE id = ?', [id]);
      if (orders.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: 'Order not found' });
      }

      await query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);

      res.json({
        success: true,
        message: 'Order status updated successfully',
      });
    } catch (error) {
      console.error('Update order status error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error updating order status',
      });
    }
  }
);

// -------------------- USERS -------------------- //
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let conditions = [];
    let params = [];

    if (role) {
      conditions.push('role = ?');
      params.push(role);
    }
    if (search) {
      conditions.push(
        '(first_name LIKE ? OR last_name LIKE ? OR email LIKE ?)'
      );
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // const users = await query(
    //   `
    //   SELECT 
    //     id,
    //     email,
    //     first_name,
    //     last_name,
    //     phone,
    //     role,
    //     is_active,
    //     created_at
    //   FROM users
    //   ${whereClause}
    //   ORDER BY created_at DESC
    //   LIMIT ? OFFSET ?
    //   `,
    //   [...params, parseInt(limit), offset]
    // );

         const users = await query(
  `
  SELECT 
    id,
    email,
    first_name,
    last_name,
    phone,
    role,
    is_active,
    created_at
  FROM users
  ${whereClause}
  ORDER BY created_at DESC
  LIMIT ? OFFSET ?
  `,
  [...safeParams(params), parseInt(limit), offset]
);

const safeParams = (params) => (Array.isArray(params) ? params : []);

    const countResult = await query(
      `
      SELECT COUNT(*) as total
      FROM users
      ${whereClause}
      `,
      safeParams(params)
    );

    const total = countResult[0]?.total || 0;
    const totalPages = Math.ceil(total / parseInt(limit));

    // Add name and createdAt
    const formattedUsers = users.map((u) => ({
      ...u,
      name: `${u.first_name || ''} ${u.last_name || ''}`.trim(),
      createdAt: u.created_at,
    }));

    res.json({
      success: true,
      data: {
        users: formattedUsers,
        pagination: {
          current_page: parseInt(page),
          total_pages: totalPages,
          total_items: total,
          items_per_page: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error('Get admin users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting users',
      error: error.message,
    });
  }
});

router.put(
  '/users/:id/status',
  [body('is_active').isBoolean().withMessage('is_active must be a boolean')],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { id } = req.params;
      const { is_active } = req.body;

      await query('UPDATE users SET is_active = ? WHERE id = ?', [
        is_active,
        id,
      ]);

      res.json({ success: true, message: 'User status updated successfully' });
    } catch (error) {
      console.error('Update user status error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error updating user status',
      });
    }
  }
);

// -------------------- CONTACT MESSAGES -------------------- //
router.get('/contact-messages', async (req, res) => {
  try {
    const { page = 1, limit = 20, is_read } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let conditions = [];
    let params = [];

    if (is_read !== undefined) {
      conditions.push('is_read = ?');
      params.push(is_read === 'true');
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const messages = await query(
      `
      SELECT id, name, email, subject, message, is_read, created_at
      FROM contact_messages
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
      `,
      [...params, parseInt(limit), offset]
    );

    const countResult = await query(
      `
      SELECT COUNT(*) as total
      FROM contact_messages
      ${whereClause}
      `,
      safeParams(params)
    );

    const total = countResult[0]?.total || 0;
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: {
        messages,
        pagination: {
          current_page: parseInt(page),
          total_pages: totalPages,
          total_items: total,
          items_per_page: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error('Get contact messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting contact messages',
    });
  }
});

router.put('/contact-messages/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    await query('UPDATE contact_messages SET is_read = TRUE WHERE id = ?', [
      id,
    ]);
    res.json({ success: true, message: 'Message marked as read' });
  } catch (error) {
    console.error('Mark message as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error marking message as read',
    });
  }
});

// -------------------- PRODUCT ANALYTICS -------------------- //
router.get('/analytics/products', async (req, res) => {
  try {
    const topProducts = await query(`
      SELECT 
        p.id,
        p.name,
        p.price,
        SUM(oi.quantity) as total_sold,
        SUM(oi.quantity * oi.product_price) as total_revenue
      FROM products p
      LEFT JOIN order_items oi ON p.id = oi.product_id
      LEFT JOIN orders o ON oi.order_id = o.id
      WHERE o.status != 'cancelled'
      GROUP BY p.id
      ORDER BY total_sold DESC
      LIMIT 10
    `);

    const lowStockProducts = await query(`
      SELECT id, name, stock_quantity
      FROM products
      WHERE stock_quantity <= 10 AND is_available = TRUE
      ORDER BY stock_quantity ASC
    `);

    const categorySales = await query(`
      SELECT 
        c.name as category_name,
        COUNT(oi.id) as items_sold,
        SUM(oi.quantity * oi.product_price) as revenue
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      LEFT JOIN order_items oi ON p.id = oi.product_id
      LEFT JOIN orders o ON oi.order_id = o.id
      WHERE o.status != 'cancelled'
      GROUP BY c.id
      ORDER BY revenue DESC
    `);

    res.json({
      success: true,
      data: {
        top_products: topProducts,
        low_stock_products: lowStockProducts,
        category_sales: categorySales,
      },
    });
  } catch (error) {
    console.error('Get product analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting product analytics',
    });
  }
});

module.exports = router;