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

const router = express.Router();

router.post("/", createSpiceMix);
router.get("/", getSpiceMixes);
router.get("/tags", getAllTags);
router.get("/:id", getSpiceMix);
router.put("/:id", updateSpiceMix);
router.put("/:id/addStock", addStockToMix);
router.delete("/:id", deleteSpiceMix);

export default router;
