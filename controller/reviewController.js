const reviewService = require("../services/reviewService.js");
const User = require("../models/user.js");
const Review = require("../models/review.js");
const Product = require("../models/product");

const createReview = async (req, res) => {
  const { userId, body: reqBody } = req;
  try {
    const review = await reviewService.createReview(reqBody, userId);

    return res.status(201).json(review);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const deleteReview = async (req, res) => {
  const { reviewId } = req.params;
  try {
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    //  Remove the review reference from the product
    await Product.findByIdAndUpdate(review.product, {
      $pull: { reviews: review._id },
    });
    await Review.deleteOne({ _id: reviewId });
    return res.status(200).json({ message: "Review Deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getAllReview = async (req, res) => {
  const { productId } = req.params;
  try {
    const reviews = await reviewService.getAllReview(productId);
    return res.status(200).send(reviews);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { createReview, getAllReview, deleteReview };
