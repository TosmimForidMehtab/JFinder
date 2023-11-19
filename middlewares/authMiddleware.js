import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        req.user = {
            _id: decoded._id,
        };
        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }
};

export default authMiddleware;
