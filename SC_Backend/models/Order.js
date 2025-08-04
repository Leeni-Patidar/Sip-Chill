const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Order must belong to a user']
  },
  orderItems: [{
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1']
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative']
    },
    image: String,
    variant: {
      name: String,
      price: Number
    }
  }],
  customerInfo: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    }
  },
  shippingAddress: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true,
      default: 'India'
    },
    landmark: String,
    instructions: String
  },
  paymentInfo: {
    method: {
      type: String,
      required: true,
      enum: ['cash', 'card', 'upi', 'wallet'],
      default: 'cash'
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    paidAt: Date
  },
  orderType: {
    type: String,
    enum: ['delivery', 'pickup', 'dine-in'],
    default: 'delivery'
  },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  discountAmount: {
    type: Number,
    default: 0.0
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  status: {
    type: String,
    enum: ['confirmed', 'preparing', 'ready', 'out-for-delivery', 'delivered', 'cancelled'],
    default: 'confirmed'
  },
  statusHistory: [{
    status: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String,
    updatedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  }],
  estimatedDeliveryTime: {
    type: Date
  },
  actualDeliveryTime: {
    type: Date
  },
  preparationTime: {
    type: Number, // in minutes
    default: 30
  },
  specialInstructions: {
    type: String,
    maxlength: [500, 'Special instructions cannot be more than 500 characters']
  },
  couponCode: {
    type: String,
    trim: true
  },
  isGift: {
    type: Boolean,
    default: false
  },
  giftMessage: {
    type: String,
    maxlength: [200, 'Gift message cannot be more than 200 characters']
  },
  rating: {
    rating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5']
    },
    comment: {
      type: String,
      maxlength: [500, 'Comment cannot be more than 500 characters']
    },
    ratedAt: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for total items count
orderSchema.virtual('totalItems').get(function() {
  return this.orderItems.reduce((total, item) => total + item.quantity, 0);
});

// Virtual for order age
orderSchema.virtual('orderAge').get(function() {
  const now = new Date();
  const created = new Date(this.createdAt);
  const diffTime = Math.abs(now - created);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Pre-save middleware to generate order number
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    // Find the last order of the day
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    
    const lastOrder = await this.constructor.findOne({
      createdAt: { $gte: startOfDay, $lt: endOfDay }
    }).sort({ createdAt: -1 });
    
    let sequence = 1;
    if (lastOrder && lastOrder.orderNumber) {
      const lastSequence = parseInt(lastOrder.orderNumber.slice(-3));
      sequence = lastSequence + 1;
    }
    
    this.orderNumber = `SC${year}${month}${day}${sequence.toString().padStart(3, '0')}`;
  }
  next();
});

// Pre-save middleware to add status to history
orderSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date()
    });
  }
  next();
});

// Pre-save middleware to calculate estimated delivery time
orderSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('preparationTime')) {
    const now = new Date();
    this.estimatedDeliveryTime = new Date(now.getTime() + (this.preparationTime * 60000));
  }
  next();
});

// Indexes for better query performance
orderSchema.index({ user: 1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'customerInfo.email': 1 });
orderSchema.index({ 'customerInfo.phone': 1 });

// Static method to get orders by status
orderSchema.statics.getOrdersByStatus = function(status) {
  return this.find({ status })
    .populate('user', 'name email')
    .populate('orderItems.product', 'name images')
    .sort({ createdAt: -1 });
};

// Static method to get user orders
orderSchema.statics.getUserOrders = function(userId, limit = 10) {
  return this.find({ user: userId, isActive: true })
    .populate('orderItems.product', 'name images')
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to get order statistics
orderSchema.statics.getOrderStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$totalPrice' },
        averageOrderValue: { $avg: '$totalPrice' },
        statusDistribution: {
          $push: '$status'
        }
      }
    }
  ]);

  return stats[0] || {
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    statusDistribution: []
  };
};

// Instance method to update status
orderSchema.methods.updateStatus = function(newStatus, note, updatedBy) {
  this.status = newStatus;
  
  if (newStatus === 'delivered') {
    this.actualDeliveryTime = new Date();
    this.paymentInfo.status = 'paid';
    this.paymentInfo.paidAt = new Date();
  }
  
  this.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    note,
    updatedBy
  });
  
  return this.save();
};

// Instance method to add rating
orderSchema.methods.addRating = function(rating, comment) {
  if (this.status !== 'delivered') {
    throw new Error('Order must be delivered to add rating');
  }
  
  this.rating = {
    rating,
    comment,
    ratedAt: new Date()
  };
  
  return this.save();
};

module.exports = mongoose.model('Order', orderSchema);