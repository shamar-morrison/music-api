import "reflect-metadata";

import dotenv from "dotenv";
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { StatusCodes } from "http-status-codes";
import path from "path";
import swaggerUi from "swagger-ui-express";
import { fileURLToPath } from "url";

import { swaggerSpec } from "./config/swagger.js";
import { albumRouter } from "./routes/album.routes.js";
import { artistRouter } from "./routes/artist.routes.js";
import { songsRouter } from "./routes/songs.routes.js";
import { userRouter } from "./routes/user.routes.js";
import { limiter } from "./utils/rate-limiter.js";

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
const publicPath = path.join(__dirname, "public");
app.use(express.static(publicPath));

// Serve index.html for root path
app.get("/", (_req: Request, res: Response) => {
  res.sendFile(path.join(publicPath, "index.html"));
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

// Export app for testing or serverless environments
export default app;

// Start server when this file is run directly (not imported)
// This check ensures the server starts on Railway/Render but can still be imported for testing
const isMainModule = process.argv[1] === fileURLToPath(import.meta.url);

if (isMainModule) {
  // Import connectDB to establish database connection
  import("./config/database.js")
    .then(({ connectDB }) => {
      connectDB()
        .then(() => {
          const PORT = process.env.PORT || 5000;
          app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
          });
        })
        .catch((error) => {
          console.error("Failed to connect to database:", error);
          process.exit(1);
        });
    })
    .catch((error) => {
      console.error("Failed to load database module:", error);
      process.exit(1);
    });
}
