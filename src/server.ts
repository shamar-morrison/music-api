import "reflect-metadata";

import dotenv from "dotenv";
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import path from "path";
import { albumRouter } from "routes/album.routes";
import { artistRouter } from "routes/artist.routes";
import { songsRouter } from "routes/songs.routes";
import { userRouter } from "routes/user.routes.js";
import swaggerUi from "swagger-ui-express";
import { fileURLToPath } from "url";
import { limiter } from "utils/rate-limiter";

import { swaggerSpec } from "./config/swagger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

// Allow JSON and form data to be parsed
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limit
app.use(limiter);

// Swagger UI - served from /api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Serve static files (Swagger UI standalone) - root path
// In Vercel serverless, __dirname will be in .vercel/output, so we need to go up to find public
const publicPath = process.env.VERCEL
  ? path.join(process.cwd(), "public")
  : path.join(__dirname, "public");
app.use(express.static(publicPath));

// Serve index.html for root path
app.get("/", (_req: Request, res: Response) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

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
app.use("/api/songs", songsRouter);

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

// Export app for Vercel serverless
export default app;

// Only listen when running locally (not in Vercel)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
