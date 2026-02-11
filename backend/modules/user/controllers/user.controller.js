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
        const allowedUpdates = ['firstName', 'middleName', 'lastName', 'city', 'state', 'address', 'profilePhoto'];
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
