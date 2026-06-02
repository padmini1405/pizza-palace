import express from "express";

import {registerUser, getProfile, updateProfile, resetPassword} from "../controllers/authController.js";
import {loginUser} from "../controllers/loginController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
 
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", verifyToken, getProfile);
router.put("/update-profile", verifyToken, updateProfile);
router.put("/reset-password", resetPassword);

export default router;