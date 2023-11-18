import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import authRoutes from "./routes/authRoute.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/auth", authRoutes);
app.use(errorMiddleware);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
