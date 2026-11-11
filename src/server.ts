import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import apiRoutes from "./routes/api";

dotenv.config();

const app = express();
app.use(express.json());

// API Endpoints
app.use("/api", apiRoutes);

// Connect to MongoDB and start the server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI as string;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

//
