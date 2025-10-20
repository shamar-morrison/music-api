import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { User, UserModel } from "models/user.model.js";
import type { Request, Response } from "express";

// Register a new user
export const createUser = asyncHandler(
  async (req: Request<{}, {}, User>, res: Response) => {
    const { name, email, password } = req.body;

    const userExists = await UserModel.findOne({ email });

    if (userExists) {
      res.status(StatusCodes.BAD_REQUEST);
      throw new Error("User already exists");
    }

    UserModel.create({ name, email, password })
      .then(({ email, name }) => {
        res.status(StatusCodes.CREATED).json({
          message: "User created successfully",
          user: { name, email },
        });
      })
      .catch((error) => {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        throw new Error(error.message);
      });
  },
);
