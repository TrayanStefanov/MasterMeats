import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getLastOrder } from "../controllers/order.controller.js";

const router = express.Router();

router.get("/last", protectRoute, getLastOrder);

export default router;