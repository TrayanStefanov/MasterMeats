import express from "express";
import {
  createSpice,
  getSpices,
  getSpice,
  updateSpice,
  deleteSpice,
} from "../controllers/spice.controller.js";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, adminRoute, createSpice);
router.get("/", protectRoute, adminRoute, getSpices);
router.get("/:id", protectRoute, adminRoute, getSpice);
router.put("/:id", protectRoute, adminRoute, updateSpice);
router.delete("/:id", protectRoute, adminRoute, deleteSpice);

export default router;
