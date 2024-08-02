const mongoose = require('mongoose');
// The CartItem schema represents an individual item within a cart. 
// Each item is associated with a specific product and user.

const cartItemSchema = new mongoose.Schema({
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'cart',
    required: true,
    index: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'products',
    required: true,
    index: true, 
  },
  size: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
    min: [1, 'Quantity cannot be less than 1'],
  },
  price: {
    type: Number,
    required: true,
  },
  discountedPrice: {
    type: Number,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
}, {
  timestamps: true,  // Automatically adds createdAt and updatedAt fields
});

const CartItem = mongoose.model('cartItems', cartItemSchema);

module.exports = CartItem;
