const Razorpay = require('razorpay');


const API_KEY=process.env.API_KEY
const API_SECRET=process.env.API_SECRET


const razorpay = new Razorpay({
    key_id: "rzp_test_jxsFbzrL5hc5Lj",
    key_secret: "qvtlgP35DY0jSGkJz6lfX8z",
  });

  console.log("API_KEY:", API_KEY); 
  module.exports=razorpay;