import Labour from '../models/Labour.model.js';
import User from '../../user/models/User.model.js';

// @desc    Create labour profile (during registration)
// @route   POST /api/labour/create-profile
// @access  Public (with token)
export const createLabourProfile = async (req, res, next) => {
    try {
        console.log('\n🟢 ===== CREATE LABOUR PROFILE (REGISTRATION) =====');
        console.log('📦 Request Body:', JSON.stringify(req.body, null, 2));

        const {
            mobileNumber,
            firstName,
            lastName,
            gender,
            city,
            state,
            skillType,
            experience,
            workPhotos,
            previousWorkLocation
        } = req.body;

        if (!mobileNumber) {
            return res.status(400).json({
                success: false,
                message: 'Mobile number is required'
            });
        }

        // Find or create user
        let user = await User.findOne({ mobileNumber });
        
        if (!user) {
            console.log('✨ Creating new user...');
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
            console.log('✅ User created:', user._id);
        } else {
            // Update user details if they exist
            console.log('🔄 Updating existing user:', user._id);
            if (firstName) user.firstName = firstName;
            if (lastName) user.lastName = lastName;
            if (gender) user.gender = gender;
            if (city) user.city = city;
            if (state) user.state = state;
            if (!user.userType) user.userType = 'Labour';
            await user.save();
        }

        // Check if labour profile already exists
        let labour = await Labour.findOne({ user: user._id });

        if (!labour) {
            console.log('✨ Creating new labour profile...');
            labour = await Labour.create({
                user: user._id,
                skillType: skillType || 'Other',
                experience: experience || '',
                workPhotos: workPhotos || [],
                previousWorkLocation: previousWorkLocation || '',
                isActive: true
            });
            console.log('✅ Labour profile created:', labour._id);
        } else {
            console.log('🔄 Updating existing labour profile:', labour._id);
            if (skillType) labour.skillType = skillType;
            if (experience) labour.experience = experience;
            if (workPhotos) labour.workPhotos = workPhotos;
            if (previousWorkLocation) labour.previousWorkLocation = previousWorkLocation;
            await labour.save();
            console.log('✅ Labour profile updated');
        }

        // Populate user data
        await labour.populate('user', 'firstName lastName mobileNumber city state gender');

        console.log('===========================\n');

        res.status(201).json({
            success: true,
            message: 'Labour profile created successfully',
            data: { labour, user }
        });
    } catch (error) {
        console.error('❌ CREATE LABOUR PROFILE ERROR:', error.message);
        console.log('===========================\n');
        next(error);
    }
};

export const updateWorkDetails = async (req, res, next) => {
    try {
        console.log('\n🟡 ===== UPDATE LABOUR WORK DETAILS =====');
        console.log('📦 Request Body:', JSON.stringify(req.body, null, 2));
        console.log('👤 User ID:', req.user._id);

        const {
            skillType,
            experience,
            workPhotos,
            previousWorkLocation,
            rating,
            availability
        } = req.body;

        let labour = await Labour.findOne({ user: req.user._id });

        if (!labour) {
            console.log('✨ Creating new labour profile...');
            labour = await Labour.create({
                user: req.user._id,
                skillType,
                experience,
                workPhotos,
                previousWorkLocation,
                rating,
                availability
            });
            console.log('✅ Labour profile created:', labour._id);
        } else {
            console.log('🔄 Updating existing labour profile:', labour._id);
            if (skillType) labour.skillType = skillType;
            if (experience) labour.experience = experience;
            if (workPhotos) labour.workPhotos = workPhotos;
            if (previousWorkLocation) labour.previousWorkLocation = previousWorkLocation;
            if (rating !== undefined) labour.rating = rating;
            if (availability) labour.availability = availability;

            await labour.save();
            console.log('✅ Labour profile updated');
        }

        console.log('===========================\n');

        res.status(200).json({
            success: true,
            message: 'Work details updated successfully',
            data: { labour }
        });
    } catch (error) {
        console.error('❌ UPDATE WORK DETAILS ERROR:', error.message);
        console.log('===========================\n');
        next(error);
    }
};

