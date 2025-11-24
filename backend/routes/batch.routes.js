import express from "express";
import {
  createBatch,
  getBatches,
  getBatch,
  updateBatch,
  addSeasoningEntry,
  addVacuumEntry,
  finishBatch,
  deleteBatch,
  updateSourcingPhase,
  updatePreppingPhase,
  updateCuringPhase
} from "../controllers/batch.controller.js";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

/* ----------------------- BATCH CRUD ----------------------- */
router.post("/", protectRoute, adminRoute, createBatch);
router.get("/", protectRoute, adminRoute, getBatches);
router.get("/:id", protectRoute, adminRoute, getBatch);
router.delete("/:id", protectRoute, adminRoute, deleteBatch);

/* --------------------- PHASE-SPECIFIC --------------------- */
router.put("/:id/sourcing", protectRoute, adminRoute, updateSourcingPhase);
router.put("/:id/prepping", protectRoute, adminRoute, updatePreppingPhase);
router.put("/:id/curing", protectRoute, adminRoute, updateCuringPhase);
router.post("/:id/seasoning", protectRoute, adminRoute, addSeasoningEntry);
router.post("/:id/vacuum", protectRoute, adminRoute, addVacuumEntry);
router.post("/:id/finish", protectRoute, adminRoute, finishBatch);

export default router;
