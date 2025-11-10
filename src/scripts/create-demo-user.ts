import "reflect-metadata";
import dotenv from "dotenv";
import { connectDB } from "../config/database.js";
import { UserModel } from "../models/user.model.js";

dotenv.config();

/**
 * Script to create a demo user account for API testing
 * Run this once in production to seed the demo account
 */
async function createDemoUser() {
  try {
    console.log("Connecting to database...");
    await connectDB();

    // Check if demo user already exists
    const existingDemoUser = await UserModel.findOne({
      email: "demo@musicapi.com",
    });

    if (existingDemoUser) {
      console.log("✅ Demo user already exists!");
      console.log("Email: demo@musicapi.com");
      console.log("Password: demo123456");
      process.exit(0);
    }

    // Create demo user
    console.log("Creating demo user...");
    const demoUser = await UserModel.create({
      name: "Demo User",
      email: "demo@musicapi.com",
      password: "demo123456",
      isAdmin: false,
    });

    console.log("✅ Demo user created successfully!");
    console.log("\nDemo Credentials:");
    console.log("==================");
    console.log("Email: demo@musicapi.com");
    console.log("Password: demo123456");
    console.log("User ID:", demoUser._id);
    console.log("\nUsers can now test the API with these credentials.");
    console.log(
      "Add these credentials to your Swagger documentation for easy access.",
    );

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating demo user:", error);
    process.exit(1);
  }
}

// Run the script
createDemoUser();
