import Contractor from '../models/Contractor.model.js';
import ContractorJob from '../models/ContractorJob.model.js';
import User from '../../user/models/User.model.js';

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
                landmark
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

            await contractor.save();
            console.log('✅ Contractor profile updated');
        }

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
            rating
        } = req.body;

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
            rating: rating || 0
        });

        console.log('✅ Contractor job created:', contractorJob._id);
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
        
        const { city, labourSkill, profileStatus = 'Active', page = 1, limit = 100 } = req.query;

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