export const createLabourCard = async (req, res, next) => {
    try {
        console.log('\n🟢 ===== CREATE LABOUR CARD =====');
        console.log('📦 Request Body keys:', Object.keys(req.body));
        console.log('👤 User ID:', req.user._id);

        let labour = await Labour.findOne({ user: req.user._id });

        if (!labour) {
            console.log('✨ Creating new labour profile with card...');
            labour = await Labour.create({
                user: req.user._id,
                ...req.body,
                hasLabourCard: true
            });
            console.log('✅ Labour profile created:', labour._id);
        } else {
            console.log('🔄 Updating existing labour profile with card...');
            Object.keys(req.body).forEach(key => {
                labour[key] = req.body[key];
            });
            labour.hasLabourCard = true;
            await labour.save();
            console.log('✅ Labour card updated');
        }

        console.log('===========================\n');

        res.status(201).json({
            success: true,
            message: 'Labour card created successfully',
            data: { labour }
        });
    } catch (error) {
        console.error('❌ CREATE LABOUR CARD ERROR:', error.message);
        console.log('===========================\n');
        next(error);
    }
};

export const getLabourProfile = async (req, res, next) => {
    try {
        console.log('\n🔵 ===== GET LABOUR PROFILE =====');
        console.log('👤 User ID:', req.user._id);

        const labour = await Labour.findOne({ user: req.user._id })
            .populate('user', 'firstName lastName mobileNumber profilePhoto');

        if (!labour) {
            console.log('❌ Labour profile not found');
            console.log('===========================\n');
            return res.status(404).json({
                success: false,
                message: 'Labour profile not found'
            });
        }

        console.log('✅ Labour profile found:', labour._id);
        console.log('===========================\n');

        res.status(200).json({
            success: true,
            data: { labour }
        });
    } catch (error) {
        console.error('❌ GET LABOUR PROFILE ERROR:', error.message);
        console.log('===========================\n');
        next(error);
    }
};

export const browseLabourCards = async (req, res, next) => {
    try {
        console.log('\n🔵 ===== BROWSE LABOUR CARDS =====');

        const { city, skillType, availability, page = 1, limit = 100 } = req.query;

        const query = { isActive: true, hasLabourCard: true };

        if (skillType) {
            query.skillType = skillType;
        }
        if (availability) {
            query.availability = availability;
        }

        console.log('Query:', query);

        const labours = await Labour.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);
            // Removed populate to avoid errors if user ref is missing

        const total = await Labour.countDocuments(query);

        console.log('✅ Found', labours.length, 'labour cards');
        console.log('===========================\n');

        res.status(200).json({
            success: true,
            data: {
                labours,
                total,
                page: parseInt(page),
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('❌ BROWSE LABOUR CARDS ERROR:', error.message);
        console.error('Stack:', error.stack);
        console.log('===========================\n');
        next(error);
    }
};

export const getLabourById = async (req, res, next) => {
    try {
        const labour = await Labour.findById(req.params.id)
            .populate('user', 'firstName lastName mobileNumber city profilePhoto');

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
        next(error);
    }
};

export const getLabourVerificationStatus = async (req, res, next) => {
    try {
        console.log('\n🔵 ===== GET LABOUR VERIFICATION STATUS =====');
        console.log('👤 User ID:', req.user._id);

        const labour = await Labour.findOne({ user: req.user._id });

        if (!labour) {
            return res.status(404).json({
                success: false,
                message: 'Labour profile not found'
            });
        }

        // Import VerificationRequest model
        const VerificationRequest = (await import('../../admin/models/VerificationRequest.model.js')).default;
        
        const verificationRequest = await VerificationRequest.findOne({
            entityId: labour._id,
            entityType: 'labour'
        }).sort({ createdAt: -1 });

        console.log('✅ Verification status:', verificationRequest?.status || 'Not submitted');
        console.log('===========================\n');

        res.status(200).json({
            success: true,
            data: {
                isVerified: labour.isVerified || false,
                verificationRequest: verificationRequest || null
            }
        });
    } catch (error) {
        console.error('❌ GET VERIFICATION STATUS ERROR:', error.message);
        console.log('===========================\n');
        next(error);
    }
};
