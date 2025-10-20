import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
const app = express();

// connect to database
mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log("Connected to mongoDB database");
  })
  .catch((err: any) => {
    console.log(err);
  });

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
