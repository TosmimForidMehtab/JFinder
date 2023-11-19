import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import userRoutes from "./routes/userRoute.js";
import jobRoutes from "./routes/jobRoutes.js";
dotenv.config();

connectDB();

const app = express();

app.use(helmet()); // Set security for HTTP headers
app.use(xss()); // Sanitize user input and prevent XSS attacks
app.use(mongoSanitize()); // Sanitize user input and prevent MongoDB query injection
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/job", jobRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
