const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  orderItems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'orderItems',
  }],
  orderDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  deliveryDate: {
    type: Date,
  },
  shippingAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'addresses',
    required: true,
  },
  paymentDetails: {
    
    paymentMethod: {
      type: String,
     
    },
    transactionId: {
      type: String,
    },
    paymentId:{
      type:String,
    },
    status:{
      type:String,
   
    }
    
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  totalDiscountedPrice: {
    type: Number,
    required: true,
  },
  discounte: {
    type: Number,
    required: true,
  },
  orderStatus: {
    type: String,
    required: true,
  },
  totalItem: {
    type: Number,
    required: true,
  },
},{ timestamps: true });

const Order = mongoose.model('orders', orderSchema);

module.exports = Order;
