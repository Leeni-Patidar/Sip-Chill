const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../config/database');
const nodemailer = require('nodemailer');

const router = express.Router();

// Setup nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Utility function to send email
async function sendContactNotification({ name, email, subject, message }) {
  const mailOptions = {
    from: `"Sip & Chill Contact" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: `New Contact Form Submission: ${subject}`,
    text: `You have received a new message from the contact form.\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`,
    html: `<h3>New Contact Form Submission</h3>
           <p><strong>Name:</strong> ${name}</p>
           <p><strong>Email:</strong> ${email}</p>
           <p><strong>Subject:</strong> ${subject}</p>
           <p><strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}</p>`
  };
  return transporter.sendMail(mailOptions);
}

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required').isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('subject').notEmpty().withMessage('Subject is required').isLength({ min: 5 }).withMessage('Subject must be at least 5 characters'),
    body('message').notEmpty().withMessage('Message is required').isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { name, email, subject, message } = req.body;

      // Save contact message in DB
      await query(
        `INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)`,
        [name, email, subject, message]
      );

      // Send email notification
      try {
        await sendContactNotification({ name, email, subject, message });
      } catch (emailError) {
        console.error('Failed to send contact notification email:', emailError);
      }

      res.status(201).json({
        success: true,
        message: 'Thank you for your message! We will get back to you soon.',
      });
    } catch (error) {
      console.error('Submit contact error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error submitting contact form',
      });
    }
  }
);

// @desc    Get contact information
// @route   GET /api/contact/info
// @access  Public
router.get('/info', async (req, res) => {
  try {
    const contactInfo = {
      name: 'Sip & Chill Café',
      address: '123 Coffee Street, Brew City, BC 12345',
      phone: '1 (555) 123-4567',
      email: 'info@sipchill.com',
      hours: {
        monday: '7:00 AM - 8:00 PM',
        tuesday: '7:00 AM - 8:00 PM',
        wednesday: '7:00 AM - 8:00 PM',
        thursday: '7:00 AM - 8:00 PM',
        friday: '7:00 AM - 9:00 PM',
        saturday: '8:00 AM - 9:00 PM',
        sunday: '8:00 AM - 6:00 PM',
      },
      social_media: {
        facebook: 'https://facebook.com/sipchill',
        instagram: 'https://instagram.com/sipchill',
        twitter: 'https://twitter.com/sipchill',
      },
    };

    res.json({ success: true, data: contactInfo });
  } catch (error) {
    console.error('Get contact info error:', error);
    res.status(500).json({ success: false, message: 'Server error getting contact information' });
  }
});

// @desc    Get café hours
// @route   GET /api/contact/hours
// @access  Public
router.get('/hours', (req, res) => {
  const hours = {
    monday: { open: '07:00', close: '20:00', closed: false },
    tuesday: { open: '07:00', close: '20:00', closed: false },
    wednesday: { open: '07:00', close: '20:00', closed: false },
    thursday: { open: '07:00', close: '20:00', closed: false },
    friday: { open: '07:00', close: '21:00', closed: false },
    saturday: { open: '08:00', close: '21:00', closed: false },
    sunday: { open: '08:00', close: '18:00', closed: false },
  };

  res.json({ success: true, data: hours });
});

// @desc    Check if café is currently open
// @route   GET /api/contact/is-open
// @access  Public
router.get('/is-open', (req, res) => {
  try {
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const currentTime = now.toTimeString().slice(0, 5);

    const hours = {
      monday: { open: '07:00', close: '20:00', closed: false },
      tuesday: { open: '07:00', close: '20:00', closed: false },
      wednesday: { open: '07:00', close: '20:00', closed: false },
      thursday: { open: '07:00', close: '20:00', closed: false },
      friday: { open: '07:00', close: '21:00', closed: false },
      saturday: { open: '08:00', close: '21:00', closed: false },
      sunday: { open: '08:00', close: '18:00', closed: false },
    };

    const todayHours = hours[currentDay];
    let isOpen = false;

    if (todayHours && !todayHours.closed) {
      isOpen = currentTime >= todayHours.open && currentTime <= todayHours.close;
    }

    res.json({
      success: true,
      data: { is_open: isOpen, current_time: currentTime, current_day: currentDay, today_hours: todayHours },
    });
  } catch (error) {
    console.error('Check if open error:', error);
    res.status(500).json({ success: false, message: 'Server error checking café status' });
  }
});

module.exports = router;
