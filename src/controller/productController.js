import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";

export const createProduct = asyncHandler(async (req, res) => {
  const products = await Product.create(req.body);
  return res.status(201).json({
    message: "Product created successfully",
    data: products,
  });
});

export const getProducts = asyncHandler(async (req, res) => {
  const queryObject = { ...req.query };

  const excludeField = ["page", "limit"];
  excludeField.forEach((el) => delete queryObject[el]);

  let query;

  if (req.query.name) {
    query = Product.find({
      name: { $regex: req.query.name, $options: "i" },
    });
  } else {
    query = Product.find(queryObject);
  }

  const page = req.query.page * 1 || 1;
  const limitData = req.query.limit * 1 || 30;
  const skipData = (page - 1) * limitData;

  query = query.skip(skipData).limit(limitData);

  let countProduct = await Product.countDocuments();

  if (req.query.page) {
    if (skipData >= countProduct) {
      res.status(404);
      throw new Error("Page not found");
    }
  }

  const products = await query;

  return res.status(200).json({
    message: "Products fetched successfully",
    data: products,
    count : countProduct,
  });
});

export const detailProduct = asyncHandler(async (req, res) => {
  const paramsId = req.params.id;
  const product = await Product.findById(paramsId);

  if (!product) {
    return res.status(404);
    throw new Error("Product not found");
  }

  return res.status(200).json({
    message: "Product detail fetched successfully",
    data: product,
  });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const paramId = req.params.id;
  const updateProduct = await Product.findByIdAndUpdate(paramId, req.body, {
    runValidators: false,
    new: true,
  });

  return res.status(200).json({
    message: "Product updated successfully",
    data: updateProduct,
  });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const paramId = req.params.id;
  await Product.findByIdAndDelete(paramId);

  return res.status(200).json({
    message: "Product deleted successfully",
  });
});

export const FileUpload = asyncHandler(async (req, res) => {
  const file = req.file;

  if (!file) {
    res.status(400);
    throw new Error("Please upload a file");
  }

  const imageFileName = file.filename;
  const imagePath = `/uploads/${imageFileName}`;
  res.status(200).json({
    message: "File uploaded successfully",
    image: imagePath,
  });
});
