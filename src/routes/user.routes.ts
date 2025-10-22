import { Router } from "express";
import {
  createUser,
  getUserProfile,
  loginUser,
} from "controllers/user.controller.js";
import { protect } from "middlewares/auth.middleware";

export const userRouter = Router();

userRouter.post("/register", createUser);
userRouter.post("/login", loginUser);
userRouter.get("/profile", protect, getUserProfile);
