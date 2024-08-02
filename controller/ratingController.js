
const ratingService = require('../services/ratingService.js');


const createRating= async(req, res) => {
  try {
    const {userId,body:reqBody} = req 
    await ratingService.createRating(reqBody, userId);
    res.status(201).json('rating created successfully');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProductsRating=async (req, res) => {
  try {
    const {productId} = req.params;
    const ratings =await ratingService.getProductsRating(productId);
    res.status(200).json(ratings);
  } catch (error) {
    res.status(500).json({ error:error.message });
  }
};

module.exports = {getProductsRating,createRating}
