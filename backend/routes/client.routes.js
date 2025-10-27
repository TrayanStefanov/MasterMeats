import express from "express";
import {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
} from "../controllers/client.controller.js";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, adminRoute, getAllClients);
router.get("/:id", protectRoute, adminRoute, getClientById);
router.post("/", protectRoute, adminRoute, createClient);
router.put("/:id", protectRoute, adminRoute, updateClient);
router.delete("/:id", protectRoute, adminRoute, deleteClient);

export default router;
