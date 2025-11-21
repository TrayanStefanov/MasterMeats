import express from "express";
import {
  createSpiceMix,
  getSpiceMixes,
  getSpiceMix,
  updateSpiceMix,
  addStockToMix,
  deleteSpiceMix,
  getAllTags
} from "../controllers/spiceMix.controller.js";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, adminRoute, createSpiceMix);
router.get("/", protectRoute, adminRoute, getSpiceMixes);
router.get("/tags", protectRoute, adminRoute, getAllTags);
router.get("/:id", protectRoute, adminRoute, getSpiceMix);
router.put("/:id", protectRoute, adminRoute, updateSpiceMix);
router.put("/:id/addStock", protectRoute, adminRoute, addStockToMix);
router.delete("/:id", protectRoute, adminRoute, deleteSpiceMix);

export default router;
