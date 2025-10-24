import express from "express";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";
import { updateLocale, removeLocaleKey } from "../controllers/locale.controller.js";

const router = express.Router();

router.post("/update", protectRoute, adminRoute, updateLocale);
router.delete("/:name", protectRoute, adminRoute, removeLocaleKey);

export default router;
