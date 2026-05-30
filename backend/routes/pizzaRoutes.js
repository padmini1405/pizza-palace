import express from "express";

import { createPizza, getAllPizza, getSinglePizza, updatePizza, deletePizza } from "../controllers/pizzaController.js";
import { verifyToken, isAdmin, } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, isAdmin , upload.single("image"),createPizza);

router.get("/", getAllPizza);

router.get("/:id", getSinglePizza);

router.put("/:id", verifyToken,isAdmin, upload.single("image"),updatePizza);

router.delete("/:id", verifyToken, isAdmin ,deletePizza);

export default router;
