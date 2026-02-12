import Contractor from '../models/Contractor.model.js';
import ContractorJob from '../models/ContractorJob.model.js';
import User from '../../user/models/User.model.js';

// @desc    Create contractor profile (during registration)
// @route   POST /api/contractor/profile
// @access  Private
export const createContractorProfile = async (req, res, next) => {
    try {
        console.log('\n🟢 ===== CREATE CONTRACTOR PROFILE =====');
        console.log('📦 Request Body:', JSON.stringify(req.body, null, 2));
        console.log('👤 User ID:', req.user._id);

        const {
            firstName,
            middleName,
            lastName,
            gender,
            dob,
            city,
            state,
            address,
            mobileNumber
        } = req.body;

        // Update user details
        const user = await User.findById(req.user._id);
        if (user) {
            if (firstName) user.firstName = firstName;
            if (middleName) user.middleName = middleName;
            if (lastName) user.lastName = lastName;
            if (gender) user.gender = gender;
            if (city) user.city = city;
            if (state) user.state = state;
            if (!user.userType) user.userType = 'Contractor';
            await user.save();
            console.log('✅ User details updated');
        }

        // Check if contractor profile already exists
        let contractor = await Contractor.findOne({ user: req.user._id });

        if (!contractor) {
            console.log('✨ Creating new contractor profile...');
            contractor = await Contractor.create({
                user: req.user._id,
                city: city || '',
                state: state || '',
                isActive: true,
                profileCompletionStatus: 'basic'
            });
            console.log('✅ Contractor profile created:', contractor._id);
        } else {
            console.log('🔄 Contractor profile already exists:', contractor._id);
            // Update basic info if provided
            if (city) contractor.city = city;
            if (state) contractor.state = state;
            if (contractor.profileCompletionStatus === 'incomplete') {
                contractor.profileCompletionStatus = 'basic';
            }
            await contractor.save();
        }

        // Populate user data
        await contractor.populate('user', 'firstName lastName mobileNumber city state gender');

        console.log('===========================\n');

        res.status(201).json({
            success: true,
            message: 'Contractor profile created successfully',
            data: { contractor, user }
        });
    } catch (error) {
        console.error('❌ CREATE CONTRACTOR PROFILE ERROR:', error.message);
        console.log('===========================\n');
        next(error);
    }
};

export const updateBusinessDetails = async (req, res, next) => {
    try {
        console.log('\n🟡 ===== UPDATE CONTRACTOR BUSINESS DETAILS =====');
        console.log('📦 Request Body:', JSON.stringify(req.body, null, 2));
        console.log('👤 User ID:', req.user._id);
        
        const {
            businessType,
            businessName,
            city,
            state,
            addressLine1,
            landmark
        } = req.body;

        let contractor = await Contractor.findOne({ user: req.user._id });

        if (!contractor) {
            console.log('✨ Creating new contractor profile...');
            contractor = await Contractor.create({
                user: req.user._id,
                businessType,
                businessName,
                city,
                state,
                addressLine1,
                landmark,
                profileCompletionStatus: 'complete'
            });
            console.log('✅ Contractor profile created:', contractor._id);
        } else {
            console.log('🔄 Updating existing contractor profile:', contractor._id);
            if (businessType) contractor.businessType = businessType;
            if (businessName) contractor.businessName = businessName;
            if (city) contractor.city = city;
            if (state) contractor.state = state;
            if (addressLine1) contractor.addressLine1 = addressLine1;
            if (landmark) contractor.landmark = landmark;
            
            // Update profile completion status
            if (businessName && addressLine1) {
                contractor.profileCompletionStatus = 'complete';
            } else if (businessName || addressLine1) {
                contractor.profileCompletionStatus = 'basic';
            }

            await contractor.save();
            console.log('✅ Contractor profile updated');
        }

        // Populate user data
        await contractor.populate('user', 'firstName lastName mobileNumber');

        console.log('===========================\n');

        res.status(200).json({
            success: true,
            message: 'Business details updated successfully',
            data: { contractor }
        });
    } catch (error) {
        console.error('❌ UPDATE BUSINESS DETAILS ERROR:', error.message);
        console.log('===========================\n');
        next(error);
    }
};

