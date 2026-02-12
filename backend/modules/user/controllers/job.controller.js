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

export const applyToJob = async (req, res, next) => {
    try {
        console.log('\n🟢 ===== APPLY TO JOB =====');
        console.log('Job ID:', req.params.id);
        console.log('Applicant ID:', req.user._id);
        console.log('Application Data:', req.body);

        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        if (job.status !== 'Open') {
            return res.status(400).json({
                success: false,
                message: 'This job is no longer accepting applications'
            });
        }

        // Check if already applied
        const alreadyApplied = job.applications.some(
            app => app.applicant.toString() === req.user._id.toString()
        );

        if (alreadyApplied) {
            return res.status(400).json({
                success: false,
                message: 'You have already applied to this job'
            });
        }

        // Add application
        job.applications.push({
            applicant: req.user._id,
            applicantType: req.body.applicantType || req.user.userType, // 'Labour' or 'Contractor'
            applicantName: req.body.applicantName,
            phoneNumber: req.body.phoneNumber,
            location: req.body.location,
            message: req.body.message,
            status: 'Pending'
        });

        await job.save();

        console.log('✅ Application submitted successfully');
        console.log('===========================\n');

        res.status(200).json({
            success: true,
            message: 'Application submitted successfully',
            data: { job }
        });
    } catch (error) {
        console.error('❌ APPLY TO JOB ERROR:', error.message);
        console.log('===========================\n');
        next(error);
    }
};

export const getJobApplications = async (req, res, next) => {
    try {
        console.log('\n🔵 ===== GET JOB APPLICATIONS =====');
        console.log('Job ID:', req.params.id);
        console.log('User ID:', req.user._id);

        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        // Check if user owns this job
        if (job.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view applications for this job'
            });
        }

        console.log('✅ Found', job.applications.length, 'applications');
        console.log('===========================\n');

        res.status(200).json({
            success: true,
            data: {
                applications: job.applications,
                jobTitle: job.jobTitle,
                jobStatus: job.status
            }
        });
    } catch (error) {
        console.error('❌ GET JOB APPLICATIONS ERROR:', error.message);
        console.log('===========================\n');
        next(error);
    }
};

export const getContractorApplications = async (req, res, next) => {
    try {
        console.log('\n🔵 ===== GET CONTRACTOR APPLICATIONS =====');
        console.log('User ID:', req.user._id);

        // Find all jobs posted by this user
        const jobs = await Job.find({ user: req.user._id, isActive: true });

        console.log('✅ Found', jobs.length, 'jobs');

        // Extract all contractor applications from all jobs
        const contractorApplications = [];
        
        jobs.forEach(job => {
            job.applications.forEach(app => {
                if (app.applicantType === 'Contractor' && app.status === 'Pending') {
                    contractorApplications.push({
                        _id: app._id,
                        jobId: job._id,
                        jobTitle: job.jobTitle,
                        jobCategory: job.category,
                        applicantName: app.applicantName,
                        phoneNumber: app.phoneNumber,
                        location: app.location,
                        message: app.message,
                        appliedAt: app.appliedAt,
                        status: app.status
                    });
                }
            });
        });

        console.log('✅ Found', contractorApplications.length, 'contractor applications');
        console.log('===========================\n');

        res.status(200).json({
            success: true,
            data: {
                applications: contractorApplications,
                count: contractorApplications.length
            }
        });
    } catch (error) {
        console.error('❌ GET CONTRACTOR APPLICATIONS ERROR:', error.message);
        console.log('===========================\n');
        next(error);
    }
};

export const getMyApplications = async (req, res, next) => {
    try {
        console.log('\n🔵 ===== GET MY APPLICATIONS =====');
        console.log('User ID:', req.user._id);

        // Find all jobs and filter applications by this user
        const jobs = await Job.find({ isActive: true });

        console.log('✅ Searching through', jobs.length, 'jobs');

        // Extract applications made by this contractor
        const myApplications = {};
        
        jobs.forEach(job => {
            job.applications.forEach(app => {
                // Check if this application is from the current user (contractor)
                if (app.applicant && app.applicant.toString() === req.user._id.toString()) {
                    myApplications[job._id.toString()] = {
                        jobId: job._id.toString(),
                        applicationId: app._id.toString(),
                        status: app.status,
                        appliedAt: app.appliedAt
                    };
                }
            });
        });

        console.log('✅ Found', Object.keys(myApplications).length, 'applications by this contractor');
        console.log('===========================\n');

        res.status(200).json({
            success: true,
            data: {
                applications: myApplications,
                count: Object.keys(myApplications).length
            }
        });
    } catch (error) {
        console.error('❌ GET MY APPLICATIONS ERROR:', error.message);
        console.log('===========================\n');
        next(error);
    }
};

export const getApplicationHistory = async (req, res, next) => {
    try {
        console.log('\n🔵 ===== GET APPLICATION HISTORY =====');
        console.log('User ID:', req.user._id);

        // Find all jobs posted by this user
        const jobs = await Job.find({ user: req.user._id, isActive: true });

        console.log('✅ Found', jobs.length, 'jobs');

        // Extract all accepted/rejected applications
        const history = [];
        
        jobs.forEach(job => {
            job.applications.forEach(app => {
                if (app.status === 'Accepted' || app.status === 'Rejected') {
                    // Format date and time
                    const appliedDate = new Date(app.appliedAt);
                    const formattedDate = appliedDate.toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                    });
                    const formattedTime = appliedDate.toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                    });

                    const historyItem = {
                        id: app._id.toString(),
                        _id: app._id,
                        jobId: job._id,
                        jobTitle: job.jobTitle,
                        jobCategory: job.category,
                        applicantType: app.applicantType,
                        applicantName: app.applicantName,
                        phoneNumber: app.phoneNumber,
                        location: app.location || 'Not specified',
                        message: app.message,
                        appliedAt: app.appliedAt,
                        date: formattedDate,
                        time: formattedTime,
                        status: app.status.toLowerCase(),
                        type: app.applicantType === 'Contractor' ? 'contractor' : 'worker'
                    };

                    // Add type-specific fields for compatibility with card components
                    if (app.applicantType === 'Contractor') {
                        historyItem.contractorName = app.applicantName;
                    } else {
                        historyItem.workerName = app.applicantName;
                        historyItem.category = job.category;
                    }

                    history.push(historyItem);
                }
            });
        });

        // Sort by most recent first
        history.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));

        console.log('✅ Found', history.length, 'history items');
        console.log('===========================\n');

        res.status(200).json({
            success: true,
            data: {
                history,
                count: history.length
            }
        });
    } catch (error) {
        console.error('❌ GET APPLICATION HISTORY ERROR:', error.message);
        console.log('===========================\n');
        next(error);
    }
};

export const updateApplicationStatus = async (req, res, next) => {
    try {
        console.log('\n🟡 ===== UPDATE APPLICATION STATUS =====');
        console.log('Job ID:', req.params.id);
        console.log('Application ID:', req.params.applicationId);
        console.log('New Status:', req.body.status);

        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        // Check if user owns this job
        if (job.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update applications for this job'
            });
        }

        // Find and update application
        const application = job.applications.id(req.params.applicationId);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        application.status = req.body.status;
        await job.save();

        console.log('✅ Application status updated');
        console.log('===========================\n');

        res.status(200).json({
            success: true,
            message: 'Application status updated successfully',
            data: { application }
        });
    } catch (error) {
        console.error('❌ UPDATE APPLICATION STATUS ERROR:', error.message);
        console.log('===========================\n');
        next(error);
    }
};
