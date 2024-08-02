const razorpay = require("../config/razorpayClient.js");
const orderService=require("./orderService.js");

const createPaymentLink= async (orderId)=>{

    try {
        
        const order = await orderService.findOrderById(orderId);
    // Constructs a request payload for creating a payment link.
        const paymentLinkRequest = {
          amount: order.totalPrice ,
          currency: 'INR',
          customer: {
            name:`${order.user.firstname} ${order.user.lastname}`,
            contact: order.user.mobile || '',
            email: order.user.email,
          },
          notify: {
            sms: true,
            email: true,
          },
          reminder_enable: true,
          callback_url: `https://leninecommerce.netlify.app/payment/${orderId}`,
          callback_method: 'get',
        };
        
        console.log(order)

    // Calls Razorpay’s paymentLink.create method to generate the payment link.
        const paymentLink = await razorpay.paymentLink.create(paymentLinkRequest);
        console.log(paymentLink)
        if (!paymentLink) {
          throw new Error('Payment link can not be created');
        }
    
        const paymentLinkId = paymentLink.id;
        const payment_link_url = paymentLink.short_url;
    
        // Return the payment link URL and ID in the response
        const resData = {
          paymentLinkId: paymentLinkId,
          payment_link_url,
        };
        return resData;
      } catch (error) {
        console.error('Error creating payment link:', error);
        throw new Error(error.description);
      }
}

const updatePaymentInformation=async(reqData)=>{
   const { payment_id: paymentId, order_id: orderId } = reqData;

  try {
    // Fetch order details (You will need to implement the 'orderService.findOrderById' function)
    const order = await orderService.findOrderById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }
    // Fetch the payment details using the payment ID
    const payment = await razorpay.payments.fetch(paymentId);
  

    if (payment.status === 'captured') {  
 // Update the order with payment details
      order.paymentDetails.paymentId=paymentId;
      order.paymentDetails.status='COMPLETED'; 
      order.orderStatus='PLACED';
      await order.save()
    }
    const resData = { message: 'Your order is placed', success: true };
    return resData
  } catch (error) {
    console.error('Error processing payment:', error);
    throw new Error(`Error processing payment: ${error.message}`);
  }
}

module.exports={createPaymentLink,updatePaymentInformation}