export const getContractorProfile = async (req, res, next) => {
    try {
        console.log('\n🔵 ===== GET CONTRACTOR PROFILE =====');
        console.log('👤 User ID:', req.user._id);
        
        const contractor = await Contractor.findOne({ user: req.user._id })
            .populate('user', 'firstName lastName mobileNumber profileImage');

        if (!contractor) {
            console.log('❌ Contractor profile not found');
            console.log('===========================\n');
            return res.status(404).json({
                success: false,
                message: 'Contractor profile not found'
            });
        }

        console.log('✅ Contractor profile found:', contractor._id);
        console.log('===========================\n');

        res.status(200).json({
            success: true,
            data: { contractor }
        });
    } catch (error) {
        console.error('❌ GET CONTRACTOR PROFILE ERROR:', error.message);
        console.log('===========================\n');
        next(error);
    }
};

export const browseContractors = async (req, res, next) => {
    try {
        console.log('\n🔵 ===== BROWSE CONTRACTORS =====');
        
        const { city, businessType, page = 1, limit = 20 } = req.query;

        const query = { isActive: true };
        
        if (city) {
            query.city = new RegExp(city, 'i');
        }
        if (businessType) {
            query.businessType = businessType;
        }

        const contractors = await Contractor.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('user', 'firstName lastName mobileNumber profileImage');

        const total = await Contractor.countDocuments(query);

        console.log('✅ Found', contractors.length, 'contractors');
        console.log('===========================\n');

        res.status(200).json({
            success: true,
            data: {
                contractors: contractors.map(c => ({
                    contractor: c,
                    user: c.user
                })),
                pagination: {
                    total,
                    page: parseInt(page),
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('❌ BROWSE CONTRACTORS ERROR:', error.message);
        console.log('===========================\n');
        next(error);
    }
};

export const createContractorJob = async (req, res, next) => {
    try {
        console.log('\n🟢 ===== CREATE CONTRACTOR JOB =====');
        console.log('📦 Request Body:', JSON.stringify(req.body, null, 2));
        console.log('👤 User ID:', req.user._id);
        
        const {
            contractorName,
            phoneNumber,
            city,
            address,
            businessType,
            businessName,
            labourSkill,
            experience,
            workDuration,
            budgetType,
            budgetAmount,
            profileStatus,
            rating,
            targetAudience
        } = req.body;

        console.log('🎯 Target Audience from request:', targetAudience);

        let contractor = await Contractor.findOne({ user: req.user._id });
        
        if (!contractor) {
            console.log('✨ Creating contractor profile automatically...');
            // Create a basic contractor profile with default businessType
            contractor = await Contractor.create({
                user: req.user._id,
                businessType: 'Proprietorship', // Use valid enum value from Contractor model
                businessName: businessName || contractorName,
                city: city,
                isActive: true
            });
            console.log('✅ Contractor profile created:', contractor._id);
        }

        const contractorJob = await ContractorJob.create({
            contractor: contractor._id,
            user: req.user._id,
            contractorName,
            phoneNumber,
            city,
            address,
            businessType,
            businessName,
            labourSkill,
            experience,
            workDuration,
            budgetType,
            budgetAmount: budgetType === 'Fixed Amount' ? budgetAmount : 0,
            profileStatus: profileStatus || 'Active',
            rating: rating || 0,
            targetAudience: targetAudience || 'Both'
        });

        console.log('✅ Contractor job created:', contractorJob._id);
        console.log('🎯 Saved with Target Audience:', contractorJob.targetAudience);
        console.log('===========================\n');

        res.status(201).json({
            success: true,
            message: 'Contractor job created successfully',
            data: { contractorJob }
        });
    } catch (error) {
        console.error('❌ CREATE CONTRACTOR JOB ERROR:', error.message);
        console.log('===========================\n');
        next(error);
    }
};

export const getContractorJobs = async (req, res, next) => {
    try {
        console.log('\n🔵 ===== GET CONTRACTOR JOBS =====');
        console.log('👤 User ID:', req.user._id);
        
        const { page = 1, limit = 20 } = req.query;

        const jobs = await ContractorJob.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await ContractorJob.countDocuments({ user: req.user._id });

        console.log('✅ Found', jobs.length, 'contractor jobs');
        console.log('===========================\n');

        res.status(200).json({
            success: true,
            data: {
                jobs,
                pagination: {
                    total,
                    page: parseInt(page),
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('❌ GET CONTRACTOR JOBS ERROR:', error.message);
        console.log('===========================\n');
        next(error);
    }
};

export const browseContractorJobs = async (req, res, next) => {
    try {
        console.log('\n🔵 ===== BROWSE CONTRACTOR JOBS =====');
        
        const { city, labourSkill, profileStatus = 'Active', page = 1, limit = 100, audience = 'Labour' } = req.query;

        const query = { isActive: true };
        
        if (city) {
            query.city = new RegExp(city, 'i');
        }
        if (labourSkill) {
            query.labourSkill = labourSkill;
        }
        if (profileStatus) {
            query.profileStatus = profileStatus;
        }
        
        // Filter by targetAudience based on who is browsing
        if (audience === 'User') {
            // User should see 'User' or 'Both' cards
            query.$or = [
                { targetAudience: 'User' },
                { targetAudience: 'Both' },
                { targetAudience: { $exists: false } } // For old data
            ];
        } else {
            // Labour should see 'Labour' or 'Both' cards (default)
            query.$or = [
                { targetAudience: 'Labour' },
                { targetAudience: 'Both' },
                { targetAudience: { $exists: false } } // For old data
            ];
        }

        const jobs = await ContractorJob.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('user', 'firstName lastName mobileNumber')
            .populate('contractor', 'businessName businessType');

        const total = await ContractorJob.countDocuments(query);

        console.log('✅ Found', jobs.length, 'contractor jobs');
        console.log('===========================\n');

        res.status(200).json({
            success: true,
            data: {
                jobs,
                pagination: {
                    total,
                    page: parseInt(page),
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('❌ BROWSE CONTRACTOR JOBS ERROR:', error.message);
        console.log('===========================\n');
        next(error);
    }
};

export const updateContractorJob = async (req, res, next) => {
    try {
        console.log('\n🟡 ===== UPDATE CONTRACTOR JOB =====');
        console.log('Job ID:', req.params.id);
        console.log('👤 User ID:', req.user._id);
        
        const job = await ContractorJob.findById(req.params.id);

        if (!job) {
            console.log('❌ Contractor job not found');
            console.log('===========================\n');
            return res.status(404).json({
                success: false,
                message: 'Contractor job not found'
            });
        }

        if (job.user.toString() !== req.user._id.toString()) {
            console.log('❌ Not authorized to update this job');
            console.log('===========================\n');
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this job'
            });
        }

        const updatedJob = await ContractorJob.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        console.log('✅ Contractor job updated');
        console.log('===========================\n');

        res.status(200).json({
            success: true,
            message: 'Contractor job updated successfully',
            data: { job: updatedJob }
        });
    } catch (error) {
        console.error('❌ UPDATE CONTRACTOR JOB ERROR:', error.message);
        console.log('===========================\n');
        next(error);
    }
};

export const deleteContractorJob = async (req, res, next) => {
    try {
        console.log('\n🔴 ===== DELETE CONTRACTOR JOB =====');
        console.log('Job ID:', req.params.id);
        console.log('👤 User ID:', req.user._id);
        
        const job = await ContractorJob.findById(req.params.id);

        if (!job) {
            console.log('❌ Contractor job not found');
            console.log('===========================\n');
            return res.status(404).json({
                success: false,
                message: 'Contractor job not found'
            });
        }

        if (job.user.toString() !== req.user._id.toString()) {
            console.log('❌ Not authorized to delete this job');
            console.log('===========================\n');
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this job'
            });
        }

        await job.deleteOne();

        console.log('✅ Contractor job deleted');
        console.log('===========================\n');

        res.status(200).json({
            success: true,
            message: 'Contractor job deleted successfully'
        });
    } catch (error) {
        console.error('❌ DELETE CONTRACTOR JOB ERROR:', error.message);
        console.log('===========================\n');
        next(error);
    }
};

export const getContractorVerificationStatus = async (req, res, next) => {
    try {
        const contractor = await Contractor.findOne({ user: req.user._id });
        
        if (!contractor) {
            return res.status(404).json({
                success: false,
                message: 'Contractor profile not found'
            });
        }

        const VerificationRequest = (await import('../../admin/models/VerificationRequest.model.js')).default;
        
        const verificationRequest = await VerificationRequest.findOne({
            entityId: contractor._id,
            entityType: 'contractor'
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: {
                isVerified: contractor.isVerified || false,
                verificationRequest: verificationRequest || null
            }
        });
    } catch (error) {
        next(error);
    }
};


// ==================== CONTRACTOR HIRE REQUEST FUNCTIONS ====================

import ContractorHireRequest from '../models/ContractorHireRequest.model.js';

// @desc    Create contractor hire request (User hires Contractor)
// @route   POST /api/contractor/hire-request
// @access  Private
export const createContractorHireRequest = async (req, res) => {
    try {
        const { contractorId } = req.body;
        const userId = req.user._id;

        console.log('\n🟢 ===== CREATE CONTRACTOR HIRE REQUEST =====');
        console.log('📦 contractorId received:', contractorId);
        console.log('👤 userId:', userId);

        // First, try to find as ContractorJob ID
        let contractor = null;
        let contractorJob = await ContractorJob.findById(contractorId).populate('contractor');
        
        if (contractorJob) {
            console.log('✅ Found ContractorJob, getting contractor from it');
            contractor = contractorJob.contractor;
        } else {
            // Fallback: try as Contractor ID directly
            console.log('⚠️ Not a ContractorJob ID, trying as Contractor ID');
            contractor = await Contractor.findById(contractorId);
        }

        if (!contractor) {
            console.log('❌ Contractor not found');
            return res.status(404).json({
                success: false,
                message: 'Contractor not found'
            });
        }

        // Populate contractor user details if not already populated
        if (!contractor.user || !contractor.user.firstName) {
            contractor = await Contractor.findById(contractor._id).populate('user');
        }

        console.log('✅ Contractor found:', contractor._id);

        // Get requester (user) details
        const requester = await User.findById(userId);
        if (!requester) {
            console.log('❌ User not found');
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        console.log('✅ Requester found:', requester._id);

        // Check if request already exists (use contractor._id for checking)
        const existingRequest = await ContractorHireRequest.findOne({
            contractorId: contractor._id,
            requesterId: userId,
            status: 'pending'
        });

        if (existingRequest) {
            console.log('⚠️ Request already exists');
            return res.status(400).json({
                success: false,
                message: 'Hire request already exists'
            });
        }

        // Create hire request (use contractor._id)
        const hireRequest = await ContractorHireRequest.create({
            contractorId: contractor._id,
            contractorName: `${contractor.user.firstName} ${contractor.user.lastName}`,
            contractorPhone: contractor.user.mobileNumber,
            contractorBusiness: contractor.businessName || 'N/A',
            contractorCity: contractor.user.city || 'N/A',
            requesterId: userId,
            requesterName: `${requester.firstName} ${requester.lastName}`,
            requesterPhone: requester.mobileNumber,
            requesterLocation: requester.city || 'N/A'
        });

        console.log('✅ Hire request created:', hireRequest._id);
        console.log('===========================\n');

        res.status(201).json({
            success: true,
            message: 'Contractor hire request created successfully',
            data: { hireRequest }
        });
    } catch (error) {
        console.error('❌ Create contractor hire request error:', error);
        console.log('===========================\n');
        res.status(500).json({
            success: false,
            message: 'Failed to create contractor hire request',
            error: error.message
        });
    }
};

// @desc    Get contractor hire requests (received by contractor)
// @route   GET /api/contractor/hire-requests
// @access  Private
export const getContractorHireRequests = async (req, res) => {
    try {
        const userId = req.user._id;
        const { status } = req.query;

        // Find contractor profile
        const contractor = await Contractor.findOne({ user: userId });
        if (!contractor) {
            return res.status(404).json({
                success: false,
                message: 'Contractor profile not found'
            });
        }

        // Build query
        const query = { contractorId: contractor._id };
        if (status) query.status = status;

        const hireRequests = await ContractorHireRequest.find(query).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: {
                hireRequests,
                count: hireRequests.length
            }
        });
    } catch (error) {
        console.error('Get contractor hire requests error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get contractor hire requests',
            error: error.message
        });
    }
};

// @desc    Get sent contractor hire requests (sent by user)
// @route   GET /api/contractor/hire-requests/sent
// @access  Private
export const getSentContractorHireRequests = async (req, res) => {
    try {
        const userId = req.user._id;

        console.log('\n🔵 ===== GET SENT CONTRACTOR HIRE REQUESTS =====');
        console.log('👤 userId:', userId);

        const hireRequests = await ContractorHireRequest.find({ requesterId: userId })
            .select('contractorId status createdAt updatedAt')
            .sort({ createdAt: -1 });

        console.log('📊 Found', hireRequests.length, 'hire requests');

        // For each hire request, find the ContractorJob that belongs to that contractor
        const formattedRequests = await Promise.all(hireRequests.map(async (req) => {
            // Find the ContractorJob for this contractor
            const contractorJob = await ContractorJob.findOne({ 
                contractor: req.contractorId,
                isActive: true 
            }).sort({ createdAt: -1 });

            // If we found a job, use its ID; otherwise use the contractor ID as fallback
            const idToReturn = contractorJob ? contractorJob._id.toString() : req.contractorId.toString();

            console.log(`Mapping: Contractor ${req.contractorId} → ContractorJob ${idToReturn}`);

            return {
                _id: req._id,
                contractorId: idToReturn, // Return ContractorJob ID for frontend matching
                status: req.status,
                createdAt: req.createdAt,
                updatedAt: req.updatedAt
            };
        }));

        console.log('✅ Formatted requests:', formattedRequests.length);
        console.log('===========================\n');

        res.status(200).json({
            success: true,
            data: {
                hireRequests: formattedRequests,
                count: formattedRequests.length
            }
        });
    } catch (error) {
        console.error('❌ Get sent contractor hire requests error:', error);
        console.log('===========================\n');
        res.status(500).json({
            success: false,
            message: 'Failed to get sent contractor hire requests',
            error: error.message
        });
    }
};

// @desc    Update contractor hire request status (accept/decline)
// @route   PATCH /api/contractor/hire-request/:id
// @access  Private
export const updateContractorHireRequestStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const userId = req.user._id;

        // Validate status
        if (!['accepted', 'declined'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        // Find hire request
        const hireRequest = await ContractorHireRequest.findById(id);
        if (!hireRequest) {
            return res.status(404).json({
                success: false,
                message: 'Hire request not found'
            });
        }

        // Verify contractor owns this request
        const contractor = await Contractor.findOne({ user: userId });
        if (!contractor || contractor._id.toString() !== hireRequest.contractorId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this request'
            });
        }

        // Update status
        hireRequest.status = status;
        hireRequest.respondedAt = new Date();
        await hireRequest.save();

        res.status(200).json({
            success: true,
            message: `Contractor hire request ${status} successfully`,
            data: { hireRequest }
        });
    } catch (error) {
        console.error('Update contractor hire request status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update contractor hire request status',
            error: error.message
        });
    }
};

// @desc    Delete contractor hire request
// @route   DELETE /api/contractor/hire-request/:id
// @access  Private
export const deleteContractorHireRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const hireRequest = await ContractorHireRequest.findById(id);
        if (!hireRequest) {
            return res.status(404).json({
                success: false,
                message: 'Hire request not found'
            });
        }

        // Verify user owns this request
        if (hireRequest.requesterId.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this request'
            });
        }

        await hireRequest.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Contractor hire request deleted successfully'
        });
    } catch (error) {
        console.error('Delete contractor hire request error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete contractor hire request',
            error: error.message
        });
    }
};

