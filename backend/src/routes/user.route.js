import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { saveRelationship } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/relationship/:userId", protectRoute, saveRelationship);

export default router; 