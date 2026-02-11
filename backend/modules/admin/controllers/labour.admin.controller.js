import Labour from '../../labour/models/Labour.model.js';
import User from '../../user/models/User.model.js';
import Request from '../models/Request.model.js';
import Feedback from '../models/Feedback.model.js';

// @desc    Get all labours
// @route   GET /api/admin/labours
// @access  Private (SUPER_ADMIN, ADMIN_LABOUR)
export const getAllLabours = async (req, res) => {
    try {
        console.log('\n🔵 ===== GET ALL LABOURS =====');
        const { page = 1, limit = 10, status, trade, search } = req.query;

        const query = {};

        if (status) {
            query.isActive = status === 'Active';
        }

        if (trade) {
            query.skillType = trade; // Labour model uses skillType, not trade
        }

        if (search) {
            // Search in skillType field of Labour model
            query.$or = [
                { skillType: { $regex: search, $options: 'i' } },
                { experience: { $regex: search, $options: 'i' } }
            ];
        }

        console.log('Query:', JSON.stringify(query));

        const labours = await Labour.find(query)
            .populate('user', 'firstName lastName mobileNumber city state gender')
            .select('-__v')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        console.log('Found labours:', labours.length);
        if (labours.length > 0) {
            console.log('Sample labour:', JSON.stringify(labours[0], null, 2));
        }

        const total = await Labour.countDocuments(query);

        console.log('===========================\n');

        res.status(200).json({
            success: true,
            data: {
                labours,
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error fetching labours',
            error: error.message
        });
    }
};

// @desc    Get labour by ID
// @route   GET /api/admin/labours/:id
// @access  Private (SUPER_ADMIN, ADMIN_LABOUR)
export const getLabourById = async (req, res) => {
    try {
        const labour = await Labour.findById(req.params.id)
            .populate('user', 'firstName lastName mobileNumber city state gender aadharNumber profilePhoto')
            .select('-__v');

        if (!labour) {
            return res.status(404).json({
                success: false,
                message: 'Labour not found'
            });
        }

        res.status(200).json({
            success: true,
            data: { labour }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error fetching labour',
            error: error.message
        });
    }
};

// @desc    Create new labour
// @route   POST /api/admin/labours
// @access  Private (SUPER_ADMIN, ADMIN_LABOUR)
export const createLabour = async (req, res) => {
    try {
        const { mobileNumber, firstName, lastName, skillType, gender, city, state, experience } = req.body;

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
                userType: 'Labour',
                isActive: true
            });
        }

        // Check if labour profile already exists for this user
        const existingLabour = await Labour.findOne({ user: user._id });
        if (existingLabour) {
            return res.status(400).json({
                success: false,
                message: 'Labour profile already exists for this user'
            });
        }

        // Create labour profile
        const labour = await Labour.create({
            user: user._id,
            skillType: skillType || 'Other',
            experience: experience || '',
            isActive: true
        });

        // Populate user data before sending response
        await labour.populate('user', 'firstName lastName mobileNumber city state gender');

        res.status(201).json({
            success: true,
            message: 'Labour created successfully',
            data: { labour }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error creating labour',
            error: error.message
        });
    }
};

// @desc    Update labour
// @route   PUT /api/admin/labours/:id
// @access  Private (SUPER_ADMIN, ADMIN_LABOUR)
export const updateLabour = async (req, res) => {
    try {
        const { firstName, lastName, trade, gender, city, state, isActive } = req.body;

        const labour = await Labour.findById(req.params.id);

        if (!labour) {
            return res.status(404).json({
                success: false,
                message: 'Labour not found'
            });
        }

        if (firstName !== undefined) labour.firstName = firstName;
        if (lastName !== undefined) labour.lastName = lastName;
        if (trade !== undefined) labour.trade = trade;
        if (gender !== undefined) labour.gender = gender;
        if (city !== undefined) labour.city = city;
        if (state !== undefined) labour.state = state;
        if (isActive !== undefined) labour.isActive = isActive;

        await labour.save();

        res.status(200).json({
            success: true,
            message: 'Labour updated successfully',
            data: { labour }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error updating labour',
            error: error.message
        });
    }
};

// @desc    Delete labour
// @route   DELETE /api/admin/labours/:id
// @access  Private (SUPER_ADMIN, ADMIN_LABOUR)
export const deleteLabour = async (req, res) => {
    try {
        const labour = await Labour.findById(req.params.id);

        if (!labour) {
            return res.status(404).json({
                success: false,
                message: 'Labour not found'
            });
        }

        await labour.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Labour deleted successfully'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error deleting labour',
            error: error.message
        });
    }
};

// @desc    Get labour contractor requests
// @route   GET /api/admin/labours/:id/contractor-requests
// @access  Private (SUPER_ADMIN, ADMIN_LABOUR)
export const getLabourContractorRequests = async (req, res) => {
    try {
        const requests = await Request.find({
            senderId: req.params.id,
            senderType: 'Labour',
            receiverType: 'Contractor'
        })
        .populate('receiverId', 'firstName lastName mobileNumber city')
        .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: { contractors: requests }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error fetching contractor requests',
            error: error.message
        });
    }
};

// @desc    Get labour user requests
// @route   GET /api/admin/labours/:id/user-requests
// @access  Private (SUPER_ADMIN, ADMIN_LABOUR)
export const getLabourUserRequests = async (req, res) => {
    try {
        const requests = await Request.find({
            senderId: req.params.id,
            senderType: 'Labour',
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

// @desc    Get labour feedbacks
// @route   GET /api/admin/labours/:id/feedbacks
// @access  Private (SUPER_ADMIN, ADMIN_LABOUR)
export const getLabourFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.find({
            entityId: req.params.id,
            entityType: 'labour'
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