// ==================== CONTRACTOR JOB APPLICATION FUNCTIONS ====================

import Labour from '../../labour/models/Labour.model.js';

// @desc    Apply to contractor job (Labour applies to contractor's job)
// @route   POST /api/contractor/jobs/:id/apply
// @access  Private
export const applyToContractorJob = async (req, res, next) => {
    try {
        console.log('\n🟢 ===== APPLY TO CONTRACTOR JOB =====');
        console.log('Job ID:', req.params.id);
        console.log('Labour ID:', req.user._id);

        const job = await ContractorJob.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Contractor job not found'
            });
        }

        if (job.profileStatus !== 'Active') {
            return res.status(400).json({
                success: false,
                message: 'This job is no longer accepting applications'
            });
        }

        // Find labour profile
        const labour = await Labour.findOne({ user: req.user._id }).populate('user');
        if (!labour) {
            return res.status(404).json({
                success: false,
                message: 'Labour profile not found'
            });
        }

        // Check if already applied
        const alreadyApplied = job.applications.some(
            app => app.labour && app.labour.toString() === labour._id.toString()
        );

        if (alreadyApplied) {
            return res.status(400).json({
                success: false,
                message: 'You have already applied to this job'
            });
        }

        // Add application
        job.applications.push({
            labour: labour._id,
            status: 'Pending',
            message: req.body.message || ''
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
        console.error('❌ APPLY TO CONTRACTOR JOB ERROR:', error.message);
        console.log('===========================\n');
        next(error);
    }
};

