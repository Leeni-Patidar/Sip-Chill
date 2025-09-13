const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/database');
const { OAuth2Client } = require('google-auth-library');

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Auth middleware
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  const { first_name, last_name, email, password, role, address, phone } = req.body;

  try {
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Check if user already exists
    const existing = await query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user
    const result = await query(
      'INSERT INTO users (first_name, last_name, email, password, role, is_active, address, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [first_name, last_name, email, hashedPassword, role || 'customer', 1, address || null, phone || null]
    );

    const token = jwt.sign({ id: result.insertId }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({
      success: true,
      token,
      user: { id: result.insertId, first_name, last_name, email, role: role || 'customer', address: address || null, phone: phone || null }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const users = await query(
      'SELECT id, email, password, first_name, last_name, role, is_active, address, phone FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid user' });
    }

    const user = users[0];

    if (!user.is_active) {
      return res.status(401).json({ success: false, message: 'User account is deactivated' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid password' });
    }

    if (!user.role) {
      user.role = 'customer';
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        address: user.address,
        phone: user.phone
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Google login
// @route   POST /api/auth/google
// @access  Public
router.post('/google', async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, given_name, family_name } = payload;

    let users = await query(
      'SELECT id, email, first_name, last_name, role FROM users WHERE email = ?',
      [email]
    );

    let user;
    if (users.length === 0) {
      const result = await query(
        'INSERT INTO users (first_name, last_name, email, role, is_active) VALUES (?, ?, ?, ?, ?)',
        [given_name, family_name, email, 'customer', 1]
      );
      user = { id: result.insertId, email, first_name: given_name, last_name: family_name, role: 'customer' };
    } else {
      user = users[0];
    }

    const jwtToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.json({ success: true, token: jwtToken, user });
  } catch (err) {
    console.error('Google login error:', err);
    res.status(401).json({ success: false, message: 'Google login failed' });
  }
});

// @desc    Get logged in user
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const users = await query(
      'SELECT id, email, first_name, last_name, role, address, phone FROM users WHERE id = ?',
      [req.user.id]
    );
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json(users[0]);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Update profile
router.put('/update', authMiddleware, async (req, res) => {
  const { first_name, last_name, phone, address, password } = req.body;

  try {
    let queryStr = 'UPDATE users SET first_name = ?, last_name = ?, phone = ?, address = ?';
    const params = [first_name, last_name, phone, address];

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      queryStr += ', password = ?';
      params.push(hashedPassword);
    }

    queryStr += ' WHERE id = ?';
    params.push(req.user.id);

    await query(queryStr, params);

    const [updatedUser] = await query(
      'SELECT id, email, first_name, last_name, role, address, phone FROM users WHERE id = ?',
      [req.user.id]
    );

    res.json(updatedUser);
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
