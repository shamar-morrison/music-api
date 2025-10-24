import { createAlbum, getAlbums } from "controllers/album.controller";
import { Router } from "express";
import { isAdmin, protect } from "middlewares/auth.middleware";
import { upload } from "middlewares/upload";

export const albumRouter = Router();

albumRouter.get("/", getAlbums);
albumRouter.post(
  "/create",
  protect,
  isAdmin,
  upload.single("image"),
  createAlbum,
);