// @desc    Get labour applications for contractor's jobs
// @route   GET /api/contractor/job-applications
// @access  Private
export const getContractorJobApplications = async (req, res, next) => {
    try {
        console.log('\n🔵 ===== GET CONTRACTOR JOB APPLICATIONS =====');
        console.log('User ID:', req.user._id);

        // Find all jobs posted by this contractor
        const jobs = await ContractorJob.find({ user: req.user._id, isActive: true })
            .populate({
                path: 'applications.labour',
                populate: { path: 'user', select: 'firstName lastName mobileNumber city' }
            });

        console.log('✅ Found', jobs.length, 'jobs');

        // Extract all pending applications
        const applications = [];
        
        jobs.forEach(job => {
            job.applications.forEach(app => {
                if (app.status === 'Pending' && app.labour) {
                    applications.push({
                        _id: app._id,
                        jobId: job._id,
                        jobTitle: `${job.labourSkill} - ${job.city}`,
                        labourId: app.labour._id,
                        labourName: `${app.labour.user.firstName} ${app.labour.user.lastName}`,
                        phoneNumber: app.labour.user.mobileNumber,
                        location: app.labour.user.city || 'Not specified',
                        skillType: app.labour.skillType,
                        experience: app.labour.experience,
                        message: app.message,
                        appliedAt: app.appliedAt,
                        status: app.status
                    });
                }
            });
        });

        console.log('✅ Found', applications.length, 'pending applications');
        console.log('===========================\n');

        res.status(200).json({
            success: true,
            data: {
                applications,
                count: applications.length
            }
        });
    } catch (error) {
        console.error('❌ GET CONTRACTOR JOB APPLICATIONS ERROR:', error.message);
        console.log('===========================\n');
        next(error);
    }
};

