
const reviewService = require('../services/reviewService.js');
const User =  require('../models/user.js')

const createReview = async (req, res) => {
  
  const {userId,body:reqBody} = req 
  try {
    
    const review =await reviewService.createReview(reqBody, userId);
        
    return res.status(201).json(review);
  } catch (error) {
    return res.status(500).json({ error: error.message});
  }
};

const getAllReview = async (req, res) => {
  const {productId} = req.params;
  try {
   
    const reviews =await reviewService.getAllReview(productId);
    return res.status(200).send(reviews);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {createReview,getAllReview}
