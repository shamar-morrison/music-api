import { createArtist } from "controllers/artist.controller";
import { Router } from "express";
import { isAdmin, protect } from "middlewares/auth.middleware";
import { upload } from "middlewares/upload";

export const artistRouter = Router();

// public routes
// artistRouter.post("/register", createUser);
// artistRouter.post("/login", loginUser);

// protected routes
artistRouter.post(
  "/create",
  protect,
  isAdmin,
  upload.single("image"),
  createArtist,
);
// artistRouter.put("/profile", protect, updateUserProfile);
