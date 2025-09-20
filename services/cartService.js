const Cart = require("../models/cart.js");
const CartItem = require("../models/cartItem.js");
const Product = require("../models/product.js");
const User = require("../models/user.js");

// Create a new cart for a user
async function createCart(user) {
  const cart = new Cart({ user });
  const createdCart = await cart.save();
  return createdCart;
}

// Find a user's cart and update cart details
const findUserCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId })
    .populate("cartItems")
    .populate({
      path: "cartItems",
      populate: {
        path: "product",
        model: "products",
      },
    });

  if (!cart) {
    return { success: false, message: "Cart not found for this user" };
  }

  return { success: true, cart };
};

// Add an item to the user's cart
const addCartItem = async (userId, req) => {
  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return { success: false, message: "Cart not found for this user" };
    }

    const product = await Product.findById(req.productId);
    if (!product) {
      return { success: false, message: "Product not found" };
    }

    const isPresent = await CartItem.findOne({
      cart: cart._id,
      product: product._id,
      userId,
      size: req.size,
    });

    if (!isPresent) {
      const cartItem = new CartItem({
        product: product._id,
        cart: cart._id,
        quantity: req.quantity || 1,
        userId,
        price: product.price,
        size: req.size,
        discountedPrice: product.discountedPrice,
      });
      const createdCartItem = await cartItem.save();
      cart.cartItems.push(createdCartItem);
    } else {
      // increment quantity if same product + same size
      isPresent.quantity += req.quantity || 1;
      await isPresent.save();
    }


    // 🔄 update totals (recalculate to avoid mismatch)
    const allCartItems = await CartItem.find({ cart: cart._id });
    cart.totalPrice = allCartItems.reduce((sum, ci) => sum + ci.price * ci.quantity, 0);
    cart.totalDiscountedPrice = allCartItems.reduce((sum, ci) => sum + ci.discountedPrice * ci.quantity, 0);
    cart.totalItem = allCartItems.reduce((sum, ci) => sum + ci.quantity, 0);
    cart.discounte = cart.totalPrice - cart.totalDiscountedPrice;

    await cart.save();

    return { cart: cart, success: true, message: "Item added to cart" };
  } catch (err) {
    throw new Error("Failed to add item to cart");
  }
};

module.exports = { createCart, findUserCart, addCartItem };
