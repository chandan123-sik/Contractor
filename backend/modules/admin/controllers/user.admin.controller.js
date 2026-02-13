import User from '../../user/models/User.model.js';
import Request from '../models/Request.model.js';
import Feedback from '../models/Feedback.model.js';
import ContractorHireRequest from '../../contractor/models/ContractorHireRequest.model.js';
import HireRequest from '../../labour/models/HireRequest.model.js';

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (SUPER_ADMIN, ADMIN_USER)
export const getAllUsers = async (req, res) => {
    try {
        console.log('\n🔵 ===== GET ALL USERS =====');
        const { page = 1, limit = 10, status, search } = req.query;

        const query = {}; // Remove userType filter to show all users from users collection

        if (status) {
            query.isActive = status === 'Active';
        }

        if (search) {
            query.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { mobileNumber: { $regex: search, $options: 'i' } }
            ];
        }

        console.log('Query:', JSON.stringify(query));

        const users = await User.find(query)
            .select('-refreshToken -__v')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const total = await User.countDocuments(query);

        console.log('✅ Found', users.length, 'users out of', total, 'total');
        console.log('===========================\n');

        res.status(200).json({
            success: true,
            data: {
                users,
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('❌ GET ALL USERS ERROR:', error.message);
        console.log('===========================\n');
        res.status(500).json({
            success: false,
            message: 'Server error fetching users',
            error: error.message
        });
    }
};

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private (SUPER_ADMIN, ADMIN_USER)
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-refreshToken -__v');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: { user }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error fetching user',
            error: error.message
        });
    }
};

// @desc    Create new user
// @route   POST /api/admin/users
// @access  Private (SUPER_ADMIN, ADMIN_USER)
export const createUser = async (req, res) => {
    try {
        const { mobileNumber, firstName, lastName, gender, city, state } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ mobileNumber });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this mobile number already exists'
            });
        }

        const user = await User.create({
            mobileNumber,
            userType: 'User',
            firstName,
            lastName,
            gender,
            city,
            state,
            isActive: true
        });

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: { user }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error creating user',
            error: error.message
        });
    }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private (SUPER_ADMIN, ADMIN_USER)
export const updateUser = async (req, res) => {
    try {
        const { firstName, lastName, gender, city, state, isActive } = req.body;

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (firstName !== undefined) user.firstName = firstName;
        if (lastName !== undefined) user.lastName = lastName;
        if (gender !== undefined) user.gender = gender;
        if (city !== undefined) user.city = city;
        if (state !== undefined) user.state = state;
        if (isActive !== undefined) user.isActive = isActive;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: { user }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error updating user',
            error: error.message
        });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (SUPER_ADMIN, ADMIN_USER)
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        await user.deleteOne();

        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error deleting user',
            error: error.message
        });
    }
};

// @desc    Get user contractor requests
// @route   GET /api/admin/users/:id/contractor-requests
// @access  Private (SUPER_ADMIN, ADMIN_USER)
export const getUserContractorRequests = async (req, res) => {
    try {
        console.log('\n🔵 ===== GET USER CONTRACTOR REQUESTS =====');
        console.log('👤 User ID:', req.params.id);

        // Get contractor hire requests sent by this user
        const contractorRequests = await ContractorHireRequest.find({
            requesterId: req.params.id
        })
        .sort({ createdAt: -1 });

        console.log('✅ Found', contractorRequests.length, 'contractor requests');
        console.log('===========================\n');

        res.status(200).json({
            success: true,
            data: { 
                requests: contractorRequests,
                total: contractorRequests.length
            }
        });

    } catch (error) {
        console.error('❌ GET USER CONTRACTOR REQUESTS ERROR:', error.message);
        console.log('===========================\n');
        res.status(500).json({
            success: false,
            message: 'Server error fetching contractor requests',
            error: error.message
        });
    }
};

// @desc    Get user labour requests
// @route   GET /api/admin/users/:id/labour-requests
// @access  Private (SUPER_ADMIN, ADMIN_USER)
export const getUserLabourRequests = async (req, res) => {
    try {
        console.log('\n🔵 ===== GET USER LABOUR REQUESTS =====');
        console.log('👤 User ID:', req.params.id);

        // Get labour hire requests sent by this user
        const labourRequests = await HireRequest.find({
            requesterId: req.params.id,
            requesterModel: 'User'
        })
        .sort({ createdAt: -1 });

        console.log('✅ Found', labourRequests.length, 'labour requests');
        console.log('===========================\n');

        res.status(200).json({
            success: true,
            data: { 
                requests: labourRequests,
                total: labourRequests.length
            }
        });

    } catch (error) {
        console.error('❌ GET USER LABOUR REQUESTS ERROR:', error.message);
        console.log('===========================\n');
        res.status(500).json({
            success: false,
            message: 'Server error fetching labour requests',
            error: error.message
        });
    }
};

// @desc    Get user feedbacks
// @route   GET /api/admin/users/:id/feedbacks
// @access  Private (SUPER_ADMIN, ADMIN_USER)
export const getUserFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.find({
            entityId: req.params.id,
            entityType: 'user'
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
