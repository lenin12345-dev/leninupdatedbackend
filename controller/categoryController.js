const Category = require("../models/category.js")



 const  getAllCategories=async(req, res)=> {
  try {

    const categories = await Category.find({});

    return res.status(200).send(categories);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
module.exports={getAllCategories};