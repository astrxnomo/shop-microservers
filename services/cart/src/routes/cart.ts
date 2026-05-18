import { Router } from "express";
import * as cartController from "../controllers/cart.controller";

const router = Router();
router.get("/", cartController.getCart);
router.post("/items", cartController.addItem);
router.delete("/items/:productId", cartController.removeItem);
router.delete("/", cartController.clearCart);
export default router;
