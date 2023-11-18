import mongoose, { Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: [true, "Firstname cannot be empty"],
            minLength: [
                3,
                "Username must be at least 3 characters got {VALUE}",
            ],
        },
        lastname: {
            type: String,
        },
        email: {
            type: String,
            required: [true, "Email cannot be empty"],
            unique: [true, "Email already exists"],
            validate: {
                validator: validator.isEmail,
                message: "Please provide a valid email",
            },
        },
        password: {
            type: String,
            required: [true, "Password cannot be empty"],
            validate: {
                validator: (value) => {
                    return validator.isStrongPassword(value, {
                        minLength: 6,
                        minLowercase: 1,
                        minUppercase: 1,
                        minNumbers: 1,
                        minSymbols: 1,
                    });
                },
                message:
                    "Password must contain at least 6 characters, 1 uppercase, 1 lowercase, 1 number and 1 symbol",
            },
        },
        country: {
            type: String,
            default: "India",
        },
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.createToken = function () {
    return jwt.sign({ userId: this._id }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: process.env.JWT_ACCESS_EXPIRESIN,
    });
};

const User = mongoose.model("User", userSchema);
export default User;
