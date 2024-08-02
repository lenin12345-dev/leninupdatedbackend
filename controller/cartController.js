


const cartService=require("../services/cartService.js");




const findUserCart = async (req, res) => {
    try {
      const {userId} = req;
      const result = await cartService.findUserCart(userId);
      if (!result.success) {
        return res.status(404).json({ message: result.message });
      }
      res.status(200).json(result.cart);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user cart.", error: error.message });
    }
}
  

const addItemToCart = async (req, res) => {
  try {
    const {userId} = req;
    const result = await cartService.addCartItem(userId.toString(), req.body);

    if (result.success) {
      res.status(201).json({ message: result.message, status: true,data:result.cart });
    } else {
      res.status(404).json({ message: result.message, status: false });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to add item to cart.", error: error.message });
  }
};

  module.exports={findUserCart,addItemToCart};