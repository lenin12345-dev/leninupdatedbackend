const CartItem = require("../models/cartItem.js");
const Cart = require("../models/cart.js");
const userService = require("./userService.js");

// Create a new cart item
async function createCartItem(cartItemData) {
  const cartItem = new CartItem(cartItemData);
  cartItem.quantity = 1;
  cartItem.price = cartItem.product.price * cartItem.quantity;
  cartItem.discountedPrice =
    cartItem.product.discountedPrice * cartItem.quantity;

  const createdCartItem = await cartItem.save();
  return createdCartItem;
}

// Update an existing cart item
async function updateCartItem(userId, cartItemId, cartItemData) {
  const item = await findCartItemById(cartItemId);
  const user = await userService.findUserById(item.userId);

  if (cartItemData.quantity <= 0) {
    throw new Error("Quantity must be greater than zero");
  }

  // Ensure the item belongs to the user trying to update it
  if (user.id === userId.toString()) {
    item.quantity = cartItemData.quantity;
    item.price = item.quantity * item.product.price;
    item.discountedPrice = item.quantity * item.product.discountedPrice;
    await item.save();
    const cart = await Cart.findById(item.cart);
    if (!cart) {
      throw new Error("Cart not found");
    }
       // Recalculate totals
       let totalPrice = 0;
       let totalDiscountedPrice = 0;
       let totalItem = 0;
 
       for (let cartItem of cart.cartItems) {
         const cartItemData = await CartItem.findById(cartItem._id).populate('product');
         totalPrice += cartItemData.price;
         totalDiscountedPrice += cartItemData.discountedPrice;
         totalItem += cartItemData.quantity;
       }
 
       cart.totalPrice = totalPrice;
       cart.totalDiscountedPrice = totalDiscountedPrice;
       cart.totalItem = totalItem;
       cart.discounte = totalPrice - totalDiscountedPrice;
 
       // Save the updated cart
       await cart.save();
       return { success: true, updatedCartItem: item };
  } else {
    throw new Error("You can't update another user's cart_item");
  }
}

// Check if a cart item already exists in the user's cart
async function isCartItemExist(cart, product, size, userId) {
  const cartItem = await CartItem.findOne({ cart, product, size, userId });
  return cartItem;
}

// Remove a cart item
async function removeCartItem(userId, cartItemId) {
  try {
    const cartItem = await findCartItemById(cartItemId);
    const user = await userService.findUserById(cartItem.userId);
    const reqUser = await userService.findUserById(userId);

    // Check if the requesting user is the owner of the cart item
    if (user.id !== reqUser.id) {
      throw new UserException("You can't remove another user's item");
    }
    const cart = await Cart.findById(cartItem.cart);
    if (!cart) {
      throw new Error("Cart not found");
    }
    await CartItem.findByIdAndDelete(cartItem.id);
    // Remove the cart item from the cart's cartItems array
    cart.cartItems = cart.cartItems.filter(
      (item) => item.toString() !== cartItemId
    );

    // Recalculate the cart's total values
    cart.totalPrice -= cartItem.price ;
    cart.totalDiscountedPrice -= cartItem.discountedPrice ;
    cart.totalItem -= cartItem.quantity;
    // Ensure values don't go negative
    if (cart.totalPrice < 0) cart.totalPrice = 0;
    if (cart.totalDiscountedPrice < 0) cart.totalDiscountedPrice = 0;
    if (cart.totalItem < 0) cart.totalItem = 0;
    
    cart.discounte = cart.totalPrice - cart.totalDiscountedPrice;

    // Save the updated cart
    await cart.save();

    return { success: true, message: "Item removed from cart" };
  } catch (err) {
    throw new Error(`Failed to remove item from cart: ${err.message}`);
  }
}

// Find a cart item by its ID
async function findCartItemById(cartItemId) {
  const cartItem = await CartItem.findById(cartItemId).populate("product");
  if (cartItem) {
    return cartItem;
  } else {
    throw new CartItemException(`CartItem not found with id: ${cartItemId}`);
  }
}

module.exports = {
  createCartItem,
  updateCartItem,
  isCartItemExist,
  removeCartItem,
  findCartItemById,
};
