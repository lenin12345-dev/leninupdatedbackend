const Rating = require("../models/rating.js");
const productService=require("./productService.js")

const createRating = async(req, userId)=> {

  const product = await productService.findProductById(req.productId)
  const rating = new Rating({
    product: product._id,
    user:userId,
    rating: req.rating,
  });
  
  return await rating.save();
}


 const getProductsRating= async(productId)=> {
  return await Rating.find({ product: productId });
}

module.exports = {
  createRating,
  getProductsRating,
};
