import express from "express";
import { login, register } from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", authMiddleware, login);
export default router;
