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
