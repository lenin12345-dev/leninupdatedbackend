const Category = require("../models/category");
const Product = require("../models/product");

// Create a new product
const createProduct = async(reqData)=> {
  // This function is used to create and save a product in the database, 
  // along with its associated categories at different levels.
  // ensures that the appropriate category hierarchy exists in the database (top, second, and third levels) 
  // before creating and saving a new product associated with the third level category.
  const {
    title,
    color,
    description,
    price,
    discountedPrice,
    discountPersent,
     imageUrl,
     brand,
     size,
     quantity
 
  }  =  reqData;
   let topLevel = await Category.findOne({ name: reqData.topLavelCategory });

  if (!topLevel) {
    const topLavelCategory = new Category({
      name: reqData.topLavelCategory,
      level: 1,
    });

    topLevel = await topLavelCategory.save();
  }

  let secondLevel = await Category.findOne({
    name: reqData.secondLavelCategory,
    parentCategory: topLevel._id,
  });

  if (!secondLevel) {
    const secondLavelCategory = new Category({
      name: reqData.secondLavelCategory,
      parentCategory: topLevel._id,
      level: 2,
    });

    secondLevel = await secondLavelCategory.save();
  }

  let thirdLevel = await Category.findOne({
    name: reqData.thirdLavelCategory,
    parentCategory: secondLevel._id,
  });

  if (!thirdLevel) {
    const thirdLavelCategory = new Category({
      name: reqData.thirdLavelCategory,
      parentCategory: secondLevel._id,
      level: 3,
    });

    thirdLevel = await thirdLavelCategory.save();
  }

  const product = new Product({
    title: title,
    color: color,
    description: description,
    discountedPrice: discountedPrice,
    discountPersent: discountPersent,
    imageUrl: imageUrl,
    brand: brand,
    price: price,
    sizes: size,
    quantity: quantity,
    category: thirdLevel._id,
  });

  const savedProduct = await product.save();

  return savedProduct;
}
// Delete a product by ID
const  deleteProduct = async(productId)=> {
  await Product.findByIdAndDelete(productId);
  return "Product deleted Successfully";
}

 const updateProduct=async(productId, reqData)=> {
  // If sizes nes array is part of the update data, use $set to update it
  const updateData = { ...reqData };
  if (reqData.sizes) {
    updateData.sizes = reqData.sizes;
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    { $set: updateData },
    { new: true }
  );

  return updatedProduct;
}

 const findProductById=async(id)=> {
  try {
    const product = await Product.findById(id)
    .populate({
      path: 'category',
      populate: {
        path: 'parentCategory',
        populate: {
          path: 'parentCategory', // This will populate the grandparent category
          model: 'categories'
        },
        model: 'categories'
      }
    })
    .exec();
  if (!product) {
    throw new Error("Product not found with id " + id);
  }
  return product;
}catch (error) {
  throw new Error(error.message);
}
}



// Get all products with filtering and pagination
 const getAllProducts=async(reqQuery)=> {
  let {
    category,
    color,
    sizes,
    minPrice,
    maxPrice,
    minDiscount,
    sort,
    stock,
    pageNumber,
    pageSize,
    search
  } = reqQuery;
  pageSize = pageSize || 10;
   pageNumber = pageNumber || 1 ;
  //  The query object is needed because it lets you dynamically build a MongoDB query based on the criteria specified 
  // by the request's query parameters (reqQuery)
  let query = Product.find().populate("category");

  if (search) {
    // Update the query to search in multiple fields, adjust as needed
    // query.or([...]): This method allows you to specify multiple conditions in a query, where at least one of the conditions must match for a document to be included in the results.
    query = query.or([
      { 'title': { $regex: search, $options: 'i' } },
      { 'brand': { $regex: search, $options: 'i' } },
      { 'description': { $regex: search, $options: 'i' } },
    ]);
  }
  if (category) {
    const existCategory = await Category.findOne({ name: category });
    if (existCategory)
      query = query.where("category").equals(existCategory._id);
    else return { content: [], currentPage: 1, totalPages:1 };
  }

  if (color && color !== 'null') {
    // new Set(...): Creates a Set from the array of colors. A Set is a collection of unique values, so any duplicate colors will be automatically removed. 
    const colorSet = new Set(color.split(",").map(color => color.trim().toLowerCase()));
    // [...colorSet].join("|"): Converts the Set to an array and joins the elements into a single string with each color separated by a pipe (|). 
    // This pipe character is used in regular expressions to indicate an "or" condition. For example, {"red", "blue", "green"} becomes "red|blue|green".
    // new RegExp("red|blue|green", "i") will match any string containing "red", "blue", or "green", regardless of case.
    const colorRegex = colorSet.size > 0 ? new RegExp([...colorSet].join("|"), "i") : null;
    query = query.where("color").regex(colorRegex);
    // query = query.where("color").in([...colorSet]);
  }

  if (sizes) {
    // Converts the array ["64GB", "128GB"] to a Set to ensure uniqueness, resulting in {"64GB", "128GB"}
    const sizesSet = new Set(sizes);
  //  [...sizesSet] converts the Set to an array, resulting in ["64GB", "128GB"].
    query = query.where("sizes.name").in([...sizesSet]);
  }


  if (minPrice != null || maxPrice != null) {
    if (minPrice != null && maxPrice != null) {
      query = query.where("discountedPrice").gte(minPrice).lte(maxPrice);
    } else if (minPrice != null) {
      query = query.where("discountedPrice").gte(minPrice);
    } else if (maxPrice != null) {
      query = query.where("discountedPrice").lte(maxPrice);
    }
  }

  if (minDiscount) {
    query = query.where("discountPersent").gte(minDiscount);
  }

  if (stock) {
    if (stock === "in_stock") {
      query = query.where("quantity").gt(0);
    } else if (stock === "out_of_stock") {
      query = query.where("quantity").lte(0);
    }
  }

  if (sort) {
    const sortDirection = sort === "price_high" ? -1 : 1;
    query = query.sort({ discountedPrice: sortDirection });
  }

 
  // counts the total number of products that match the query (i.e., the filtered products).
  const totalProducts = await Product.countDocuments(query);

 // Apply pagination
  const skip = (pageNumber - 1) * pageSize;
  query = query.skip(skip).limit(pageSize);

  // runs the query against the database and retrieves the matching products, considering the filters and pagination.
  const products = await query.populate({
    path: 'category',
    populate: {
      path: 'parentCategory',
      populate: {
        path: 'parentCategory', // This will populate the grandparent category
        model: 'categories'
      },
      model: 'categories'
    }
  }).exec();

  const totalPages = Math.ceil(totalProducts / pageSize);


  return { content: products, currentPage: pageNumber, totalPages:totalPages };
}

async function createMultipleProduct(products) {
  for (let product of products) {
    await createProduct(product);
  }
}

module.exports = {
  createProduct,
  deleteProduct,
  updateProduct,
  getAllProducts,
  findProductById,
  createMultipleProduct,
};
