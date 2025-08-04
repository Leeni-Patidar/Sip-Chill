const express = require('express');
const { body, validationResult } = require('express-validator');
const { query, transaction } = require('../config/database');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Apply admin authorization to all routes
router.use(protect);
router.use(authorize('admin'));

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
router.get('/dashboard', async (req, res) => {
  try {
    // Get total orders
    const totalOrders = await query('SELECT COUNT(*) as count FROM orders');
    
    // Get total revenue
    const totalRevenue = await query('SELECT SUM(total_amount) as total FROM orders WHERE payment_status = "paid"');
    
    // Get total users
    const totalUsers = await query('SELECT COUNT(*) as count FROM users WHERE role = "customer"');
    
    // Get total products
    const totalProducts = await query('SELECT COUNT(*) as count FROM products');
    
    // Get recent orders
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
    
    // Get low stock products
    const lowStockProducts = await query(`
      SELECT id, name, stock_quantity
      FROM products
      WHERE stock_quantity <= 10 AND is_available = TRUE
      ORDER BY stock_quantity ASC
      LIMIT 5
    `);

    // Get orders by status
    const ordersByStatus = await query(`
      SELECT status, COUNT(*) as count
      FROM orders
      GROUP BY status
    `);

    res.json({
      success: true,
      data: {
        stats: {
          total_orders: totalOrders[0].count,
          total_revenue: totalRevenue[0].total || 0,
          total_users: totalUsers[0].count,
          total_products: totalProducts[0].count
        },
        recent_orders: recentOrders,
        low_stock_products: lowStockProducts,
        orders_by_status: ordersByStatus
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error getting dashboard stats' 
    });
  }
});

// @desc    Get all orders (admin)
// @route   GET /api/admin/orders
// @access  Private (Admin)
router.get('/orders', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      payment_status,
      search 
    } = req.query;

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
      conditions.push('(o.order_number LIKE ? OR u.first_name LIKE ? OR u.last_name LIKE ? OR u.email LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Get orders
    const orders = await query(`
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
    `, [...params, parseInt(limit), offset]);

    // Get total count
    const countResult = await query(`
      SELECT COUNT(*) as total
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ${whereClause}
    `, params);

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          current_page: parseInt(page),
          total_pages: totalPages,
          total_items: total,
          items_per_page: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get admin orders error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error getting orders' 
    });
  }
});

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private (Admin)
router.put('/orders/:id/status', [
  body('status').isIn(['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled']).withMessage('Valid status is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { id } = req.params;
    const { status } = req.body;

    // Get order
    const orders = await query('SELECT id, status FROM orders WHERE id = ?', [id]);
    if (orders.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    // Update order status
    await query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);

    res.json({
      success: true,
      message: 'Order status updated successfully'
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error updating order status' 
    });
  }
});

// @desc    Get all users (admin)
// @route   GET /api/admin/users
// @access  Private (Admin)
router.get('/users', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      role,
      search 
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    let conditions = [];
    let params = [];

    if (role) {
      conditions.push('role = ?');
      params.push(role);
    }

    if (search) {
      conditions.push('(first_name LIKE ? OR last_name LIKE ? OR email LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Get users
    const users = await query(`
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
    `, [...params, parseInt(limit), offset]);

    // Get total count
    const countResult = await query(`
      SELECT COUNT(*) as total
      FROM users
      ${whereClause}
    `, params);

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          current_page: parseInt(page),
          total_pages: totalPages,
          total_items: total,
          items_per_page: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get admin users error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error getting users' 
    });
  }
});

// @desc    Update user status
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin)
router.put('/users/:id/status', [
  body('is_active').isBoolean().withMessage('is_active must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { id } = req.params;
    const { is_active } = req.body;

    // Update user status
    await query('UPDATE users SET is_active = ? WHERE id = ?', [is_active, id]);

    res.json({
      success: true,
      message: 'User status updated successfully'
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error updating user status' 
    });
  }
});

// @desc    Get contact messages
// @route   GET /api/admin/contact-messages
// @access  Private (Admin)
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

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Get contact messages
    const messages = await query(`
      SELECT 
        id,
        name,
        email,
        subject,
        message,
        is_read,
        created_at
      FROM contact_messages
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, parseInt(limit), offset]);

    // Get total count
    const countResult = await query(`
      SELECT COUNT(*) as total
      FROM contact_messages
      ${whereClause}
    `, params);

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: {
        messages,
        pagination: {
          current_page: parseInt(page),
          total_pages: totalPages,
          total_items: total,
          items_per_page: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get contact messages error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error getting contact messages' 
    });
  }
});

// @desc    Mark contact message as read
// @route   PUT /api/admin/contact-messages/:id/read
// @access  Private (Admin)
router.put('/contact-messages/:id/read', async (req, res) => {
  try {
    const { id } = req.params;

    await query('UPDATE contact_messages SET is_read = TRUE WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Message marked as read'
    });
  } catch (error) {
    console.error('Mark message as read error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error marking message as read' 
    });
  }
});

// @desc    Get product analytics
// @route   GET /api/admin/analytics/products
// @access  Private (Admin)
router.get('/analytics/products', async (req, res) => {
  try {
    // Get top selling products
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

    // Get low stock products
    const lowStockProducts = await query(`
      SELECT id, name, stock_quantity
      FROM products
      WHERE stock_quantity <= 10 AND is_available = TRUE
      ORDER BY stock_quantity ASC
    `);

    // Get category sales
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
        category_sales: categorySales
      }
    });
  } catch (error) {
    console.error('Get product analytics error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error getting product analytics' 
    });
  }
});

module.exports = router;