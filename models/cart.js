const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
    index: true,  // Adding index  can improve query performance, especially on the user field
  },
  cartItems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'cartItems',
    required: true,
  }],
  totalPrice: {
    type: Number,
    required: true,
    default:0
  },
  totalItem: {
    type: Number,
    required: true,
    default:0
  },
  totalDiscountedPrice: {
    type: Number,
    required: true,
    default:0
  },
  discounte: {
    type: Number,
    required: true,
    default:0
  },
},{
  timestamps: true,  // Automatically adds createdAt and updatedAt fields
});

const Cart = mongoose.model('cart', cartSchema);

module.exports = Cart;
