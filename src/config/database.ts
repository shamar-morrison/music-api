import mongoose from "mongoose";

// Cache the database connection to reuse across serverless function invocations
let cachedConnection: typeof mongoose | null = null;

/**
 * Connect to MongoDB with connection caching for serverless environments
 * Reuses existing connection if available, otherwise creates a new one
 */
export const connectDB = async (): Promise<typeof mongoose> => {
  // If we have a cached connection and it's connected, reuse it
  if (cachedConnection && mongoose.connection.readyState === 1) {
    console.log("Using cached database connection");
    return cachedConnection;
  }

  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error("MONGODB_URI environment variable is not defined");
    }

    console.log("Creating new database connection...");

    // Connect to MongoDB with optimized settings for serverless
    const connection = await mongoose.connect(mongoUri, {
      // Optimize for serverless - reduce connection pool
      maxPoolSize: 10,
      minPoolSize: 2,
      // Shorter timeouts for faster failure detection
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log("Connected to MongoDB database");

    // Cache the connection
    cachedConnection = connection;

    return connection;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    // Reset cached connection on error
    cachedConnection = null;
    throw error;
  }
};

/**
 * Disconnect from MongoDB (typically only needed in tests or shutdown)
 */
export const disconnectDB = async (): Promise<void> => {
  if (cachedConnection) {
    await mongoose.disconnect();
    cachedConnection = null;
    console.log("Disconnected from MongoDB");
  }
};
