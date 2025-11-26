import express from "express";
import {
  createBatch,
  getBatches,
  getBatch,
  finishBatch,
  deleteBatch,
  updateSourcingPhase,
  updatePreppingPhase,
  updateCuringPhase,
  updateSeasoningPhase,
  updateVacuumPhase
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
router.put("/:id/seasoning", protectRoute, adminRoute, updateSeasoningPhase);
router.put("/:id/vacuum", protectRoute, adminRoute, updateVacuumPhase);
router.put("/:id/finish", protectRoute, adminRoute, finishBatch);

export default router;
