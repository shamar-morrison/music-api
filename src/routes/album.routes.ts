import {
  addSongsToAlbum,
  createAlbum,
  deleteAlbum,
  getAlbumById,
  getAlbums,
  updateAlbum,
} from "controllers/album.controller";
import { Router } from "express";
import { isAdmin, protect } from "middlewares/auth.middleware";
import { upload } from "middlewares/upload";

export const albumRouter = Router();

/**
 * @swagger
 * /api/albums:
 *   get:
 *     summary: Get all albums
 *     description: Retrieve a list of all albums
 *     tags: [Albums]
 *     responses:
 *       200:
 *         description: List of albums retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Album'
 */
albumRouter.get("/", getAlbums);

/**
 * @swagger
 * /api/albums/create:
 *   post:
 *     summary: Create a new album (Admin only)
 *     description: Create a new album with title, description, artist, and optional cover image
 *     tags: [Albums]
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
 *               - description
 *               - artist
 *               - releaseDate
 *             properties:
 *               title:
 *                 type: string
 *                 description: Album title
 *               description:
 *                 type: string
 *                 description: Album description
 *               artist:
 *                 type: string
 *                 description: Artist ID
 *               releaseDate:
 *                 type: string
 *                 format: date
 *                 description: Release date
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Album cover image file
 *               genre:
 *                 type: string
 *               isExplicit:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Album created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Album'
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
albumRouter.post(
  "/create",
  protect,
  isAdmin,
  upload.single("image"),
  createAlbum,
);

/**
 * @swagger
 * /api/albums/{id}/add-songs:
 *   delete:
 *     summary: Add songs to album (Admin only)
 *     description: Add songs to an existing album
 *     tags: [Albums]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Album ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               songIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of song IDs to add
 *     responses:
 *       200:
 *         description: Songs added to album successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Album'
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
 *         description: Album not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
albumRouter.delete("/:id/add-songs", protect, isAdmin, addSongsToAlbum);

/**
 * @swagger
 * /api/albums/{id}:
 *   get:
 *     summary: Get album by ID
 *     description: Retrieve detailed information about a specific album
 *     tags: [Albums]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Album ID
 *     responses:
 *       200:
 *         description: Album retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Album'
 *       404:
 *         description: Album not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
albumRouter.get("/:id", getAlbumById);

/**
 * @swagger
 * /api/albums/{id}:
 *   post:
 *     summary: Update album (Admin only)
 *     description: Update an existing album's information
 *     tags: [Albums]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Album ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               artist:
 *                 type: string
 *               releaseDate:
 *                 type: string
 *                 format: date
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Album cover image file
 *               genre:
 *                 type: string
 *               isExplicit:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Album updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Album'
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
 *         description: Album not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
albumRouter.post("/:id", protect, isAdmin, upload.single("image"), updateAlbum);

/**
 * @swagger
 * /api/albums/{id}:
 *   delete:
 *     summary: Delete an album (Admin only)
 *     description: Delete an album from the database
 *     tags: [Albums]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Album ID
 *     responses:
 *       200:
 *         description: Album deleted successfully
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
 *         description: Album not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
albumRouter.delete("/:id", protect, isAdmin, deleteAlbum);
