const Rating = require("../models/rating.js");
const productService = require("./productService.js");

const createRating = async (req, userId) => {
  const product = await productService.findProductById(req.productId);
  let rating = await Rating.findOne({
    product: product._id,
    user: userId,
  });
  if (rating) {
    // Update the existing rating
    rating.rating = req.rating;
  } else {
    // Create a new rating
    rating = new Rating({
      product: product._id,
      user: userId,
      rating: req.rating,
    });
  }
  const savedRating = await rating.save();
  // Update the product's ratings array and numRatings field
  if (!product.ratings.includes(savedRating._id)) {
    product.ratings.push(savedRating._id);
  }
  // Fetch all ratings for this product to calculate numRatings and averageRating
  const ratings = await Rating.find({ product: product._id });
  const totalRatings = ratings.length;
  const sumRatings = ratings.reduce((sum, r) => sum + r.rating, 0);
  const newAverage = totalRatings > 0 ? sumRatings / totalRatings : 0;

  // Update numRatings and averageRating on the product
  product.numRatings = totalRatings;
  product.averageRating = newAverage;
  await product.save();

  return savedRating;
  
};

const getProductsRating = async (productId) => {
  return await Rating.find({ product: productId });
};

module.exports = {
  createRating,
  getProductsRating,
};
