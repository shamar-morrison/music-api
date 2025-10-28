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

/**
 * @swagger
 * /api/songs:
 *   get:
 *     summary: Get all songs
 *     description: Retrieve a list of all songs
 *     tags: [Songs]
 *     responses:
 *       200:
 *         description: List of songs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Song'
 */
songsRouter.get("/", getAllSongs);

/**
 * @swagger
 * /api/songs/create:
 *   post:
 *     summary: Create a new song (Admin only)
 *     description: Create a new song with audio file and optional cover image
 *     tags: [Songs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - artist
 *               - duration
 *               - audio
 *             properties:
 *               title:
 *                 type: string
 *                 description: Song title
 *               artist:
 *                 type: string
 *                 description: Artist ID
 *               album:
 *                 type: string
 *                 description: Album ID
 *               duration:
 *                 type: number
 *                 description: Duration in seconds
 *               audio:
 *                 type: string
 *                 format: binary
 *                 description: Audio file
 *               coverImage:
 *                 type: string
 *                 format: binary
 *                 description: Cover image file
 *               genre:
 *                 type: string
 *               isExplicit:
 *                 type: boolean
 *               featuredArtists:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of featured artist IDs
 *               releaseDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Song created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Song'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /api/songs/{id}:
 *   get:
 *     summary: Get song by ID
 *     description: Retrieve detailed information about a specific song
 *     tags: [Songs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Song ID
 *     responses:
 *       200:
 *         description: Song retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Song'
 *       404:
 *         description: Song not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
songsRouter.get("/:id", getSongById);

/**
 * @swagger
 * /api/songs/{id}:
 *   put:
 *     summary: Update song details (Admin only)
 *     description: Update an existing song's information
 *     tags: [Songs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Song ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               artist:
 *                 type: string
 *               album:
 *                 type: string
 *               genre:
 *                 type: string
 *               isExplicit:
 *                 type: boolean
 *               featuredArtists:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Song updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Song'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Song not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
songsRouter.put("/:id", protect, isAdmin, updateSongDetails);

/**
 * @swagger
 * /api/songs/{id}:
 *   delete:
 *     summary: Delete a song (Admin only)
 *     description: Delete a song from the database
 *     tags: [Songs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Song ID
 *     responses:
 *       200:
 *         description: Song deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Song not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
songsRouter.delete("/:id", protect, isAdmin, deleteSong);

/**
 * @swagger
 * /api/songs/{id}/add-album:
 *   post:
 *     summary: Add album to song (Admin only)
 *     description: Associate an album with a song
 *     tags: [Songs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Song ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - albumId
 *             properties:
 *               albumId:
 *                 type: string
 *                 description: Album ID to add
 *     responses:
 *       200:
 *         description: Album added to song successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Song'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Song or album not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
songsRouter.post("/:id/add-album", addAlbumToSong);

/**
 * @swagger
 * /api/songs/{id}/add-artist:
 *   post:
 *     summary: Add artist to song (Admin only)
 *     description: Associate an artist with a song
 *     tags: [Songs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Song ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - artistId
 *             properties:
 *               artistId:
 *                 type: string
 *                 description: Artist ID to add
 *     responses:
 *       200:
 *         description: Artist added to song successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Song'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Song or artist not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
songsRouter.post("/:id/add-artist", addArtistToSong);
