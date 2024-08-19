const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    index: true,
  },
  description: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
    
  },
  discountedPrice: {
    type: Number,
    default: function() {
      return this.price;
    },
    min: 0,
  },
  discountPersent: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  brand: {
    type: String,
    trim: true,
  },
  color: {
    type: String,
    trim: true,
  },
  sizes: [{
    name: {
      type: String,
      trim: true,
    },
    quantity: {
      type: Number,
      min: 0,
    }
  }], 
  imageUrl: {
    type: String,
    trim: true,
  },
  ratings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ratings',
    },
  ], 
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'reviews',
    },
  ], 
  numRatings: {
    type: Number,
    default: 0,
  },
  averageRating: {
    type: Number,
    default: 0,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'categories',
  }, 
}, 
{ timestamps: true });

const Product = mongoose.model('products', productSchema);

module.exports = Product;
