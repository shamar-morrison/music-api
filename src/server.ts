import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { userRouter } from "routes/user.routes.js";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());

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

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
