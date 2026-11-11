import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import apiRoutes from "./routes/api";

dotenv.config();

const portEnv = process.env.PORT;
if (!portEnv) {
  throw new Error("PORT environment variable is required");
}
const PORT = parseInt(portEnv, 10);
if (isNaN(PORT)) {
  throw new Error("PORT must be a valid number");
}

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  throw new Error("MONGO_URI environment variable is required");
}

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

const corsOriginEnv = process.env.CORS_ORIGIN;
if (!corsOriginEnv) {
  throw new Error("CORS_ORIGIN environment variable is required");
}
const allowedOrigins = corsOriginEnv
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

if (allowedOrigins.length === 0) {
  throw new Error("CORS_ORIGIN must specify at least one valid origin");
}

const app = express();
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

// API Endpoints
app.use("/api", apiRoutes);

// Connect to MongoDB and start the server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
    server.on("error", (error) => {
      console.error("Server listen error:", error);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

//
