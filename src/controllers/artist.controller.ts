import { Artist, ArtistModel } from "models/artist.model";
import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import asyncHandler from "express-async-handler";

/**
 * Create a new artist
 * @access private
 * @route /api/artists
 */
export const createArtist = asyncHandler(
  async (req: Request<{}, {}, Artist>, res: Response) => {
    const { name, genres, bio } = req.body;
    if (!name || !genres || !bio) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Artist name, genre and bio are required" });
      return;
    }

    const artistExists = await ArtistModel.findOne({ name });
    if (artistExists) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Artist already exists", success: false });
      return;
    }

    // create artist
    await ArtistModel.create(req.body)
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
