import { createArtist } from "controllers/artist.controller";
import { Router } from "express";
import { protect } from "middlewares/auth.middleware";

export const artistRouter = Router();

// public routes
// artistRouter.post("/register", createUser);
// artistRouter.post("/login", loginUser);

// protected routes
artistRouter.post("/create", protect, createArtist);
// artistRouter.put("/profile", protect, updateUserProfile);
