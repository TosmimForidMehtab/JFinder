import mongoose, { Schema } from "mongoose";
import validator from "validator";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: [true, "Firstname cannot be empty"],
            minLength: [3, "Username must be at least 3 characters"],
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
                message: "Password is not strong enough",
            },
        },
        country: {
            type: String,
            default: "India",
        },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
