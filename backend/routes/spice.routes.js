import express from "express";
import {
  createSpice,
  getSpices,
  getSpice,
  updateSpice,
  deleteSpice,
} from "../controllers/spice.controller.js";

const router = express.Router();

router.post("/", createSpice);
router.get("/", getSpices);
router.get("/:id", getSpice);
router.put("/:id", updateSpice);
router.delete("/:id", deleteSpice);

export default router;
