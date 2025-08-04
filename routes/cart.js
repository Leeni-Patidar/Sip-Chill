const express = require('express');
const { body, validationResult } = require('express-validator');
const { query, transaction } = require('../config/database');
const { protect, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Helper function to get or create cart
const getOrCreateCart = async (userId, sessionId) => {
  let cart;
  
  if (userId) {
    // User is logged in, get their cart
    const carts = await query('SELECT * FROM cart WHERE user_id = ?', [userId]);
    if (carts.length > 0) {
      cart = carts[0];
    } else {
      // Create new cart for user
      const result = await query('INSERT INTO cart (user_id) VALUES (?)', [userId]);
      cart = { id: result.insertId, user_id: userId };
    }
  } else if (sessionId) {
    // Guest user with session ID
    const carts = await query('SELECT * FROM cart WHERE session_id = ?', [sessionId]);
    if (carts.length > 0) {
      cart = carts[0];
    } else {
      // Create new cart for session
      const result = await query('INSERT INTO cart (session_id) VALUES (?)', [sessionId]);
      cart = { id: result.insertId, session_id: sessionId };
    }
  } else {
    // No user or session, create new session cart
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const result = await query('INSERT INTO cart (session_id) VALUES (?)', [sessionId]);
    cart = { id: result.insertId, session_id: sessionId };
  }
  
  return cart;
};

// @desc    Get cart
// @route   GET /api/cart
// @access  Private/Public (optional auth)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const userId = req.user?.id;
    const sessionId = req.headers['x-session-id'];

    if (!userId && !sessionId) {
      return res.json({
        success: true,
        data: {
          items: [],
          total: 0,
          item_count: 0
        }
      });
    }

    const cart = await getOrCreateCart(userId, sessionId);

    // Get cart items with product details
    const items = await query(`
      SELECT 
        ci.id,
        ci.quantity,
        ci.special_instructions,
        ci.created_at,
        p.id as product_id,
        p.name,
        p.description,
        p.price,
        p.image_url,
        p.stock_quantity,
        c.name as category_name
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE ci.cart_id = ? AND p.is_available = TRUE
      ORDER BY ci.created_at DESC
    `, [cart.id]);

    // Calculate totals
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    res.json({
      success: true,
      data: {
        cart_id: cart.id,
        session_id: cart.session_id,
        items,
        total: Math.round(total * 100) / 100,
        item_count: itemCount
      }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error getting cart' 
    });
  }
});

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private/Public (optional auth)
router.post('/add', optionalAuth, [
  body('product_id').isInt().withMessage('Valid product ID is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('special_instructions').optional().isString().withMessage('Special instructions must be a string')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { product_id, quantity, special_instructions } = req.body;
    const userId = req.user?.id;
    const sessionId = req.headers['x-session-id'];

    if (!userId && !sessionId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Session ID required for guest users' 
      });
    }

    // Check if product exists and is available
    const products = await query(`
      SELECT id, name, price, stock_quantity, is_available 
      FROM products 
      WHERE id = ?
    `, [product_id]);

    if (products.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    const product = products[0];
    if (!product.is_available) {
      return res.status(400).json({ 
        success: false, 
        message: 'Product is not available' 
      });
    }

    if (product.stock_quantity < quantity) {
      return res.status(400).json({ 
        success: false, 
        message: `Only ${product.stock_quantity} items available in stock` 
      });
    }

    const cart = await getOrCreateCart(userId, sessionId);

    // Check if item already exists in cart
    const existingItems = await query(`
      SELECT id, quantity 
      FROM cart_items 
      WHERE cart_id = ? AND product_id = ?
    `, [cart.id, product_id]);

    if (existingItems.length > 0) {
      // Update existing item quantity
      const newQuantity = existingItems[0].quantity + quantity;
      await query(`
        UPDATE cart_items 
        SET quantity = ?, special_instructions = COALESCE(?, special_instructions)
        WHERE id = ?
      `, [newQuantity, special_instructions, existingItems[0].id]);
    } else {
      // Add new item to cart
      await query(`
        INSERT INTO cart_items (cart_id, product_id, quantity, special_instructions)
        VALUES (?, ?, ?, ?)
      `, [cart.id, product_id, quantity, special_instructions]);
    }

    res.json({
      success: true,
      message: 'Item added to cart successfully'
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error adding item to cart' 
    });
  }
});

