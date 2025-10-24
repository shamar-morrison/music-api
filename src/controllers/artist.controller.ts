import type { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { Album, AlbumModel } from "models/album.model.js";
import { ArtistModel } from "models/artist.model";
import { Song, SongModel } from "models/song.model.js";
import { uploadToCloudinary } from "utils/cloudinary-upload";

import type {
  CreateArtistData,
  UpdateArtistData,
} from "../types/artist.types.js";

const IMAGE_PATH = "music-api/artists";

/**
 * Create a new artist
 * @access private
 * @route /api/artists
 */
export const createArtist = asyncHandler(
  async (req: Request<{}, {}, CreateArtistData>, res: Response) => {
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
      const result = await uploadToCloudinary(req.file.path, IMAGE_PATH);
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

/**
 * Get all artists with filtering and pagination
 * @access public
 * @route GET /api/artists?genre=rock&search=killa&page=1&limit=10
 */
export const getArtists = asyncHandler(
  async (
    req: Request<
      {},
      {},
      {},
      { genre?: string; search?: string; page?: string; limit?: string }
    >,
    res: Response,
  ) => {
    const { genre, search, page, limit } = req.query;

    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;

    const query: any = {};

    if (genre) {
      query.genres = { $in: [new RegExp(`^${genre}$`, "i")] };
    }

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const artists = await ArtistModel.find(query)
      .sort({ name: 1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .exec();

    res.status(StatusCodes.OK).json({
      query: search || "",
      artists,
      page: page || 1,
    });
  },
);

/**
 * Get artist by ID
 * @access public
 * @route GET /api/artists/:id
 */
export const getArtistById = asyncHandler(
  async (req: Request<{ id: string }>, res) => {
    const { id } = req.params;

    const artist = await ArtistModel.findById(id);
    if (!artist) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Artist not found" });
      return;
    }
    res.json(artist);
  },
);

/**
 * Update Artist details
 * @access public
 * @route PUT /api/artists/:id
 */
export const updateArtistDetails = asyncHandler(
  async (req: Request<{ id: string }, {}, UpdateArtistData>, res: Response) => {
    const { id } = req.params;

    const artist = await ArtistModel.findById(id);
    if (!artist) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Artist not found" });
      return;
    }

    // Handle image upload if provided
    let imageUrl = artist.image; // Keep existing image by default
    if (req.file) {
      const result = await uploadToCloudinary(req.file.path, IMAGE_PATH);
      imageUrl = result.secure_url;
    }

    // Parse genres if it's a string (from multipart form data)
    const parsedGenres =
      typeof req.body.genres === "string"
        ? JSON.parse(req.body.genres)
        : req.body.genres;

    const updatedArtist = await ArtistModel.findByIdAndUpdate(
      id,
      {
        ...req.body,
        ...(parsedGenres && { genres: parsedGenres }),
        ...(imageUrl && { image: imageUrl }),
      },
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(StatusCodes.OK).json({
      message: "Artist updated successfully",
      artist: updatedArtist,
    });
  },
);

/**
 * Delete Artist
 * @access public
 * @route DELETE /api/artists/:id
 */
export const deleteArtist = asyncHandler(
  async (req: Request<{ id: string }>, res) => {
    const { id } = req.params;
    const artist = await ArtistModel.findById(id);

    if (!artist) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Artist not found" });
      return;
    }

    // Delete all songs associated with the artist
    await SongModel.deleteMany({ artist: id });

    // Delete all albums associated with the artist
    await AlbumModel.deleteMany({ artist: id });

    await ArtistModel.deleteOne(artist._id);
    res.json({ message: "Artist deleted successfully" });
  },
);

/**
 * Get top 10 Artists based on followers
 * @access public
 * @route GET /api/artists/top?limit={{limit}}
 */
export const getTopArtists = asyncHandler(
  async (req: Request<{}, {}, {}, { limit?: string }>, res) => {
    const { limit } = req.query;
    const limitNum = parseInt(limit as string) || 10;
    const artists = await ArtistModel.find()
      .sort({ followers: -1 })
      .limit(limitNum);
    res.json(artists);
  },
);

/**
 * Get Artist's top songs by plays
 * @access public
 * @route GET /api/artists/:id/top-songs?limit={{limit}}
 */
export const getArtistTopSongs = asyncHandler(
  async (req: Request<{ id: string }, {}, {}, { limit?: string }>, res) => {
    const { id } = req.params;
    const { limit } = req.query;
    const parsedLimit = parseInt(limit as string) || 10;

    const artist = await ArtistModel.findById(id);
    if (!artist) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Artist not found" });
      return;
    }

    const songs = await SongModel.find({ artist: id })
      .sort({ plays: -1 })
      .limit(parsedLimit)
      .populate("album", "title coverImage");

    if (songs.length === 0) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "No songs found for this artist" });
      return;
    }

    res.json(songs);
  },
);
