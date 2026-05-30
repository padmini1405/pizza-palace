import express from "express";

import { cancelOrder, createOrder, getAllOrders, getMyOrders, updateOrderStatus, } from "../controllers/orderController.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";


const router = express.Router();

router.post("/", verifyToken, createOrder);

router.get("/", verifyToken ,isAdmin ,getAllOrders);

router.get("/my", verifyToken, getMyOrders);

router.put("/:id/status", verifyToken, isAdmin, updateOrderStatus);

router.delete("/:id", verifyToken, cancelOrder);

export default router;