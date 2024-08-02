const express = require('express');
const {getAllProducts,findProductById,
    createProduct,createMultipleProduct,
    deleteProduct,updateProduct} = require('../controller/productController');
const { userSignUp, userLogIn,getUserProfile,getAllUsers } = require('../controller/userController');
const { findUserCart,addItemToCart } = require('../controller/cartController');
const { updateCartItem,removeCartItem } = require('../controller/cartItemsController');
const { createOrder,orderHistory,findOrderById } = require('../controller/orderController')
const { createPaymentLink, updatePaymentInformation } = require('../controller/paymentController');
const { createReview, getAllReview } = require('../controller/reviewController');
const { createRating, getProductsRating } = require('../controller/ratingController');
const { getAllOrders, confirmedOrder,shippOrder,deliverOrder,cancelledOrder,deleteOrder } = require('../controller/adminOrderController');
const verifyJWT =  require('.././middleware/verifyJWT')

const router = express.Router();

// login & signup
router.post('/auth/signup', userSignUp);
router.post('/auth/signin', userLogIn);

router.get("/api/users",getAllUsers)
router.get("/api/users/profile",getUserProfile)

router.post('/api/admin/products', createProduct);
router.post('/api/admin/products/creates', createMultipleProduct);
router.delete('/api/admin/products/:id', deleteProduct);
router.put('/api/admin/products/:id', updateProduct);

router.get('/api/products/', getAllProducts);
router.get('/api/products/id/:id', findProductById);



router.get("/api/cart", verifyJWT, findUserCart);
router.put("/api/cart/add", verifyJWT, addItemToCart);

router.put("/api/cart_items/:id",verifyJWT,updateCartItem);
router.delete("/api/cart_items/:id",verifyJWT,removeCartItem);

router.post("/api/orders",verifyJWT,createOrder);
router.get("/api/orders/user",verifyJWT,orderHistory);
router.get("/api/orders/:id",verifyJWT,findOrderById);

router.post("/api/payments/:id",verifyJWT,createPaymentLink);
router.get("/api/payments/",verifyJWT,updatePaymentInformation);

router.post("/api/reviews/create",verifyJWT,createReview);
router.get("/api/reviews/product/:productId",verifyJWT,getAllReview);

router.post("/api/ratings/create",verifyJWT,createRating);
router.get("/api/ratings/product/:productId",verifyJWT,getProductsRating);


router.get("/api/admin/orders",verifyJWT,getAllOrders);
router.put("/api/admin/orders/:orderId/confirmed",verifyJWT,confirmedOrder);
router.put("/api/admin/orders/:orderId/ship",verifyJWT,shippOrder);
router.put("/api/admin/orders/:orderId/deliver",verifyJWT,deliverOrder);
router.put("/api/admin/orders/:orderId/cancel",verifyJWT,cancelledOrder);
router.delete("/api/admin/orders/:orderId/delete",verifyJWT,deleteOrder);


module.exports = router;
