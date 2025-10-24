import "reflect-metadata";

import dotenv from "dotenv";
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import { artistRouter } from "routes/artist.routes";
import { userRouter } from "routes/user.routes.js";
import { limiter } from "utils/rate-limiter";
import { albumRouter } from "routes/album.routes";

dotenv.config();
const app = express();

// Allow JSON to be parsed
app.use(express.json());

// Rate limit
app.use(limiter);

// connect to database
mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log("Connected to mongoDB database");
  })
  .catch((err) => {
    console.log(err);
  });

// Routes
app.use("/api/users", userRouter);
app.use("/api/artists", artistRouter);
app.use("/api/albums", albumRouter);

// Error handling middleware
// 404 errors
app.use((_req, _res, next) => {
  const error: any = new Error("Not Found");
  error.status = StatusCodes.NOT_FOUND;
  next(error);
});

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  res
    .status(err.status || StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ message: err.message || "Not Found", status: "error" });
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
