import express from "express";
import rateLimit from "express-rate-limit";
import { login, register } from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const router = express.Router();

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message:
        "Too many requests from this IP, please try again after 15 minutes",
});

router.post("/register", apiLimiter, register);
router.post("/login", login);
export default router;
