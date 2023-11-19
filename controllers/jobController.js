import Job from "../models/jobModel.js";
import mongoose from "mongoose";
import moment from "moment";
export const createJob = async (req, res) => {
    const { company, position, workLocation } = req.body;
    if (!company || !position || !workLocation) {
        return res
            .status(400)
            .json({ success: false, message: "All fields are required" });
    }
    req.body.createdBy = req.user._id;
    try {
        const job = await Job.create(req.body);
        res.status(201).json({ success: true, data: job });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: `Error creating job: ${error.message}`,
        });
    }
};

export const getAllJobs = async (req, res) => {
    // Searching and sorting
    const { status, workType, workPlace, search, sort } = req.query;
    const queryObject = {
        createdBy: req.user._id,
    };
    if (status && status !== "all") {
        queryObject.status = status;
    }
    if (workType && workType !== "all") {
        queryObject.workType = workType;
    }
    if (workPlace && workPlace !== "all") {
        queryObject.workPlace = workPlace;
    }
    if (search) {
        queryObject.position = { $regex: search, $options: "i" };
    }
    try {
        // const jobs = await Job.find({ createdBy: req.user._id });
        let result = Job.find(queryObject);

        // Filtering
        if (sort === "latest") {
            result = result.sort({ createdAt: -1 });
        }
        if (sort === "oldest") {
            result = result.sort("createdAt");
        }
        if (sort === "a-z") {
            result = result.sort({ position: 1 });
        }
        if (sort === "z-a") {
            result = result.sort("-position");
        }

        // Pagination
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        result = result.skip(skip).limit(limit);
        const total = await Job.countDocuments(queryObject);
        const pages = Math.ceil(total / limit);

        const jobs = await result;
        res.status(200).json({ success: true, data: jobs, total, pages });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: `Error getting jobs: ${error.message}`,
        });
    }
};

export const updateJob = async (req, res) => {
    const { company, position, workLocation, status, workType, workPlace } =
        req.body;
    if (
        !company &&
        !position &&
        !workLocation &&
        !status &&
        !workType &&
        !workPlace
    ) {
        return res.status(400).json({
            success: false,
            message: "At least one field is required",
        });
    }
    try {
        const job = await Job.findOneAndUpdate(
            { _id: req.params.id, createdBy: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!job) {
            return res.status(404).json({
                success: false,
                message:
                    "Job not found or you don't have permission to update it",
            });
        }
        res.status(200).json({ success: true, data: job });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: `Error updating job: ${error.message}`,
        });
    }
};

export const deleteJob = async (req, res) => {
    if (!req.params.id) {
        return res
            .status(400)
            .json({ success: false, message: "Job ID is required" });
    }
    try {
        const job = await Job.findOneAndDelete({
            _id: req.params.id,
            createdBy: req.user._id,
        });
        if (!job) {
            return res.status(404).json({
                success: false,
                message:
                    "Job not found or you don't have permission to delete it",
            });
        }
        res.status(200).json({
            success: true,
            message: "Job deleted successfully",
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: `Error deleting job: ${error.message}`,
        });
    }
};

export const getJobStats = async (req, res) => {
    try {
        const stats = await Job.aggregate([
            {
                $match: {
                    createdBy: new mongoose.Types.ObjectId(req.user._id),
                },
            },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ]);
        const defaultStats = {
            pending: stats.pending || 0,
            interview: stats.interview || 0,
            declined: stats.declined || 0,
        };

        let monthlyApplications = await Job.aggregate([
            {
                $match: {
                    createdBy: new mongoose.Types.ObjectId(req.user._id),
                },
            },
            {
                $group: {
                    _id: {
                        year: {
                            $year: "$createdAt",
                        },
                        month: {
                            $month: "$createdAt",
                        },
                    },
                    count: { $sum: 1 },
                },
            },
        ]);
        // Refactoring monthlyApplications
        monthlyApplications = monthlyApplications
            .map((item) => {
                const {
                    _id: { year, month },
                    count,
                } = item;
                const date = moment()
                    .month(month - 1)
                    .year(year)
                    .format("MMM Y");
                return { date, count };
            })
            .reverse();
        res.status(200).json({
            success: true,
            data: defaultStats,
            monthlyApplications,
            total: stats.length,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: `Error getting job stats: ${error.message}`,
        });
    }
};
