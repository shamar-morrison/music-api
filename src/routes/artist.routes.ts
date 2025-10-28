import {
  createArtist,
  deleteArtist,
  getArtistById,
  getArtists,
  getArtistTopSongs,
  getTopArtists,
  updateArtistDetails,
} from "controllers/artist.controller";
import { Router } from "express";
import { isAdmin, protect } from "middlewares/auth.middleware";
import { upload } from "middlewares/upload";

export const artistRouter = Router();

/**
 * @swagger
 * /api/artists:
 *   get:
 *     summary: Get all artists
 *     description: Retrieve a list of all artists
 *     tags: [Artists]
 *     responses:
 *       200:
 *         description: List of artists retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Artist'
 */
artistRouter.get("/", getArtists);

/**
 * @swagger
 * /api/artists/top:
 *   get:
 *     summary: Get top artists
 *     description: Retrieve a list of the most followed artists
 *     tags: [Artists]
 *     responses:
 *       200:
 *         description: Top artists retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Artist'
 */
artistRouter.get("/top", getTopArtists);

/**
 * @swagger
 * /api/artists/{id}/top-songs:
 *   get:
 *     summary: Get artist's top songs
 *     description: Retrieve the most popular songs by a specific artist
 *     tags: [Artists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Artist ID
 *     responses:
 *       200:
 *         description: Artist's top songs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Song'
 *       404:
 *         description: Artist not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
artistRouter.get("/:id/top-songs", getArtistTopSongs);

/**
 * @swagger
 * /api/artists/{id}:
 *   get:
 *     summary: Get artist by ID
 *     description: Retrieve detailed information about a specific artist
 *     tags: [Artists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Artist ID
 *     responses:
 *       200:
 *         description: Artist retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Artist'
 *       404:
 *         description: Artist not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
artistRouter.get("/:id", getArtistById);

/**
 * @swagger
 * /api/artists/create:
 *   post:
 *     summary: Create a new artist (Admin only)
 *     description: Create a new artist profile with name, bio, and optional image
 *     tags: [Artists]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - bio
 *             properties:
 *               name:
 *                 type: string
 *                 description: Artist name
 *               bio:
 *                 type: string
 *                 description: Artist biography
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Artist image file
 *               genres:
 *                 type: array
 *                 items:
 *                   type: string
 *               isVerified:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Artist created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Artist'
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
artistRouter.post(
  "/create",
  protect,
  isAdmin,
  upload.single("image"),
  createArtist,
);

/**
 * @swagger
 * /api/artists/{id}:
 *   put:
 *     summary: Update artist details
 *     description: Update an existing artist's information
 *     tags: [Artists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Artist ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               bio:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Artist image file
 *               genres:
 *                 type: array
 *                 items:
 *                   type: string
 *               isVerified:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Artist updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Artist'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Artist not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
artistRouter.put("/:id", protect, upload.single("image"), updateArtistDetails);

/**
 * @swagger
 * /api/artists/{id}:
 *   delete:
 *     summary: Delete an artist (Admin only)
 *     description: Delete an artist from the database
 *     tags: [Artists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Artist ID
 *     responses:
 *       200:
 *         description: Artist deleted successfully
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
 *         description: Artist not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
artistRouter.delete("/:id", protect, isAdmin, deleteArtist);
