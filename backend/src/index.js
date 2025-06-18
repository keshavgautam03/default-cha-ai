import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import userRoutes from "./routes/user.route.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

// Check for required environment variables
const requiredEnvVars = ['JWT_SECRET', 'MONGODB_URI', 'GEMINI_API_KEY', 'FRONTEND_URL'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('ERROR: Missing required environment variables:', missingEnvVars.join(', '));
  process.exit(1);
}

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === "production" 
    ? process.env.FRONTEND_URL 
    : "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected:", mongoose.connection.host);
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`Server is running on PORT:${PORT}`);
  console.log('Environment variables configured:');
  console.log('- JWT_SECRET:', process.env.JWT_SECRET ? 'Yes' : 'No');
  console.log('- MONGODB_URI:', process.env.MONGODB_URI ? 'Yes' : 'No');
  console.log('- GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'Yes' : 'No');
  console.log('- FRONTEND_URL:', process.env.FRONTEND_URL ? 'Yes' : 'No');
});
