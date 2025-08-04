const express = require('express');
const { query } = require('../config/database');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Apply authentication to all routes
router.use(protect);

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', async (req, res) => {
  try {
    const users = await query(`
      SELECT 
        id,
        email,
        first_name,
        last_name,
        phone,
        address,
        role,
        created_at
      FROM users
      WHERE id = ?
    `, [req.user.id]);

    if (users.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      data: users[0]
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error getting user profile' 
    });
  }
});

// @desc    Get user order history
// @route   GET /api/users/orders
// @access  Private
router.get('/orders', async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let conditions = ['o.user_id = ?'];
    let params = [req.user.id];

    if (status) {
      conditions.push('o.status = ?');
      params.push(status);
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
        o.actual_delivery_time
      FROM orders o
      ${whereClause}
      ORDER BY o.created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, parseInt(limit), offset]);

    // Get total count
    const countResult = await query(`
      SELECT COUNT(*) as total
      FROM orders o
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
    console.error('Get user orders error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error getting user orders' 
    });
  }
});

// @desc    Get user order details
// @route   GET /api/users/orders/:id
// @access  Private
router.get('/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Get order details
    const orders = await query(`
      SELECT 
        o.id,
        o.order_number,
        o.total_amount,
        o.tax_amount,
        o.delivery_fee,
        o.status,
        o.payment_status,
        o.payment_method,
        o.delivery_address,
        o.contact_phone,
        o.special_instructions,
        o.created_at,
        o.estimated_delivery_time,
        o.actual_delivery_time
      FROM orders o
      WHERE o.id = ? AND o.user_id = ?
    `, [id, req.user.id]);

    if (orders.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    const order = orders[0];

    // Get order items
    const orderItems = await query(`
      SELECT 
        id,
        product_id,
        product_name,
        product_price,
        quantity,
        special_instructions
      FROM order_items
      WHERE order_id = ?
    `, [id]);

    res.json({
      success: true,
      data: {
        ...order,
        items: orderItems
      }
    });
  } catch (error) {
    console.error('Get user order error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error getting user order' 
    });
  }
});

// @desc    Get user favorites (wishlist)
// @route   GET /api/users/favorites
// @access  Private
router.get('/favorites', async (req, res) => {
  try {
    // For now, return empty favorites (can be extended with a favorites table)
    res.json({
      success: true,
      data: {
        favorites: []
      }
    });
  } catch (error) {
    console.error('Get user favorites error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error getting user favorites' 
    });
  }
});

// @desc    Get user reviews
// @route   GET /api/users/reviews
// @access  Private
router.get('/reviews', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Get user reviews
    const reviews = await query(`
      SELECT 
        r.id,
        r.rating,
        r.comment,
        r.created_at,
        p.id as product_id,
        p.name as product_name,
        p.image_url as product_image
      FROM reviews r
      JOIN products p ON r.product_id = p.id
      WHERE r.user_id = ?
      ORDER BY r.created_at DESC
      LIMIT ? OFFSET ?
    `, [req.user.id, parseInt(limit), offset]);

    // Get total count
    const countResult = await query(`
      SELECT COUNT(*) as total
      FROM reviews
      WHERE user_id = ?
    `, [req.user.id]);

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          current_page: parseInt(page),
          total_pages: totalPages,
          total_items: total,
          items_per_page: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error getting user reviews' 
    });
  }
});

// @desc    Add product review
// @route   POST /api/users/reviews
// @access  Private
router.post('/reviews', async (req, res) => {
  try {
    const { product_id, order_id, rating, comment } = req.body;

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ 
        success: false, 
        message: 'Rating must be between 1 and 5' 
      });
    }

    // Check if user has ordered this product
    if (order_id) {
      const orderItems = await query(`
        SELECT oi.id
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.id
        WHERE o.id = ? AND o.user_id = ? AND oi.product_id = ?
      `, [order_id, req.user.id, product_id]);

      if (orderItems.length === 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'You can only review products you have ordered' 
        });
      }
    }

    // Check if user already reviewed this product
    const existingReviews = await query(`
      SELECT id FROM reviews 
      WHERE user_id = ? AND product_id = ?
    `, [req.user.id, product_id]);

    if (existingReviews.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'You have already reviewed this product' 
      });
    }

    // Add review
    await query(`
      INSERT INTO reviews (user_id, product_id, order_id, rating, comment, is_verified)
      VALUES (?, ?, ?, ?, ?, TRUE)
    `, [req.user.id, product_id, order_id, rating, comment]);

    res.status(201).json({
      success: true,
      message: 'Review added successfully'
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error adding review' 
    });
  }
});

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private
router.get('/stats', async (req, res) => {
  try {
    // Get total orders
    const totalOrders = await query(`
      SELECT COUNT(*) as count
      FROM orders
      WHERE user_id = ?
    `, [req.user.id]);

    // Get total spent
    const totalSpent = await query(`
      SELECT SUM(total_amount) as total
      FROM orders
      WHERE user_id = ? AND payment_status = 'paid'
    `, [req.user.id]);

    // Get favorite category (most ordered)
    const favoriteCategory = await query(`
      SELECT 
        c.name as category_name,
        COUNT(oi.id) as order_count
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      JOIN categories c ON p.category_id = c.id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.user_id = ?
      GROUP BY c.id
      ORDER BY order_count DESC
      LIMIT 1
    `, [req.user.id]);

    // Get recent activity
    const recentActivity = await query(`
      SELECT 
        'order' as type,
        o.order_number as reference,
        o.created_at as date,
        o.total_amount as amount
      FROM orders o
      WHERE o.user_id = ?
      UNION ALL
      SELECT 
        'review' as type,
        p.name as reference,
        r.created_at as date,
        r.rating as amount
      FROM reviews r
      JOIN products p ON r.product_id = p.id
      WHERE r.user_id = ?
      ORDER BY date DESC
      LIMIT 10
    `, [req.user.id, req.user.id]);

    res.json({
      success: true,
      data: {
        total_orders: totalOrders[0].count,
        total_spent: totalSpent[0].total || 0,
        favorite_category: favoriteCategory[0]?.category_name || 'None',
        recent_activity: recentActivity
      }
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error getting user statistics' 
    });
  }
});

module.exports = router;