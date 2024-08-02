// productController.js
const productService = require("../services/productService.js")
const Product = require("../models/product.js");
// Create a new product
const createProduct = async(req, res)=> {
  try {
    const product = await productService.createProduct(req.body);
    return res.status(201).json(product);
  } catch (err) {
    console.error(err.message)
    return res.status(500).json({ error: err.message });
  }
}

// Delete a product by ID
async function deleteProduct(req, res) {
  try {
    const {id} = req.params;
    const message = await productService.deleteProduct(id);
    return res.json({ message });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Update a product by ID
async function updateProduct(req, res) {
  try {
    const {id} = req.params;
    const updatedProduct = await productService.updateProduct(id, req.body);
    return res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


// Find a product by ID
 const findProductById=async(req, res)=> {
  try {
    const {id} = req.params;
    const product = await productService.findProductById(id);
    return res.status(200).send(product);
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
}

// Find products by category
async function findProductByCategory(req, res) {
  try {
    const category = req.params.category;
    const products = await productService.findProductByCategory(category);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}



// Get all products with filtering and pagination
 const  getAllProducts=async(req, res)=> {
  try {

    const products = await productService.getAllProducts(req.query);

    return res.status(200).send(products);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

const createMultipleProduct= async (req, res) => {
  try {
    await productService.createMultipleProduct(req.body)
    res
      .status(202)
      .json({ message: "Products Created Successfully", success: true });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = {
  createProduct,
  deleteProduct,
  updateProduct,
  getAllProducts,
  findProductById,
  findProductByCategory,
  createMultipleProduct

};
