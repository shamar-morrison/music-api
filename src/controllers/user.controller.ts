import type { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { User, UserModel } from "models/user.model.js";

/**
 * Regiser a new user
 * @access public
 * @route /api/users/regiser
 */
export const createUser = asyncHandler(
  async (req: Request<{}, {}, User>, res: Response) => {
    if (!req.body) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "request body is required" });
      return;
    }

    const { name, email, password, isAdmin } = req.body;
    const userExists = await UserModel.findOne({ email });

    if (userExists) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "User already exists" });
      return;
    }

    UserModel.create({ name, email, password, isAdmin })
      .then(({ email, name, _id }) => {
        res.status(StatusCodes.CREATED).json({
          user: { _id, name, email },
        });
      })
      .catch((error) => {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
      });
  },
);

/**
 * Login user
 * @access public
 * @route /api/users/login
 */
export const loginUser = asyncHandler(
  async (req: Request<{}, {}, User>, res: Response) => {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Invalid credentials" });
      return;
    }
    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        _id: user._id,
        token: user.generateToken(user._id.toString()),
        email: user.email,
        profile_image: user.profilePicture,
        isAdmin: user.isAdmin,
      },
    });
    return;
  },
);

/**
 * Get user profile
 * @access private
 * @route /api/users/profile
 */
export const getUserProfile = asyncHandler(async (req, res) => {
  if (!req.user) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "User not authenticated" });
    return;
  }

  const user = await UserModel.findById(req.user.id)
    .select("-password")
    .populate("likedSongs")
    .populate("likedAlbums")
    .populate("followedArtists")
    .populate("followedPlaylists")
    .lean();

  if (!user) {
    res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
    return;
  }

  res.status(StatusCodes.OK).json({
    user: {
      ...user,
      likedSongs: user.likedSongs || [],
      likedAlbums: user.likedAlbums || [],
      followedArtists: user.followedArtists || [],
      followedPlaylists: user.followedPlaylists || [],
    },
  });
});

/**
 * Update user profile
 * @access private
 * @route /api/users/profile
 */
export const updateUserProfile = asyncHandler(
  async (
    req: Request<
      {},
      {},
      { name: string; email: string; profilePicture: string }
    >,
    res,
  ) => {
    if (!req.user) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "User not authenticated" });
      return;
    }

    const user = await UserModel.findById(req.user.id);
    if (!user) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
      return;
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.user.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    res.json({ message: "user updated sucessfully", updatedUser });
  },
);
