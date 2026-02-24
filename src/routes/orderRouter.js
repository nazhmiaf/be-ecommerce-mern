import express from "express";
import {authMiddleware, adminMiddleware }from "../middlewares/authMiddleware.js";
import { CreateOrder, getOrder, detailOrder, currentOrder, updateOrder, deleteOrder } from "../controller/orderController.js";

const router = express.Router();

router.post("/", authMiddleware, CreateOrder);
router.get("/", authMiddleware, adminMiddleware, getOrder, );
router.get("/:id",authMiddleware, detailOrder,);
router.get("/current/user", authMiddleware, currentOrder);
router.put("/:id", authMiddleware, updateOrder);
router.delete("/:id", authMiddleware, deleteOrder);

export default router;
