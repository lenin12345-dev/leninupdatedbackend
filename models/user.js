const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        trim: true,
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
    },
    username:{
      type: String,
      trim:true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6 
    },
    role: {
        type: String,
        required:true,
        default:"CUSTOMER"
      },
      mobile: {
        type: String,
        unique: true, 
        sparse: true 
    },
    addresses: [
        {
            // a field that stores a reference to another document. This is particularly useful for creating relationships between different collections.
            type: mongoose.Schema.Types.ObjectId, 
            ref: "addresses",
        },
      ], 
      paymentInformation: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "payment_information",
        },
      ],
      ratings: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ratings",
        },
      ], 
      reviews: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "reviews",
        },
      ],
},
{ timestamps: true }   // Automatically adds createdAt and updatedAt fields
);

const User = mongoose.model('user', userSchema);

module.exports = User;
