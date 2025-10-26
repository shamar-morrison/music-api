import type { Request } from "express";
import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { AlbumModel } from "models/album.model";
import { ArtistModel } from "models/artist.model";
import { SongModel } from "models/song.model";
import type {
  AddAlbumToSongData,
  AddArtistToSongData,
  CreateSongData,
  UpdateSongData,
} from "types/song.types";
import { uploadToCloudinary } from "utils/cloudinary-upload";
import { validateRequiredFieldsWithFiles } from "utils/validation";

const AUDIO_PATH = "music-api/songs";
/**
 * Get all songs with filtering and pagination
 * @access public
 * @route GET /api/songs?genre=rock&artist=artistId&album=albumId&search=song&page=1&limit=10
 */
export const getAllSongs = asyncHandler(
  async (
    req: Request<
      {},
      {},
      {},
      {
        genre?: string;
        artist?: string;
        album?: string;
        search?: string;
        page?: string;
        limit?: string;
      }
    >,
    res,
  ) => {
    const { genre, artist, album, search, page, limit } = req.query;

    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;

    const query: any = {};

    if (genre) {
      query.genre = { $regex: genre, $options: "i" };
    }

    if (artist) {
      query.artist = { $regex: artist, $options: "i" };
    }

    if (album) {
      query.album = album;
    }

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    const songs = await SongModel.find(query)
      .populate("album", "title coverImage")
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .exec();

    if (songs.length === 0) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "No songs found" });
      return;
    }

    res.status(StatusCodes.OK).json({
      query: search || "",
      songs,
      page: pageNum,
      limit: limitNum,
    });
  },
);

/**
 * Create a new song
 * @access public
 * @route POST /api/songs/create
 */
export const createSong = asyncHandler(
  async (req: Request<{}, {}, CreateSongData>, res) => {
    // Validate required fields
    const requiredFields = ["title", "artist", "duration", "audio"];
    const fileFields = ["audio"];
    const { isValid, missingFields } = validateRequiredFieldsWithFiles(
      req.body,
      req.files,
      requiredFields,
      fileFields,
    );

    if (!isValid) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "Missing required fields",
        missingFields,
        requiredFields,
      });
      return;
    }

    // Check if song already exists for this artist
    const songExists = await SongModel.findOne({
      title: req.body.title,
      artist: req.body.artist,
    });

    if (songExists) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Song already exists for this artist" });
      return;
    }

    let audioUrl = req.body.audioUrl;
    let coverImageUrl = req.body.coverImage;

    // Handle audio file upload
    const files = req.files as
      | Record<string, Express.Multer.File[]>
      | undefined;
    if (files && files.audio && files.audio[0]) {
      const audioFile = files.audio[0];
      const audioResult = await uploadToCloudinary(audioFile.path, AUDIO_PATH);
      audioUrl = audioResult.secure_url;
    }

    // Validate that audioUrl is present before creating the song
    if (!audioUrl) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "Audio file upload failed or no audio file provided",
      });
      return;
    }

    // Handle cover image upload
    if (files && files.coverImage && files.coverImage[0]) {
      const imageFile = files.coverImage[0];
      const imageResult = await uploadToCloudinary(imageFile.path, AUDIO_PATH);
      coverImageUrl = imageResult.secure_url;
    }

    const song = await SongModel.create({
      ...req.body,
      audioUrl,
      ...(coverImageUrl && { coverImage: coverImageUrl }),
    });

    // Add song to album's songs array
    await AlbumModel.findByIdAndUpdate(
      req.body.album,
      { $push: { songs: song._id } },
      { new: true },
    );

    res
      .status(StatusCodes.CREATED)
      .json({ message: "Song created successfully", song });
  },
);

/**
 * Get song by id
 * @access public
 * @route GET /api/songs/:id
 */
export const getSongById = asyncHandler(
  async (req: Request<{ id: string }>, res) => {
    const { id } = req.params;

    const song = await SongModel.findById(id)
      .populate("album", "title coverImage description")
      .populate("featuredArtists", "name image");

    if (!song) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Song not found" });
      return;
    }

    res.json(song);
  },
);

