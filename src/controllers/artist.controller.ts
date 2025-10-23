import { Artist, ArtistModel } from "models/artist.model";
import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import asyncHandler from "express-async-handler";
import { uploadToCloudinary } from "utils/cloudinary-upload";

/**
 * Create a new artist
 * @access private
 * @route /api/artists
 */
export const createArtist = asyncHandler(
  async (req: Request<{}, {}, Artist>, res: Response) => {
    const { name, genres, bio } = req.body;

    // Parse genres if it's a string (from multipart form data)
    const parsedGenres =
      typeof genres === "string" ? JSON.parse(genres) : genres;

    if (!name || !parsedGenres || !bio) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Artist name, genre and bio are required" });
      return;
    }

    const artistExists = await ArtistModel.findOne({ name });
    if (artistExists) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Artist already exists" });
      return;
    }

    // upload artist image if provided
    let imageUrl = "";
    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.path,
        "music-api/artists",
      );
      imageUrl = result.secure_url;
    }

    // create artist
    await ArtistModel.create({
      name,
      bio,
      genres: parsedGenres,
      ...(imageUrl && { image: imageUrl }), // Only include if exists
    })
      .then((artist) => {
        return res
          .status(StatusCodes.CREATED)
          .json({ message: "Artist created sucessfully", artist });
      })
      .catch((error) => {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
      });
  },
);
