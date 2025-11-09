import type { Request, Response } from "express";
import app from "../src/server.js";
import { connectDB } from "../src/config/database.js";

// Serverless function handler that ensures database connection
export default async (req: Request, res: Response) => {
  try {
    // Ensure database is connected (uses cached connection if available)
    await connectDB();

    // Handle the request with Express app
    return app(req, res);
  } catch (error) {
    console.error("Error in serverless function:", error);
    return res.status(500).json({
      error: {
        code: "500",
        message: "Database connection failed",
      },
    });
  }
};
