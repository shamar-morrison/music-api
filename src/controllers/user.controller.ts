import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { User, UserModel } from "models/user.model.js";
import type { Request, Response } from "express";

/**
 * Regiser a new user
 * @access public
 * @route /api/users/regiser
 */
export const createUser = asyncHandler(
  async (req: Request<{}, {}, User>, res: Response) => {
    const { name, email, password } = req.body;
    const userExists = await UserModel.findOne({ email });

    if (userExists) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "User already exists" });
      return;
    }

    UserModel.create({ name, email, password })
      .then(({ email, name }) => {
        res.status(StatusCodes.CREATED).json({
          message: "User created successfully",
          user: { name, email },
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

    const user = await UserModel.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Invalid credentials" });
      return;
    }
    res.status(StatusCodes.OK).json({
      message: "Successfully logged in",
      data: {
        _id: user._id,
        token: "",
        email: user.email,
        profile_image: user.profilePicture,
        is_admin: user.isAdmin,
      },
    });
    return;
  },
);
