import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
    deleteUser,
    getAllUsers,
    getUser,
    updateUser,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", authMiddleware, getAllUsers);
router.get("/:id", authMiddleware, getUser);
router.put("/update", authMiddleware, updateUser);
router.delete("/delete", authMiddleware, deleteUser);

export default router;
