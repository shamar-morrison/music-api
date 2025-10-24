import type { Request } from "express";
import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { AlbumModel } from "models/album.model";
import type { createAlbumData } from "types/album.types";
import { uploadToCloudinary } from "utils/cloudinary-upload";
import { validateRequiredFields } from "utils/validation";

const IMAGE_PATH = "music-api/albums";

/**
 * Get albums
 * @access private
 * @route GET /api/albums
 */
export const getAlbums = asyncHandler(async (_req, res) => {
  const albums = await AlbumModel.find();
  if (albums.length === 0) {
    res.status(StatusCodes.NOT_FOUND).json({ message: "No albums found" });
    return;
  }
  res.json(albums);
});

/**
 * Create an Album
 * @access private
 * @route POST /api/albums/create
 */
export const createAlbum = asyncHandler(
  async (req: Request<{}, {}, createAlbumData>, res) => {
    // Validate required fields
    const requiredFields = ["title", "description", "artist", "releaseDate"];
    const { isValid, missingFields } = validateRequiredFields(
      req.body,
      requiredFields,
    );

    if (!isValid) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "Missing required fields",
        missingFields,
        requiredFields,
      });
      return;
    }

    const albumExists = await AlbumModel.find({ title: req.body.title });

    if (albumExists.length > 0) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Album already exists" });
      return;
    }

    let imageUrl = "";
    if (req.file) {
      const result = await uploadToCloudinary(req.file.path, IMAGE_PATH);
      imageUrl = result.secure_url;
    }

    await AlbumModel.create({
      ...req.body,
      ...(imageUrl && { image: imageUrl }),
    });
    res
      .status(StatusCodes.CREATED)
      .json({ message: "Album created successfully" });
  },
);
