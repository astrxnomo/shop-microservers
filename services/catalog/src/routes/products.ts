import { Router } from "express";
import * as productController from "../controllers/product.controller";

const router = Router();
router.get("/", productController.listProducts);
router.get("/:id", productController.getProduct);
router.patch("/:id/stock", productController.updateStock);
export default router;
