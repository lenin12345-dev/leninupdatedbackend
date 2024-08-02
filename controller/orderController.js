const orderService = require("../services/orderService.js");
const User =  require('../models/user.js')
const userService=require("../services/userService.js");

const createOrder = async (req, res) => {
  const {userId} = req;
  
  try {
    const user = await userService.findUserById(userId);
    const createdOrder = await orderService.createOrder(user, req.body);
    return res.status(201).send(createdOrder);
  } catch (error) {
    console.error('Error in createOrder controller:', error.message);
    return res.status(500).send({ message: 'Failed to create order', error: error.message });
  }
};

const findOrderById = async (req, res) => {
const { id } = req.params;
  try {
    let order = await orderService.findOrderById(id);
    return res.status(201).json(order);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const orderHistory = async (req, res) => {
  const {userId} = req;
  try {
    let order = await orderService.usersOrderHistory(userId);
    return res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order history:', error.message);
    return res.status(500).json({ message: "Failed to retrieve order history", error: error.message });
  
  }
};

module.exports = { createOrder, findOrderById, orderHistory };
