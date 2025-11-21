import express from "express";
import {
  createBatch,
  getBatches,
  getBatch,
  updateBatch,
  addSeasoningEntry,
  addVacuumEntry,
  finishBatch,
  deleteBatch
} from "../controllers/batch.controller.js";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

/* ----------------------- BATCH CRUD ----------------------- */
router.post("/",protectRoute, adminRoute, createBatch);
router.get("/",protectRoute, adminRoute, getBatches);
router.get("/:id",protectRoute, adminRoute, getBatch);
router.put("/:id",protectRoute, adminRoute, updateBatch);
router.delete("/:id",protectRoute, adminRoute, deleteBatch);

/* --------------------- STAGE-SPECIFIC ---------------------- */
router.post("/:id/seasoning",protectRoute, adminRoute, addSeasoningEntry);
router.post("/:id/vacuum",protectRoute, adminRoute, addVacuumEntry);
router.post("/:id/finish",protectRoute, adminRoute, finishBatch);

export default router;
