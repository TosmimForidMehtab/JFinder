import User from "../models/userModel.js";
export const register = async (req, res) => {
    try {
        const { username, email, password, country } = req.body;
        if (!username) {
            res.status(400).json({
                message: "Username is required",
                success: false,
            });
        }

        if (!email) {
            res.status(400).json({
                message: "Email is required",
                success: false,
            });
        }

        if (!password) {
            res.status(400).json({
                message: "Password is required",
                success: false,
            });
        }
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400).json({
                message: "User already exists",
                success: false,
            });
        }
        const user = await User.create({
            username,
            email,
            password,
            country,
        });
        const token = user.createToken();
        res.status(201).json({
            message: "User created successfully",
            success: true,
            token,
            user: {
                username: user.username,
                email: user.email,
                country: user.country,
                _id: user._id,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        });
    } catch (error) {
        console.log(`Error in register controller: ${error}`);
        res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email) {
            res.statusCode = 400;
            next(new Error("Email is required"));
        }
        if (!password) {
            res.statusCode = 400;
            next(new Error("Password cannot be empty"));
        }
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            res.statusCode = 404;
            next(new Error(`Invalid credentials`));
        }
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            res.status(400).json({
                message: "Invalid credentials",
                success: false,
            });
        }
        user.password = undefined;
        res.status(200).json({
            message: "User logged in successfully",
            success: true,
            user,
        });
    } catch (error) {}
};
