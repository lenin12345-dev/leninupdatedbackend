const Review = require("../models/review.js");
const productService = require("./productService.js");

const  createReview=async(reqData, userId)=> {
  try {
    const product = await productService.findProductById(reqData.productId);
    // Check if the user has already reviewed this product

      // Create a new review
      const review = new Review({
        user: userId,
        product: product._id,
        review: reqData.review,
      });

      const savedReview = await review.save();

      // Save the review ID inside the product's reviews array
      product.reviews.push(savedReview._id);
      await product.save();

      return savedReview.populate('user') ;
    
  } catch (error) {
    throw new Error(error.message);
  }
}

async function getAllReview(productId) {
  const reviews = await Review.find({ product: productId }).populate("user");
  return reviews;
}
module.exports = {
  createReview,
  getAllReview,
};
