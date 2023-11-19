import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { createJob, getAllJobs } from "../controllers/jobController.js";
const router = express.Router();

router.post("/create", authMiddleware, createJob);
router.get("/", authMiddleware, getAllJobs);

export default router;
