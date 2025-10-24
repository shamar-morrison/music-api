import { getAlbums } from "controllers/album.controller";
import { Router } from "express";

export const albumRouter = Router();

albumRouter.get("/", getAlbums);
