import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createPaymentIntent, confirmPayment } from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/create-payment-intent", protectRoute, createPaymentIntent);
router.post("/confirm-payment", protectRoute, confirmPayment);

export default router;
