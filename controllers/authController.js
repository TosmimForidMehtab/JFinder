import User from "../models/userModel.js";
export const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            res.statusCode = 400;
            next(new Error("All fields are required"));
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            res.statusCode = 400;
            next(new Error("User already exists"));
        }
        const user = await User.create({
            username,
            email,
            password,
        });
        res.status(201).json({
            message: "User created successfully",
            success: true,
            user,
        });
    } catch (error) {
        console.log(`Error in register controller: ${error}`);
        res.statusCode = 500;
        next(error);
    }
};
