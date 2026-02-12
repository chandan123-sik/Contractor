import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './modules/user/models/User.model.js';
import Labour from './modules/labour/models/Labour.model.js';

dotenv.config();

const createProfile = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rajghar');
        console.log('✅ MongoDB Connected\n');

        // Find user with phone 4444444444
        const user = await User.findOne({ mobileNumber: '4444444444' });
        if (!user) {
            console.log('❌ User not found with phone 4444444444');
            process.exit(1);
        }

        console.log('User found:');
        console.log('  ID:', user._id);
        console.log('  Name:', user.firstName, user.lastName);
        console.log('  Type:', user.userType);
        console.log('');

        // Check if labour profile exists
        let labour = await Labour.findOne({ user: user._id });
        if (!labour) {
            console.log('❌ Labour profile NOT found, creating...');
            
            labour = await Labour.create({
                user: user._id,
                hasLabourCard: true,
                skillType: 'General',
                labourCardDetails: {
                    fullName: 'tyty',
                    mobileNumber: '4444444444',
                    skills: 'General'
                }
            });
            
            console.log('✅ Labour profile created:', labour._id);
        } else {
            console.log('✅ Labour profile already exists:', labour._id);
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

createProfile();
