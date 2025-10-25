import {
  addAlbumToSong,
  addArtistToSong,
  createSong,
  deleteSong,
  getAllSongs,
  getSongById,
  updateSongDetails,
} from "controllers/songs.controller";
import { Router } from "express";
import { isAdmin, protect } from "middlewares/auth.middleware";
import { upload } from "middlewares/upload";

export const songsRouter = Router();

songsRouter.get("/", getAllSongs);

songsRouter.post(
  "/create",
  protect,
  isAdmin,
  upload.fields([
    { name: "audio", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  createSong,
);

songsRouter.get("/:id", getSongById);

songsRouter.put("/:id", updateSongDetails);

songsRouter.delete("/:id", deleteSong);

songsRouter.post("/:id/add-album", addAlbumToSong);

songsRouter.post("/:id/add-artist", addArtistToSong);
