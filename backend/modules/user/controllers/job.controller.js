import Job from '../models/Job.model.js';

export const createJob = async (req, res, next) => {
    try {
        console.log('\n🟢 ===== CREATE JOB =====');
        console.log('📦 Request Body:', JSON.stringify(req.body, null, 2));
        console.log('👤 User ID:', req.user._id);

        const job = await Job.create({
            user: req.user._id,
            ...req.body
        });

        console.log('✅ Job created:', job._id);
        console.log('===========================\n');

        res.status(201).json({
            success: true,
            message: 'Job created successfully',
            data: { job }
        });
    } catch (error) {
        console.error('❌ CREATE JOB ERROR:', error.message);
        console.log('===========================\n');
        next(error);
    }
};

export const getUserJobs = async (req, res, next) => {
    try {
        console.log('\n🔵 ===== GET USER JOBS =====');
        console.log('👤 User ID:', req.user._id);

        const { page = 1, limit = 20 } = req.query;

        const jobs = await Job.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Job.countDocuments({ user: req.user._id });

        console.log('✅ Found', jobs.length, 'jobs');
        console.log('===========================\n');

        res.status(200).json({
            success: true,
            data: {
                jobs,
                total,
                page: parseInt(page),
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('❌ GET USER JOBS ERROR:', error.message);
        console.log('===========================\n');
        next(error);
    }
};

export const getJobById = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        if (job.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this job'
            });
        }

        res.status(200).json({
            success: true,
            data: { job }
        });
    } catch (error) {
        next(error);
    }
};

export const updateJob = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        if (job.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this job'
            });
        }

        const updatedJob = await Job.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Job updated successfully',
            data: { job: updatedJob }
        });
    } catch (error) {
        next(error);
    }
};

export const deleteJob = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        if (job.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this job'
            });
        }

        await job.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Job deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

export const browseJobs = async (req, res, next) => {
    try {
        console.log('\n🔵 ===== BROWSE JOBS =====');

        const { city, category, status = 'Open', page = 1, limit = 100 } = req.query;

        const query = { isActive: true };

        if (city) {
            query.city = new RegExp(city, 'i');
        }
        if (category) {
            query.category = category;
        }
        if (status) {
            query.status = status;
        }

        const jobs = await Job.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Job.countDocuments(query);

        console.log('✅ Found', jobs.length, 'jobs');
        console.log('===========================\n');

        res.status(200).json({
            success: true,
            data: {
                jobs,
                total,
                page: parseInt(page),
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('❌ BROWSE JOBS ERROR:', error.message);
        console.log('===========================\n');
        next(error);
    }
};
