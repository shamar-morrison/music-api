import { Artist, ArtistModel } from "models/artist.model";
import type { Request } from "express";
import { StatusCodes } from "http-status-codes";
import asyncHandler from "express-async-handler";

/**
 * Create a new artist
 * @access private
 * @route /api/artists
 */
export const createArtist = asyncHandler(
  async (req: Request<{}, {}, Artist>, res: Response) => {
    const body = req.body;
    const artistExists = await ArtistModel.findOne({});

    if (artistExists) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "User already exists", success: false });
      return;
    }
  },
);
