const Address = require("../models/address.js");
const Order = require("../models/order.js");
const OrderItem = require("../models/orderItems.js");
const cartService = require("./cartService.js");

 const createOrder=async(user, shippAddress)=> {
  let address;
  try {
  // If the _id exists, it means the address already exists in the database
  if (shippAddress._id) {
    let existedAddress = await Address.findById(shippAddress._id);
    if (!existedAddress) {
      throw new Error("Address not found");
    }
    address = existedAddress;
  } else {
    address = new Address(shippAddress);
    address.user = user;
    await address.save();
    await user.save();
  }
 // Fetch the user's cart
  const {cart} = await cartService.findUserCart(user._id);

  // Create order items
  const orderItems = [];
  for (const item of cart.cartItems) {
    const orderItem = new OrderItem({
      price: item.price,
      product: item.product,
      quantity: item.quantity,
      size: item.size,
      userId: item.userId,
      discountedPrice: item.discountedPrice,
    });

    const createdOrderItem = await orderItem.save();
    orderItems.push(createdOrderItem);
  }

    // Create the order
  const createdOrder = new Order({
    user,
    orderItems,
    totalPrice: cart.totalPrice,
    totalDiscountedPrice: cart.totalDiscountedPrice,
    discounte: cart.discounte,
    totalItem: cart.totalItem,
    shippingAddress: address,
    orderDate: new Date(),
    orderStatus: "PENDING", // Assuming OrderStatus is a string enum or a valid string value
    paymentDetails:{
      status:"PENDING"
    } , // Assuming PaymentStatus is nested under 'paymentDetails'
  });

  // Save the order
  const savedOrder = await createdOrder.save();
  return savedOrder;

}catch (error) {
  console.error('Error creating order:', error.message);
  throw new Error('Failed to create order');
}
}

const placedOrder=async(orderId)=> {
  const order = await findOrderById(orderId);
  order.orderStatus = "PLACED";
  order.paymentDetails.status = "COMPLETED";
  return await order.save();
}

const confirmedOrder=async(orderId)=> {
  const order = await findOrderById(orderId);
  order.orderStatus = "CONFIRMED";
  return await order.save();
}

const shipOrder=async(orderId)=> {
  const order = await findOrderById(orderId);
  order.orderStatus = "SHIPPED";
  return await order.save();
}

const deliveredOrder=async(orderId)=> {
  const order = await findOrderById(orderId);
  order.orderStatus = "DELIVERED";
  return await order.save();
}

const cancelledOrder=async(orderId)=> {
  const order = await findOrderById(orderId);
  order.orderStatus = "CANCELLED"; // Assuming OrderStatus is a string enum or a valid string value
  return await order.save();
}

const findOrderById=async(orderId)=> {
  
  try{
    const order = await Order.findById(orderId)
    .populate("user")
    .populate({path:"orderItems", populate:{path:"product"}})
    .populate("shippingAddress");
    
    if (!order) {
      throw new Error("Order not found");
    }
  
  return order;
  }catch (error) {
    console.error('Error finding order by ID:', error.message);
    throw new Error('Error finding order by ID'); 
  }

}

const usersOrderHistory=async(userId)=> {
  try {
    const orders = await Order.find({
      user: userId,
      orderStatus: "PLACED",
    })
      .populate({      
        path: "orderItems",         //populates the orderItems field of the orders
        populate: {
          path: "product",          //further populates the product field inside each orderItem
        },
      })
      .lean();          // result to a plain JavaScript object using .lean() and returns it.


    return orders;
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    throw new Error(error.message); 
  }
}

async function getAllOrders() {
  return await Order.find().populate({
    path: "orderItems",
    populate: {
      path: "product",
    },
  })
  .lean();;
}

async function deleteOrder(orderId) {
  const order = await findOrderById(orderId);
  await Order.findByIdAndDelete(orderId);
  return { success: true, order };

 
}

module.exports = {
  createOrder,
  placedOrder,
  confirmedOrder,
  shipOrder,
  deliveredOrder,
  cancelledOrder,
  findOrderById,
  usersOrderHistory,
  getAllOrders,
  deleteOrder,
};
