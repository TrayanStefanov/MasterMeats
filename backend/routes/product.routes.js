import express from "express";
import { createProduct, updateProduct, deleteProduct, getAllProducts, getProductById, enableProduct, disableProduct} from "../controllers/product.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", protectRoute, getProductById);
router.post("/", protectRoute, adminRoute, createProduct);
router.put("/:id", protectRoute, adminRoute, updateProduct);
router.delete("/:id", protectRoute, adminRoute, deleteProduct);
router.patch("/:id/enable", protectRoute, adminRoute, enableProduct);
router.patch("/:id/disable", protectRoute, adminRoute, disableProduct);

export default router;