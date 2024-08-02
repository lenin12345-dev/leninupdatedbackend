const Review = require("../models/review.js");
const productService = require("./productService.js");

const  createReview=async(reqData, userId)=> {
  try {
    const product = await productService.findProductById(reqData.productId);

    const review = new Review({
      user: userId,
      product: product._id,
      review: reqData.review,
    });

    const savedReview = await review.save();

    return savedReview;
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