/**
 * Update song details
 * @access private
 * @route PUT /api/songs/:id
 */
export const updateSongDetails = asyncHandler(
  async (req: Request<{ id: string }, {}, UpdateSongData>, res) => {
    const { id } = req.params;

    const song = await SongModel.findById(id);
    if (!song) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Song not found" });
      return;
    }

    let audioUrl = song.audioUrl;
    let coverImageUrl = song.coverImage;

    // Handle audio file upload
    const files = req.files as
      | Record<string, Express.Multer.File[]>
      | undefined;
    if (files && files.audio && files.audio[0]) {
      const audioFile = files.audio[0];
      const audioResult = await uploadToCloudinary(audioFile.path, AUDIO_PATH);
      audioUrl = audioResult.secure_url;
    }

    // Handle cover image upload
    if (files && files.coverImage && files.coverImage[0]) {
      const imageFile = files.coverImage[0];
      const imageResult = await uploadToCloudinary(imageFile.path, AUDIO_PATH);
      coverImageUrl = imageResult.secure_url;
    }

    const updatedSong = await SongModel.findByIdAndUpdate(
      id,
      {
        ...req.body,
        ...(audioUrl && { audioUrl }),
        ...(coverImageUrl && { coverImage: coverImageUrl }),
      },
      {
        new: true,
        runValidators: true,
      },
    )
      // .populate("artist", "name image")
      .populate("album", "title coverImage");

    res.json({ message: "Song updated successfully", song: updatedSong });
  },
);

/**
 * Delete song
 * @access public
 * @route DELETE /api/songs/:id
 */
export const deleteSong = asyncHandler(
  async (req: Request<{ id: string }>, res) => {
    const { id } = req.params;
    const song = await SongModel.findById(id);

    if (!song) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Song not found" });
      return;
    }

    // Remove song from album's songs array if it has an album
    if (song.album) {
      await AlbumModel.findByIdAndUpdate(
        song.album,
        { $pull: { songs: id } },
        { new: true },
      );
    }

    await SongModel.deleteOne({ _id: id });
    res.json({ message: "Song deleted successfully" });
  },
);

/**
 * Add album to song
 * @access public
 * @route POST /api/songs/:id/add-album
 */
export const addAlbumToSong = asyncHandler(
  async (req: Request<{ id: string }, {}, AddAlbumToSongData>, res) => {
    const { id } = req.params;
    const { albumId } = req.body;

    if (!albumId) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "Album ID is required",
      });
      return;
    }

    const song = await SongModel.findById(id);
    if (!song) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Song not found" });
      return;
    }

    const album = await AlbumModel.findById(albumId);
    if (!album) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Album not found" });
      return;
    }

    await SongModel.findByIdAndUpdate(id, { album: albumId }, { new: true });

    // Add song to album's songs array if not already present
    await AlbumModel.findByIdAndUpdate(
      albumId,
      { $addToSet: { songs: id } },
      { new: true },
    );

    res.json({ message: "Album added to song successfully" });
  },
);

/**
 * Add artist to song
 * @access public
 * @route POST /api/songs/:id/add-artist
 */
export const addArtistToSong = asyncHandler(
  async (req: Request<{ id: string }, {}, AddArtistToSongData>, res) => {
    const { id } = req.params;
    const { artistId } = req.body;

    if (!artistId) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "Artist ID is required",
      });
      return;
    }

    const song = await SongModel.findById(id);
    if (!song) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Song not found" });
      return;
    }

    const artist = await ArtistModel.findById(artistId);
    if (!artist) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Artist not found" });
      return;
    }

    // Add artist to featured artists array (prevents duplicates)
    await SongModel.findByIdAndUpdate(
      id,
      { $addToSet: { featuredArtists: artistId } },
      { new: true },
    );

    res.json({ message: "Artist added to song successfully" });
  },
);
