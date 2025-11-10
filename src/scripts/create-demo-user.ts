import "reflect-metadata";

import dotenv from "dotenv";

import { connectDB, disconnectDB } from "../config/database.js";
import { UserModel } from "../models/user.model.js";

dotenv.config();

/**
 * Script to create a demo user account for API testing
 * Run this once in production to seed the demo account
 */
async function createDemoUser() {
  let exitCode = 0;

  try {
    console.log("Connecting to database...");
    await connectDB();

    // Check if demo user already exists
    const existingDemoUser = await UserModel.findOne({
      email: "demo@musicapi.com",
    });

    if (existingDemoUser) {
      console.log("✅ Demo user already exists!");
      return;
    }

    // Create demo user
    await UserModel.create({
      name: "Demo User",
      email: "demo@musicapi.com",
      password: "demo123456",
      isAdmin: false,
    });

    console.log("✅ Demo user created successfully!");
  } catch (error) {
    console.error("❌ Error creating demo user:", error);
    exitCode = 1;
  } finally {
    // Always close the database connection before exiting
    await disconnectDB();
    process.exit(exitCode);
  }
}

// Run the script
createDemoUser();
