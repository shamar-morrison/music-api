import {
  createAlbum,
  deleteAlbum,
  getAlbums,
  updateAlbum,
} from "controllers/album.controller";
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
albumRouter.post("/:id", protect, isAdmin, upload.single("image"), updateAlbum);
albumRouter.delete("/:id", protect, isAdmin, deleteAlbum);
