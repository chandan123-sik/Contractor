import Contractor from '../../contractor/models/Contractor.model.js';
import User from '../../user/models/User.model.js';
import Request from '../models/Request.model.js';
import Feedback from '../models/Feedback.model.js';

// @desc    Get all contractors
// @route   GET /api/admin/contractors
// @access  Private (SUPER_ADMIN, ADMIN_CONTRACTOR)
export const getAllContractors = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, search } = req.query;

        const query = {};

        if (status) {
            query.isActive = status === 'Active';
        }

        if (search) {
            query.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { mobileNumber: { $regex: search, $options: 'i' } },
                { businessName: { $regex: search, $options: 'i' } }
            ];
        }

        const contractors = await Contractor.find(query)
            .populate('user', 'firstName lastName mobileNumber city state gender')
            .select('-__v')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const total = await Contractor.countDocuments(query);

        res.status(200).json({
            success: true,
            data: {
                contractors,
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error fetching contractors',
            error: error.message
        });
    }
};

// @desc    Get contractor by ID
// @route   GET /api/admin/contractors/:id
// @access  Private (SUPER_ADMIN, ADMIN_CONTRACTOR)
export const getContractorById = async (req, res) => {
    try {
        const contractor = await Contractor.findById(req.params.id)
            .populate('user', 'firstName lastName mobileNumber city state gender aadharNumber profilePhoto')
            .select('-__v');

        if (!contractor) {
            return res.status(404).json({
                success: false,
                message: 'Contractor not found'
            });
        }

        res.status(200).json({
            success: true,
            data: { contractor }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error fetching contractor',
            error: error.message
        });
    }
};

// @desc    Create new contractor
// @route   POST /api/admin/contractors
// @access  Private (SUPER_ADMIN, ADMIN_CONTRACTOR)
export const createContractor = async (req, res) => {
    try {
        const { mobileNumber, firstName, lastName, businessName, businessType, gender, city, state, addressLine1, landmark } = req.body;

        // Check if user exists with this mobile number
        let user = await User.findOne({ mobileNumber });
        
        if (!user) {
            // Create new user
            user = await User.create({
                mobileNumber,
                firstName,
                lastName,
                gender,
                city,
                state,
                userType: 'Contractor',
                isActive: true
            });
        } else {
            // Update user details
            if (firstName) user.firstName = firstName;
            if (lastName) user.lastName = lastName;
            if (gender) user.gender = gender;
            if (city) user.city = city;
            if (state) user.state = state;
            if (!user.userType) user.userType = 'Contractor';
            await user.save();
        }

        // Check if contractor profile already exists for this user
        const existingContractor = await Contractor.findOne({ user: user._id });
        if (existingContractor) {
            return res.status(400).json({
                success: false,
                message: 'Contractor profile already exists for this user'
            });
        }

        // Create contractor profile
        const contractor = await Contractor.create({
            user: user._id,
            businessName: businessName || '',
            businessType: businessType || 'Proprietorship',
            city: city || '',
            state: state || '',
            addressLine1: addressLine1 || '',
            landmark: landmark || '',
            isActive: true,
            profileCompletionStatus: businessName && addressLine1 ? 'complete' : 'basic'
        });

        // Populate user data before sending response
        await contractor.populate('user', 'firstName lastName mobileNumber city state gender');

        res.status(201).json({
            success: true,
            message: 'Contractor created successfully',
            data: { contractor }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error creating contractor',
            error: error.message
        });
    }
};

// @desc    Update contractor
// @route   PUT /api/admin/contractors/:id
// @access  Private (SUPER_ADMIN, ADMIN_CONTRACTOR)
export const updateContractor = async (req, res) => {
    try {
        const { firstName, lastName, businessName, businessType, gender, city, state, addressLine1, landmark, isActive } = req.body;

        const contractor = await Contractor.findById(req.params.id).populate('user');

        if (!contractor) {
            return res.status(404).json({
                success: false,
                message: 'Contractor not found'
            });
        }

        // Update contractor fields
        if (businessName !== undefined) contractor.businessName = businessName;
        if (businessType !== undefined) contractor.businessType = businessType;
        if (addressLine1 !== undefined) contractor.addressLine1 = addressLine1;
        if (landmark !== undefined) contractor.landmark = landmark;
        if (isActive !== undefined) contractor.isActive = isActive;

        // Update profile completion status
        if (contractor.businessName && contractor.addressLine1) {
            contractor.profileCompletionStatus = 'complete';
        } else if (contractor.businessName || contractor.addressLine1) {
            contractor.profileCompletionStatus = 'basic';
        }

        // Update user fields if user exists
        if (contractor.user) {
            if (firstName !== undefined) contractor.user.firstName = firstName;
            if (lastName !== undefined) contractor.user.lastName = lastName;
            if (gender !== undefined) contractor.user.gender = gender;
            if (city !== undefined) {
                contractor.user.city = city;
                contractor.city = city;
            }
            if (state !== undefined) {
                contractor.user.state = state;
                contractor.state = state;
            }
            await contractor.user.save();
        }

        await contractor.save();
        await contractor.populate('user', 'firstName lastName mobileNumber city state gender');

        res.status(200).json({
            success: true,
            message: 'Contractor updated successfully',
            data: { contractor }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error updating contractor',
            error: error.message
        });
    }
};

// @desc    Delete contractor
// @route   DELETE /api/admin/contractors/:id
// @access  Private (SUPER_ADMIN, ADMIN_CONTRACTOR)
export const deleteContractor = async (req, res) => {
    try {
        const contractor = await Contractor.findById(req.params.id);

        if (!contractor) {
            return res.status(404).json({
                success: false,
                message: 'Contractor not found'
            });
        }

        await contractor.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Contractor deleted successfully'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error deleting contractor',
            error: error.message
        });
    }
};

// @desc    Get contractor user requests
// @route   GET /api/admin/contractors/:id/user-requests
// @access  Private (SUPER_ADMIN, ADMIN_CONTRACTOR)
export const getContractorUserRequests = async (req, res) => {
    try {
        const requests = await Request.find({
            senderId: req.params.id,
            senderType: 'Contractor',
            receiverType: 'User'
        })
        .populate('receiverId', 'firstName lastName mobileNumber city')
        .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: { users: requests }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error fetching user requests',
            error: error.message
        });
    }
};

// @desc    Get contractor labour requests
// @route   GET /api/admin/contractors/:id/labour-requests
// @access  Private (SUPER_ADMIN, ADMIN_CONTRACTOR)
export const getContractorLabourRequests = async (req, res) => {
    try {
        const requests = await Request.find({
            senderId: req.params.id,
            senderType: 'Contractor',
            receiverType: 'Labour'
        })
        .populate('receiverId', 'firstName lastName mobileNumber city')
        .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: { labours: requests }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error fetching labour requests',
            error: error.message
        });
    }
};

// @desc    Get contractor feedbacks
// @route   GET /api/admin/contractors/:id/feedbacks
// @access  Private (SUPER_ADMIN, ADMIN_CONTRACTOR)
export const getContractorFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.find({
            entityId: req.params.id,
            entityType: 'contractor'
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: { feedbacks }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error fetching feedbacks',
            error: error.message
        });
    }
};
