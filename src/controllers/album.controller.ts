import type { Request } from "express";
import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { Album, AlbumModel } from "models/album.model";
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

    const album = await AlbumModel.create({
      ...req.body,
      ...(imageUrl && { image: imageUrl }),
    });
    res
      .status(StatusCodes.CREATED)
      .json({ message: "Album created successfully", album });
  },
);

/**
 * Update an Album
 * @access private
 * @route POST /api/albums/:id/update
 */
export const updateAlbum = asyncHandler(
  async (req: Request<{ id: string }, {}, Partial<Album>>, res) => {
    const { id } = req.params;

    const album = await AlbumModel.findById(id);
    if (!album) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Album not found" });
      return;
    }

    let imageUrl = "";
    if (req.file) {
      const result = await uploadToCloudinary(req.file.path, IMAGE_PATH);
      imageUrl = result.secure_url;
    }

    const updatedAlbum = album.updateOne(
      { ...req.body, ...(imageUrl && { coverImage: imageUrl }) },
      {
        new: true,
        runValidators: true,
      },
    );

    res.json({ message: "Album updated successfully", updatedAlbum });
  },
);
