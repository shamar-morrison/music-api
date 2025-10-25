import asyncHandler from "express-async-handler";
/**
 * Get all songs
 * @access public
 * @route GET /api/songs
 */
export const getAllSongs = asyncHandler(async (_req, res) => {});

/**
 * Create a new song
 * @access public
 * @route POST /api/songs/create
 */
export const createSong = asyncHandler(async (_req, res) => {});

/**
 * Get song by id
 * @access public
 * @route GET /api/songs/:id
 */
export const getSongById = asyncHandler(async (_req, res) => {});

/**
 * Update song details
 * @access public
 * @route PUT /api/songs/:id
 */
export const updateSongDetails = asyncHandler(async (_req, res) => {});

/**
 * Delete song
 * @access public
 * @route DELETE /api/songs/:id
 */
export const deleteSong = asyncHandler(async (_req, res) => {});

/**
 * Add album to song
 * @access public
 * @route POST /api/songs/:id/add-album
 */
export const addAlbumToSong = asyncHandler(async (_req, res) => {});

/**
 * Add artist to song
 * @access public
 * @route POST /api/songs/:id/add-artist
 */
export const addArtistToSong = asyncHandler(async (_req, res) => {});
