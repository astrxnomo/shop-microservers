import { Router } from "express";
import * as orderController from "../controllers/order.controller";

const router = Router();
router.get("/", orderController.listOrders);
router.get("/:id", orderController.getOrder);
router.post("/", orderController.checkout);
export default router;
