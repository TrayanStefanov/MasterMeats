import express from "express";
import {
  createSpiceMix,
  getSpiceMixes,
  getSpiceMix,
  updateSpiceMix,
  deleteSpiceMix,
} from "../controllers/spiceMix.controller.js";

const router = express.Router();

router.post("/", createSpiceMix);
router.get("/", getSpiceMixes);
router.get("/:id", getSpiceMix);
router.put("/:id", updateSpiceMix);
router.delete("/:id", deleteSpiceMix);

export default router;
