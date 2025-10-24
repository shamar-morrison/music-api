import {
  createUser,
  getUserProfile,
  loginUser,
  updateUserProfile,
} from "controllers/user.controller.js";
import { Router } from "express";
import { isAdmin, protect } from "middlewares/auth.middleware";
import { upload } from "middlewares/upload";

export const userRouter = Router();

// public routes
userRouter.post("/register", createUser);
userRouter.post("/login", loginUser);

// protected routes
userRouter.get("/profile", protect, getUserProfile);
userRouter.put(
  "/profile",
  protect,
  isAdmin,
  upload.single("image"),
  updateUserProfile,
);