// @desc    Get labour's own applications to contractor jobs
// @route   GET /api/contractor/my-applications
// @access  Private
export const getLabourApplications = async (req, res, next) => {
    try {
        console.log('\n🔵 ===== GET LABOUR APPLICATIONS =====');
        console.log('User ID:', req.user._id);

        // Find labour profile
        const labour = await Labour.findOne({ user: req.user._id });
        if (!labour) {
            return res.status(404).json({
                success: false,
                message: 'Labour profile not found'
            });
        }

        // Find all contractor jobs and filter applications by this labour
        const jobs = await ContractorJob.find({ isActive: true });

        console.log('✅ Searching through', jobs.length, 'contractor jobs');

        // Extract applications made by this labour
        const myApplications = {};
        
        jobs.forEach(job => {
            job.applications.forEach(app => {
                if (app.labour && app.labour.toString() === labour._id.toString()) {
                    myApplications[job._id.toString()] = {
                        jobId: job._id.toString(),
                        applicationId: app._id.toString(),
                        status: app.status,
                        appliedAt: app.appliedAt
                    };
                }
            });
        });

        console.log('✅ Found', Object.keys(myApplications).length, 'applications by this labour');
        console.log('===========================\n');

        res.status(200).json({
            success: true,
            data: {
                applications: myApplications,
                count: Object.keys(myApplications).length
            }
        });
    } catch (error) {
        console.error('❌ GET LABOUR APPLICATIONS ERROR:', error.message);
        console.log('===========================\n');
        next(error);
    }
};

