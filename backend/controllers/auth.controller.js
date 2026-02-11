import User from '../modules/user/models/User.model.js';
import Labour from '../modules/labour/models/Labour.model.js';
import Contractor from '../modules/contractor/models/Contractor.model.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.utils.js';

export const login = async (req, res, next) => {
    try {
        console.log('\n🟢 ===== LOGIN REQUEST =====');
        console.log('📦 Request Body:', JSON.stringify(req.body, null, 2));
        
        const { mobileNumber } = req.body;
        console.log('📱 Mobile Number:', mobileNumber);

        let user = await User.findOne({ mobileNumber });

        if (!user) {
            console.log('🆕 New user - Creating temporary entry');
            // Create a temporary user entry for new users
            user = await User.create({
                mobileNumber,
                userType: null, // Will be set during registration
                firstName: null,
                lastName: null
            });
            console.log('✅ Temporary user created:', user._id);
        }

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        user.refreshToken = refreshToken;
        await user.save();

        console.log('✅ Login successful for:', mobileNumber);
        console.log('===========================\n');

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    _id: user._id,
                    mobileNumber: user.mobileNumber,
                    userType: user.userType,
                    firstName: user.firstName,
                    lastName: user.lastName
                },
                accessToken,
                refreshToken
            }
        });
    } catch (error) {
        console.error('❌ LOGIN ERROR:', error.message);
        console.log('===========================\n');
        next(error);
    }
};

export const register = async (req, res, next) => {
    try {
        console.log('\n🟢 ===== REGISTER REQUEST =====');
        console.log('📦 Request Body:', JSON.stringify(req.body, null, 2));
        
        const {
            mobileNumber,
            userType,
            firstName,
            middleName,
            lastName,
            gender,
            dob,
            city,
            state,
            address,
            aadharNumber,
            labourDetails,
            businessDetails
        } = req.body;

        console.log('📱 Mobile Number:', mobileNumber);
        console.log('👤 User Type:', userType);
        console.log('📝 Name:', firstName, middleName, lastName);

        let user = await User.findOne({ mobileNumber });

        if (user) {
            console.log('🔄 Updating existing user:', user._id);
            user.userType = userType || user.userType;
            user.firstName = firstName || user.firstName;
            user.middleName = middleName !== undefined ? middleName : user.middleName;
            user.lastName = lastName || user.lastName;
            user.gender = gender || user.gender;
            user.dob = dob || user.dob;
            user.city = city || user.city;
            user.state = state || user.state;
            user.address = address || user.address;
            user.aadharNumber = aadharNumber || user.aadharNumber;
            await user.save();
            console.log('✅ User profile updated');
        } else {
            console.log('✨ Creating new user...');
            user = await User.create({
                mobileNumber,
                userType,
                firstName,
                middleName,
                lastName,
                gender,
                dob,
                city,
                state,
                address,
                aadharNumber
            });
            console.log('✅ New user created:', user._id);
        }

        if (userType === 'Labour' && labourDetails) {
            console.log('👷 Creating/Updating Labour profile...');
            let labour = await Labour.findOne({ user: user._id });
            if (!labour) {
                labour = await Labour.create({
                    user: user._id,
                    ...labourDetails
                });
                console.log('✅ Labour profile created');
            }
        }

        if (userType === 'Contractor' && businessDetails) {
            console.log('🏢 Creating/Updating Contractor profile...');
            let contractor = await Contractor.findOne({ user: user._id });
            if (!contractor) {
                contractor = await Contractor.create({
                    user: user._id,
                    ...businessDetails
                });
                console.log('✅ Contractor profile created');
            }
        }

        if (userType === 'Contractor') {
            let contractor = await Contractor.findOne({ user: user._id });
            if (!contractor) {
                contractor = await Contractor.create({
                    user: user._id
                });
                console.log('✅ Empty contractor profile created');
            }
        }

        if (userType === 'Labour') {
            let labour = await Labour.findOne({ user: user._id });
            if (!labour) {
                labour = await Labour.create({
                    user: user._id
                });
                console.log('✅ Empty labour profile created');
            }
        }

        console.log('ℹ️  Regular User - No additional profile needed');

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        user.refreshToken = refreshToken;
        await user.save();

        console.log('🎫 Tokens generated successfully');
        console.log('✅ Registration completed for:', mobileNumber);
        console.log('===========================\n');

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            data: {
                user: {
                    _id: user._id,
                    mobileNumber: user.mobileNumber,
                    userType: user.userType,
                    firstName: user.firstName,
                    lastName: user.lastName
                },
                accessToken,
                refreshToken
            }
        });
    } catch (error) {
        console.error('❌ REGISTER ERROR:', error.message);
        console.log('===========================\n');
        next(error);
    }
};

export const logout = async (req, res, next) => {
    try {
        req.user.refreshToken = null;
        await req.user.save();

        res.status(200).json({
            success: true,
            message: 'Logout successful'
        });
    } catch (error) {
        next(error);
    }
};

export const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: 'Refresh token required'
            });
        }

        const decoded = verifyRefreshToken(refreshToken);
        const user = await User.findById(decoded.id);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({
                success: false,
                message: 'Invalid refresh token'
            });
        }

        const newAccessToken = generateAccessToken(user._id);

        res.status(200).json({
            success: true,
            data: {
                accessToken: newAccessToken
            }
        });
    } catch (error) {
        next(error);
    }
};
