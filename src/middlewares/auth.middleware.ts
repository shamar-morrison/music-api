import type { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { UserModel } from "models/user.model";

type JwtPayload = {
  id: string;
  iat: number;
  exp: number;
};

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        profilePicture: string;
        isAdmin: boolean;
      };
    }
  }
}

export const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (
      !req.headers.authorization?.startsWith("Bearer") ||
      !req.headers.authorization
    ) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Not authorized, no token" });
      return;
    }

    // token should exist atp
    try {
      const token = req.headers.authorization.split(" ")[1]!;
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      const user = await UserModel.findById(decoded.id).select("-password");

      if (!user) {
        res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: "User does not exist" });
        return;
      }
      req.user = {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        isAdmin: user.isAdmin,
      };
      next();
    } catch (error: any) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Not authorized, invalid token" });
      return;
    }
  },
);

export const isAdmin = asyncHandler(async (req, res, next) => {
  if (!req.user || !req.user?.isAdmin) {
    res
      .status(StatusCodes.FORBIDDEN)
      .json({ message: "User is not authorized to perform this action" });
    return;
  }
  next();
});
