import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";
import { signedCookie } from "cookie-parser";

export const CreateOrder = asyncHandler(async (req, res) => {
  const { email, firstName, lastName, phone, cartItem } = req.body;

  if (!cartItem || cartItem.length === 0) {
    res.status(400);
    throw new Error("Cart is empty");
  }

  let orderItem = [];
  let total = 0;

  for (const cart of cartItem) {
    const productData = await Product.findOne({ _id: cart.product });
    if (!productData) {
      res.status(404);
      throw new Error("Product is not found");
    }

    const { name, price, _id } = productData;
    const singleProduct = {
      quantity: cart.quantity,
      name,
      price,
      product: _id,
    };
    orderItem = [...orderItem, singleProduct];

    total += cart.quantity * price;
  }

  const order = await Order.create({
    itemDetail: orderItem,
    total,
    firstName,
    lastName,
    email,
    phone,
    user: req.user.id,
  });

  return res.status(201).json({
    total,
    order,
    message: "Order created successfully",
  });
});

export const getOrder = asyncHandler(async (req, res) => {
  const orders = await Order.find();

  res.status(201).json({
    data: orders,
    message: "Order fetched successfully",
  });
});

export const detailOrder = asyncHandler(async (req, res) => {
  const orders = await Order.findById(req.params.id);
  res
    .status(201)
    .json({ data: orders, message: "Order detail fetched successfully" });
});

export const currentOrder = asyncHandler(async (req, res) => {
  const orders = await Order.findOne({'user' : req.user.id})
  res.status(201).json({ 
    data : orders,
    mesasge : 'Detail order fetched'
  });
});

export const updateOrder = asyncHandler(async (req, res) => {
  res.status(201).json({ message: "Order updated successfully" });
});

export const deleteOrder = asyncHandler(async (req, res) => {
  res.status(201).json({ message: "Order deleted successfully" });
});
