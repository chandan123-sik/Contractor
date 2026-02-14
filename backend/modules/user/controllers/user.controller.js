import User from '../models/User.model.js';

export const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select('-refreshToken -__v');
        
        res.status(200).json({
            success: true,
            data: { user }
        });
    } catch (error) {
        next(error);
    }
};

export const updateProfile = async (req, res, next) => {
    try {
        const allowedUpdates = ['firstName', 'middleName', 'lastName', 'city', 'state', 'address', 'profilePhoto', 'userType', 'gender', 'dob', 'aadharNumber'];
        const updates = {};

        Object.keys(req.body).forEach(key => {
            if (allowedUpdates.includes(key)) {
                updates[key] = req.body[key];
            }
        });

        const user = await User.findByIdAndUpdate(
            req.user._id,
            updates,
            { new: true, runValidators: true }
        ).select('-refreshToken -__v');

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: { user }
        });
    } catch (error) {
        next(error);
    }
};

export const getUserVerificationStatus = async (req, res, next) => {
    try {
        const VerificationRequest = (await import('../../admin/models/VerificationRequest.model.js')).default;
        
        const verificationRequest = await VerificationRequest.findOne({
            entityId: req.user._id,
            entityType: 'user'
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: {
                isVerified: req.user.isVerified || false,
                verificationRequest: verificationRequest || null
            }
        });
    } catch (error) {
        next(error);
    }
};


// @desc    Submit feedback
// @route   POST /api/users/feedback
// @access  Private
export const submitFeedback = async (req, res, next) => {
    try {
        const Feedback = (await import('../../admin/models/Feedback.model.js')).default;
        const { rating, comment } = req.body;

        if (!rating || !comment) {
            return res.status(400).json({
                success: false,
                message: 'Rating and comment are required'
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
        }

        const feedback = await Feedback.create({
            entityType: 'user',
            entityId: req.user._id,
            entityModel: 'User',
            rating,
            comment,
            givenBy: req.user._id,
            givenByModel: 'User'
        });

        res.status(201).json({
            success: true,
            message: 'Feedback submitted successfully',
            data: { feedback }
        });
    } catch (error) {
        next(error);
    }
};
