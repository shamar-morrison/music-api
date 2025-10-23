import {
  createUser,
  getUserProfile,
  loginUser,
  updateUserProfile,
} from "controllers/user.controller.js";
import { Router } from "express";
import { protect } from "middlewares/auth.middleware";

export const userRouter = Router();

// public routes
userRouter.post("/register", createUser);
userRouter.post("/login", loginUser);

// protected routes
userRouter.get("/profile", protect, getUserProfile);
userRouter.put("/profile", protect, updateUserProfile);
