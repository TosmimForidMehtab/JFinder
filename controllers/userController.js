import User from "../models/userModel.js";

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};

export const getUser = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(404).json({ success: false, message: "Invalid ID" });
    }
    try {
        const user = await User.findById(id).select("-password");
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};

export const updateUser = async (req, res) => {
    const { username, email, password, country } = req.body;
    if (!username && !email && !password && !country) {
        return res
            .status(400)
            .json({ success: false, message: "Atleast one field is required" });
    }
    try {
        const user = await User.findOne({ _id: req.user._id }).select(
            "-password"
        );
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }
        if (username) user.username = username;
        if (email) user.email = email;
        if (password) user.password = password;
        if (country) user.country = country;
        await user.save();
        const token = user.createToken();
        res.status(200).json({ success: true, data: user, token });
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete({ _id: req.user._id });
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, message: "User deleted" });
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};
