import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
    createJob,
    deleteJob,
    getAllJobs,
    getJobStats,
    updateJob,
} from "../controllers/jobController.js";
const router = express.Router();

router.post("/create", authMiddleware, createJob);
router.get("/", authMiddleware, getAllJobs);
router.patch("/update/:id", authMiddleware, updateJob);
router.delete("/delete/:id", authMiddleware, deleteJob);
router.get("/stats", authMiddleware, getJobStats);

export default router;
