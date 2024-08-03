const Razorpay = require('razorpay');


const API_KEY=process.env.API_KEY
const API_SECRET=process.env.API_SECRET


const razorpay = new Razorpay({
    key_id:API_KEY,
    key_secret: API_SECRET,
  });


  module.exports=razorpay;