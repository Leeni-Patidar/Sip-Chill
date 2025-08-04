const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a category name'],
    unique: true,
    trim: true,
    maxlength: [50, 'Category name cannot be more than 50 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    maxlength: [200, 'Description cannot be more than 200 characters']
  },
  icon: {
    type: String,
    default: '🍽️'
  },
  image: {
    url: String,
    publicId: String,
    alt: String
  },
  color: {
    type: String,
    default: '#d97706' // Amber color
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
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

// Virtual for product count
categorySchema.virtual('productCount', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category',
  count: true
});

// Virtual for products
categorySchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category'
});

// Pre-save middleware to generate slug
categorySchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }
  next();
});

// Index for better query performance
categorySchema.index({ name: 1 });
categorySchema.index({ slug: 1 });
categorySchema.index({ isActive: 1 });
categorySchema.index({ sortOrder: 1 });

// Static method to get active categories with product count
categorySchema.statics.getActiveCategories = function() {
  return this.find({ isActive: true })
    .populate('productCount')
    .sort({ sortOrder: 1, name: 1 });
};

// Static method to get category with products
categorySchema.statics.getCategoryWithProducts = function(slug) {
  return this.findOne({ slug, isActive: true })
    .populate({
      path: 'products',
      match: { isActive: true, inStock: true },
      select: 'name price images rating numReviews featured',
      options: { sort: { featured: -1, rating: -1 } }
    });
};

module.exports = mongoose.model('Category', categorySchema);