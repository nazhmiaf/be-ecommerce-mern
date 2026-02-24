import express from 'express';
import User from '../models/userModel.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import { register, login, getUser, logout } from '../controller/authController.js';
import {authMiddleware} from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post("/register", register )
router.post("/login", login )
router.get("/logout", authMiddleware, logout)
router.get("/getuser", authMiddleware, getUser )

export default router