// @desc    Update cart item
// @route   PUT /api/cart/update/:itemId
// @access  Private/Public (optional auth)
router.put('/update/:itemId', optionalAuth, [
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('special_instructions').optional().isString().withMessage('Special instructions must be a string')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { itemId } = req.params;
    const { quantity, special_instructions } = req.body;
    const userId = req.user?.id;
    const sessionId = req.headers['x-session-id'];

    // Get cart item
    const cartItems = await query(`
      SELECT ci.*, p.stock_quantity, p.is_available
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.id = ?
    `, [itemId]);

    if (cartItems.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Cart item not found' 
      });
    }

    const cartItem = cartItems[0];

    // Verify cart ownership
    const carts = await query('SELECT user_id, session_id FROM cart WHERE id = ?', [cartItem.cart_id]);
    const cart = carts[0];

    if ((userId && cart.user_id !== userId) || (!userId && cart.session_id !== sessionId)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to modify this cart' 
      });
    }

    // Check stock availability
    if (!cartItem.is_available) {
      return res.status(400).json({ 
        success: false, 
        message: 'Product is not available' 
      });
    }

    if (cartItem.stock_quantity < quantity) {
      return res.status(400).json({ 
        success: false, 
        message: `Only ${cartItem.stock_quantity} items available in stock` 
      });
    }

    // Update cart item
    await query(`
      UPDATE cart_items 
      SET quantity = ?, special_instructions = ?
      WHERE id = ?
    `, [quantity, special_instructions, itemId]);

    res.json({
      success: true,
      message: 'Cart item updated successfully'
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error updating cart item' 
    });
  }
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:itemId
// @access  Private/Public (optional auth)
router.delete('/remove/:itemId', optionalAuth, async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user?.id;
    const sessionId = req.headers['x-session-id'];

    // Get cart item
    const cartItems = await query('SELECT cart_id FROM cart_items WHERE id = ?', [itemId]);

    if (cartItems.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Cart item not found' 
      });
    }

    const cartItem = cartItems[0];

    // Verify cart ownership
    const carts = await query('SELECT user_id, session_id FROM cart WHERE id = ?', [cartItem.cart_id]);
    const cart = carts[0];

    if ((userId && cart.user_id !== userId) || (!userId && cart.session_id !== sessionId)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to modify this cart' 
      });
    }

    // Remove item
    await query('DELETE FROM cart_items WHERE id = ?', [itemId]);

    res.json({
      success: true,
      message: 'Item removed from cart successfully'
    });
  } catch (error) {
    console.error('Remove cart item error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error removing item from cart' 
    });
  }
});

// @desc    Clear cart
// @route   DELETE /api/cart/clear
// @access  Private/Public (optional auth)
router.delete('/clear', optionalAuth, async (req, res) => {
  try {
    const userId = req.user?.id;
    const sessionId = req.headers['x-session-id'];

    if (!userId && !sessionId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Session ID required for guest users' 
      });
    }

    const cart = await getOrCreateCart(userId, sessionId);

    // Clear all items from cart
    await query('DELETE FROM cart_items WHERE cart_id = ?', [cart.id]);

    res.json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error clearing cart' 
    });
  }
});

// @desc    Merge guest cart with user cart (after login)
// @route   POST /api/cart/merge
// @access  Private
router.post('/merge', protect, async (req, res) => {
  try {
    const { session_id } = req.body;

    if (!session_id) {
      return res.status(400).json({ 
        success: false, 
        message: 'Session ID is required' 
      });
    }

    // Get guest cart
    const guestCarts = await query('SELECT id FROM cart WHERE session_id = ?', [session_id]);
    if (guestCarts.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Guest cart not found' 
      });
    }

    const guestCart = guestCarts[0];

    // Get or create user cart
    const userCarts = await query('SELECT id FROM cart WHERE user_id = ?', [req.user.id]);
    let userCart;
    
    if (userCarts.length > 0) {
      userCart = userCarts[0];
    } else {
      const result = await query('INSERT INTO cart (user_id) VALUES (?)', [req.user.id]);
      userCart = { id: result.insertId };
    }

    // Merge items from guest cart to user cart
    await query(`
      INSERT INTO cart_items (cart_id, product_id, quantity, special_instructions)
      SELECT ?, product_id, quantity, special_instructions
      FROM cart_items
      WHERE cart_id = ?
      ON DUPLICATE KEY UPDATE
        quantity = cart_items.quantity + VALUES(quantity),
        special_instructions = COALESCE(VALUES(special_instructions), cart_items.special_instructions)
    `, [userCart.id, guestCart.id]);

    // Delete guest cart
    await query('DELETE FROM cart WHERE id = ?', [guestCart.id]);

    res.json({
      success: true,
      message: 'Cart merged successfully'
    });
  } catch (error) {
    console.error('Merge cart error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error merging cart' 
    });
  }
});

module.exports = router;