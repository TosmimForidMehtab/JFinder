import Job from "../models/jobModel.js";
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
    try {
        const jobs = await Job.find({ createdBy: req.user._id });
        res.status(200).json({ success: true, data: jobs, total: jobs.length });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: `Error getting jobs: ${error.message}`,
        });
    }
};
