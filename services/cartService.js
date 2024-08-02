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
 const findUserCart=async(userId)=> {
  let cart = await Cart.findOne({ user: userId }).populate('cartItems').populate({
    path: 'cartItems',
    populate: {
      path: 'product',
      model: 'products'
    }
  });

  if (!cart) {
    return { success: false, message: 'Cart not found for this user' };
  }
  
  return { success: true, cart };
}

// Add an item to the user's cart
const  addCartItem= async(userId, req)=> {
  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return { success: false, message: 'Cart not found for this user' };
    }

    const product = await Product.findById(req.productId);
    if (!product) {
      return { success: false, message: 'Product not found' };
    }

    const isPresent = await CartItem.findOne({ cart: cart._id, product: product._id, userId });

    if (!isPresent) {
      const cartItem = new CartItem({
        product: product._id,
        cart: cart._id,
        quantity: req.quantity || 1,
        userId,
        price: product.price,
        size: req.size,
        discountedPrice: product.discountedPrice
      });

      const createdCartItem = await cartItem.save();
      cart.cartItems.push(createdCartItem);
      cart.totalPrice += product.price * (req.quantity || 1);
      cart.totalDiscountedPrice += product.discountedPrice * (req.quantity || 1);
      cart.totalItem += req.quantity || 1;
      cart.discounte = cart.totalPrice - cart.totalDiscountedPrice;
      
      await cart.save();
    }

    return {cart:cart, success: true, message: 'Item added to cart' };
  } catch (err) {
    throw new Error('Failed to add item to cart');
  }
}


module.exports = { createCart, findUserCart, addCartItem };
