import mongoose from "mongoose";

// Cache the database connection to reuse across serverless function invocations
let cachedConnection: typeof mongoose | null = null;
let connectionPromise: Promise<typeof mongoose> | null = null;

/**
 * Connect to MongoDB with connection caching for serverless environments
 * Reuses existing connection if available, otherwise creates a new one
 * Protects against concurrent connection attempts during cold starts
 */
export const connectDB = async (): Promise<typeof mongoose> => {
  // If we have a cached connection and it's connected, reuse it
  if (cachedConnection && mongoose.connection.readyState === 1) {
    console.log("Using cached database connection");
    return cachedConnection;
  }

  // If connection is in progress (readyState === 2), wait for it
  if (mongoose.connection.readyState === 2) {
    console.log("Connection attempt in progress, waiting...");
    if (connectionPromise) {
      return connectionPromise;
    }
  }

  // Guard: Only create new connection if disconnected (readyState === 0)
  if (mongoose.connection.readyState === 0) {
    try {
      const mongoUri = process.env.MONGODB_URI;

      if (!mongoUri) {
        throw new Error("MONGODB_URI environment variable is not defined");
      }

      console.log("Creating new database connection...");

      // Create connection promise to prevent concurrent attempts
      connectionPromise = mongoose.connect(mongoUri, {
        // Optimize for serverless - reduce connection pool
        maxPoolSize: 10,
        minPoolSize: 2,
        // Shorter timeouts for faster failure detection
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      // Wait for connection to complete
      const connection = await connectionPromise;

      console.log("Connected to MongoDB database");

      // Cache the connection
      cachedConnection = connection;

      return connection;
    } catch (error) {
      console.error("MongoDB connection error:", error);
      // Reset cached connection and promise on error
      cachedConnection = null;
      connectionPromise = null;
      throw error;
    }
  }

  // If we reach here, connection exists but may not be ready
  // Return cached connection or wait for connection promise
  if (cachedConnection) {
    return cachedConnection;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  throw new Error("Unexpected connection state");
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
