import express from "express";
import {authMiddleware, adminMiddleware }from "../middlewares/authMiddleware.js";
import {
  createProduct,
  getProducts,
  detailProduct,
  updateProduct,
  deleteProduct,
  FileUpload,
  getPopularProducts,
} from "../controller/productController.js";
import { upload } from "../utils/uploadFileHandler.js";

const router = express.Router();

router.post("/", authMiddleware, adminMiddleware, createProduct);
router.get("/", getProducts);
router.get('/popular', getPopularProducts)
router.get("/:id", detailProduct);
router.put("/:id", authMiddleware, adminMiddleware, updateProduct);
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);
router.post("/file-upload", authMiddleware,adminMiddleware, upload.single("image"), FileUpload);


export default router;
