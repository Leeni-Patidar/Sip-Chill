const { body, param, query, validationResult } = require('express-validator');

// Handle validation results
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().reduce((acc, error) => {
        acc[error.path] = error.msg;
        return acc;
      }, {})
    });
  }
  next();
};

// User validation rules
const validateRegister = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  
  handleValidationErrors
];

const validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

const validateUpdateProfile = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  
  body('address.street')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Street address cannot exceed 100 characters'),
  
  body('address.city')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('City cannot exceed 50 characters'),
  
  body('address.state')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('State cannot exceed 50 characters'),
  
  body('address.zipCode')
    .optional()
    .isPostalCode('any')
    .withMessage('Please provide a valid postal code'),
  
  handleValidationErrors
];

// Product validation rules
const validateProduct = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Product name must be between 2 and 100 characters'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Product description is required')
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isMongoId()
    .withMessage('Invalid category ID'),
  
  body('ingredients')
    .optional()
    .isArray()
    .withMessage('Ingredients must be an array'),
  
  body('ingredients.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Each ingredient must be between 1 and 50 characters'),
  
  body('preparationTime')
    .optional()
    .isInt({ min: 1, max: 180 })
    .withMessage('Preparation time must be between 1 and 180 minutes'),
  
  handleValidationErrors
];

// Category validation rules
const validateCategory = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Category name must be between 2 and 50 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Description cannot exceed 200 characters'),
  
  body('icon')
    .optional()
    .trim()
    .isLength({ min: 1, max: 10 })
    .withMessage('Icon must be between 1 and 10 characters'),
  
  body('color')
    .optional()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage('Color must be a valid hex color code'),
  
  handleValidationErrors
];

// Order validation rules
const validateOrder = [
  body('orderItems')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),
  
  body('orderItems.*.product')
    .isMongoId()
    .withMessage('Invalid product ID'),
  
  body('orderItems.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  
  body('orderItems.*.price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('customerInfo.name')
    .trim()
    .notEmpty()
    .withMessage('Customer name is required'),
  
  body('customerInfo.email')
    .trim()
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  
  body('customerInfo.phone')
    .isMobilePhone()
    .withMessage('Valid phone number is required'),
  
  body('shippingAddress.street')
    .trim()
    .notEmpty()
    .withMessage('Street address is required'),
  
  body('shippingAddress.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  
  body('shippingAddress.state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),
  
  body('shippingAddress.zipCode')
    .isPostalCode('any')
    .withMessage('Valid postal code is required'),
  
  body('paymentInfo.method')
    .isIn(['cash', 'card', 'upi', 'wallet'])
    .withMessage('Invalid payment method'),
  
  body('orderType')
    .optional()
    .isIn(['delivery', 'pickup', 'dine-in'])
    .withMessage('Invalid order type'),
  
  handleValidationErrors
];

// Contact form validation
const validateContact = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  
  body('subject')
    .trim()
    .notEmpty()
    .withMessage('Subject is required')
    .isLength({ min: 5, max: 100 })
    .withMessage('Subject must be between 5 and 100 characters'),
  
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters'),
  
  handleValidationErrors
];

// Review validation
const validateReview = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  
  body('comment')
    .trim()
    .notEmpty()
    .withMessage('Comment is required')
    .isLength({ min: 10, max: 500 })
    .withMessage('Comment must be between 10 and 500 characters'),
  
  handleValidationErrors
];

// Parameter validation
const validateMongoId = (paramName = 'id') => [
  param(paramName)
    .isMongoId()
    .withMessage(`Invalid ${paramName}`),
  handleValidationErrors
];

// Query validation
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('sort')
    .optional()
    .isIn(['createdAt', '-createdAt', 'price', '-price', 'rating', '-rating', 'name', '-name'])
    .withMessage('Invalid sort parameter'),
  
  handleValidationErrors
];

const validateSearch = [
  query('q')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters'),
  
  query('category')
    .optional()
    .isMongoId()
    .withMessage('Invalid category ID'),
  
  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be a positive number'),
  
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum price must be a positive number'),
  
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateRegister,
  validateLogin,
  validateUpdateProfile,
  validateProduct,
  validateCategory,
  validateOrder,
  validateContact,
  validateReview,
  validateMongoId,
  validatePagination,
  validateSearch
};