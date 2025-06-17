import express from "express";
import { getMessages, getUsersForSidebar, sendMessage, getChatSuggestion } from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Get all users for sidebar
router.get("/users", protectRoute, getUsersForSidebar);

// Get messages for a specific conversation
router.get("/conversation/:id", protectRoute, getMessages);

// Send a message
router.post("/send/:id", protectRoute, sendMessage);

// Get chat suggestion
router.post("/suggest/:id", protectRoute, getChatSuggestion);

export default router;
