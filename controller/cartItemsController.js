const cartItemService = require("../services/cartItemService.js");
const User = require("../models/user.js");

const updateCartItem = async (req, res) => {
  try {
    const { userId } = req;

    const updatedCartItem = await cartItemService.updateCartItem(
      userId,
      req.params.id,
      req.body
    );

    return res.status(200).json(updatedCartItem);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

 const removeCartItem=async(req, res)=> {
  const { userId } = req;
  try {
    await cartItemService.removeCartItem(userId, req.params.id);

    return res.status(200).send({ message: "item removed", status: true });
  } catch (err) {
    console.log("error", err.message);
    return res.status(500).json({ error: err.message });
  }
}

module.exports = { updateCartItem, removeCartItem };
