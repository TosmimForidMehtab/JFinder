import User from "../models/userModel.js";
export const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        if (!username) {
            res.statusCode = 400;
            next(new Error("Username is required"));
        }

        if (!email) {
            res.statusCode = 400;
            next(new Error("Email is required"));
        }

        if (!password) {
            res.statusCode = 400;
            next(new Error("Password cannot be empty"));
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            res.statusCode = 400;
            next(new Error(`User with email ${email} already exists`));
        }
        const user = await User.create({
            username,
            email,
            password,
        });
        const token = user.createToken();
        res.status(201).json({
            message: "User created successfully",
            success: true,
            token,
        });
    } catch (error) {
        console.log(`Error in register controller: ${error}`);
        res.statusCode = 500;
        next(error);
    }
};
