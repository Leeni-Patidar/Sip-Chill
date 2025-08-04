const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    trim: true,
    maxlength: [100, 'Product name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a product description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a product price'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: [true, 'Please specify a category']
  },
  categoryName: {
    type: String,
    required: true
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    publicId: String,
    alt: String
  }],
  ingredients: [{
    type: String,
    trim: true
  }],
  nutritionInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    fiber: Number,
    sugar: Number
  },
  allergens: [{
    type: String,
    enum: ['nuts', 'dairy', 'gluten', 'soy', 'eggs', 'shellfish', 'none']
  }],
  dietaryTags: [{
    type: String,
    enum: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'keto', 'low-carb', 'organic']
  }],
  inStock: {
    type: Boolean,
    default: true
  },
  stockQuantity: {
    type: Number,
    default: 0,
    min: [0, 'Stock quantity cannot be negative']
  },
  featured: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot be more than 5']
  },
  numReviews: {
    type: Number,
    default: 0
  },
  reviews: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5']
    },
    comment: {
      type: String,
      required: true,
      maxlength: [500, 'Comment cannot be more than 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  preparationTime: {
    type: Number, // in minutes
    default: 10
  },
  availability: {
    isAvailable: {
      type: Boolean,
      default: true
    },
    availableHours: {
      start: {
        type: String,
        default: '06:00'
      },
      end: {
        type: String,
        default: '23:00'
      }
    },
    availableDays: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      default: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }]
  },
  tags: [{
    type: String,
    trim: true
  }],
  variants: [{
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    description: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for main image
productSchema.virtual('mainImage').get(function() {
  return this.images && this.images.length > 0 ? this.images[0].url : null;
});

// Virtual for average rating calculation
productSchema.virtual('averageRating').get(function() {
  if (this.reviews && this.reviews.length > 0) {
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round((sum / this.reviews.length) * 10) / 10;
  }
  return 0;
});

// Update rating and numReviews when reviews are modified
productSchema.pre('save', function(next) {
  if (this.isModified('reviews')) {
    this.numReviews = this.reviews.length;
    if (this.reviews.length > 0) {
      const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
      this.rating = Math.round((sum / this.reviews.length) * 10) / 10;
    } else {
      this.rating = 0;
    }
  }
  next();
});

// Indexes for better query performance
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ featured: 1 });
productSchema.index({ inStock: 1 });

// Static method to get featured products
productSchema.statics.getFeaturedProducts = function(limit = 8) {
  return this.find({ featured: true, isActive: true, inStock: true })
    .populate('category', 'name')
    .sort({ rating: -1, createdAt: -1 })
    .limit(limit);
};

// Static method to get products by category
productSchema.statics.getByCategory = function(categoryId, limit = 20) {
  return this.find({ 
    category: categoryId, 
    isActive: true, 
    inStock: true 
  })
    .populate('category', 'name')
    .sort({ rating: -1, createdAt: -1 })
    .limit(limit);
};

// Instance method to add review
productSchema.methods.addReview = function(userId, userName, rating, comment) {
  // Check if user already reviewed this product
  const existingReview = this.reviews.find(
    review => review.user.toString() === userId.toString()
  );

  if (existingReview) {
    throw new Error('You have already reviewed this product');
  }

  this.reviews.push({
    user: userId,
    name: userName,
    rating,
    comment
  });

  return this.save();
};

module.exports = mongoose.model('Product', productSchema);