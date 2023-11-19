import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
    {
        company: {
            type: String,
            required: [true, "Please provide company name"],
            maxlength: 50,
        },
        position: {
            type: String,
            required: [true, "Please provide position"],
            maxlength: 100,
        },
        status: {
            type: String,
            enum: {
                values: ["interview", "declined", "pending"],
                message: `{VALUE} is not supported`,
            },
            default: "pending",
        },
        workType: {
            type: String,
            enum: {
                values: ["full-time", "part-time", "contract", "internship"],
                message: `{VALUE} is not supported`,
            },
            default: "full-time",
        },
        workPlace: {
            type: String,
            enum: {
                values: ["on-site", "remote", "hybrid"],
                message: `{VALUE} is not supported`,
            },
            default: "on-site",
        },
        workLocation: {
            type: String,
            required: [true, "Please provide work location"],
            maxlength: 100,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;