// @desc    Update contractor job application status
// @route   PATCH /api/contractor/jobs/:jobId/applications/:applicationId
// @access  Private
export const updateContractorJobApplicationStatus = async (req, res, next) => {
    try {
        console.log('\n🟡 ===== UPDATE CONTRACTOR JOB APPLICATION STATUS =====');
        console.log('Job ID:', req.params.jobId);
        console.log('Application ID:', req.params.applicationId);
        console.log('New Status:', req.body.status);

        const job = await ContractorJob.findById(req.params.jobId);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Contractor job not found'
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

// @desc    Get contractor's application history
// @route   GET /api/contractor/application-history
// @access  Private
export const getContractorApplicationHistory = async (req, res, next) => {
    try {
        console.log('\n🔵 ===== GET CONTRACTOR APPLICATION HISTORY =====');
        console.log('User ID:', req.user._id);

        // Find all jobs posted by this contractor
        const jobs = await ContractorJob.find({ user: req.user._id, isActive: true })
            .populate({
                path: 'applications.labour',
                populate: { path: 'user', select: 'firstName lastName mobileNumber city' }
            });

        console.log('✅ Found', jobs.length, 'jobs');

        // Extract all accepted/rejected applications
        const history = [];
        
        jobs.forEach(job => {
            job.applications.forEach(app => {
                if ((app.status === 'Accepted' || app.status === 'Rejected') && app.labour) {
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

                    history.push({
                        id: app._id.toString(),
                        _id: app._id,
                        jobId: job._id,
                        jobTitle: `${job.labourSkill} - ${job.city}`,
                        labourId: app.labour._id,
                        workerName: `${app.labour.user.firstName} ${app.labour.user.lastName}`,
                        phoneNumber: app.labour.user.mobileNumber,
                        location: app.labour.user.city || 'Not specified',
                        skillType: app.labour.skillType,
                        category: app.labour.skillType,
                        experience: app.labour.experience,
                        message: app.message,
                        appliedAt: app.appliedAt,
                        date: formattedDate,
                        time: formattedTime,
                        status: app.status.toLowerCase(),
                        type: 'worker'
                    });
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
        console.error('❌ GET CONTRACTOR APPLICATION HISTORY ERROR:', error.message);
        console.log('===========================\n');
        next(error);
    }
};
