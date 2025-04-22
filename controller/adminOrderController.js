
const orderService = require("../services/orderService");

const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await orderService.getAllOrders({ page, limit });

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


const confirmedOrder = (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = orderService.confirmedOrder(orderId);
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const shippOrder = (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = orderService.shipOrder(orderId);
    return res.status(201).send(order);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deliverOrder = (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = orderService.deliveredOrder(orderId);
    return res.status(201).send(order);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const cancelledOrder = (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = orderService.cancelledOrder(orderId);
    return res.status(202).send(order);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteOrder = (req, res) => {
  try {
    const orderId = req.params.orderId;
    const result = orderService.deleteOrder(orderId);
    
    if (result.success) {
      res.status(201).json({ message: "Order Deleted Successfully", status: true });
    } else {
      res.status(404).json({ message: '"Error in deleting order"', status: false });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



module.exports = {
  getAllOrders,
  confirmedOrder,
  shippOrder,
  deliverOrder,
  cancelledOrder,
  deleteOrder,
};
