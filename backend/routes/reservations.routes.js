import express from "express";
import {getAllReservations, getReservationById, createReservation, updateReservation, deleteReservation, completeReservation,} from "../controllers/reservation.controller.js";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Admin-only access
router.get("/", protectRoute, adminRoute, getAllReservations);
router.get("/:id", protectRoute, adminRoute, getReservationById);
router.post("/", protectRoute, adminRoute, createReservation);
router.patch("/:id", protectRoute, adminRoute, completeReservation);
router.put("/:id", protectRoute, adminRoute, updateReservation);
router.delete("/:id", protectRoute, adminRoute, deleteReservation);

export default router;
