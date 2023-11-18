import User from "../models/userModel.js";
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "All fields are required",
                success: false,
            });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                message: "User already exists",
                success: false,
            });
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
        res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error,
        });
    }
};
