import express from "express";
import {getAllReservations, createReservation, updateReservation, deleteReservation,} from "../controllers/reservation.controller.js";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Admin-only access
router.get("/", protectRoute, adminRoute, getAllReservations);
router.post("/", protectRoute, adminRoute, createReservation);
router.put("/:id", protectRoute, adminRoute, updateReservation);
router.delete("/:id", protectRoute, adminRoute, deleteReservation);

export default router;
