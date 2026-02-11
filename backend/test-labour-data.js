import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Labour from './modules/labour/models/Labour.model.js';
import User from './modules/user/models/User.model.js';

dotenv.config();

const testLabourData = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rajghar');
        console.log('✅ MongoDB Connected\n');

        // Get all labours
        console.log('📊 Fetching all labours...');
        const labours = await Labour.find().limit(5);
        console.log(`Found ${labours.length} labours\n`);

        for (const labour of labours) {
            console.log('-----------------------------------');
            console.log('Labour ID:', labour._id);
            console.log('User ID (ObjectId):', labour.user);
            console.log('Skill Type:', labour.skillType);
            console.log('Experience:', labour.experience);

            // Manually fetch user
            const user = await User.findById(labour.user);
            if (user) {
                console.log('✅ User Found:');
                console.log('  - Name:', user.firstName, user.lastName);
                console.log('  - Mobile:', user.mobileNumber);
                console.log('  - City:', user.city);
            } else {
                console.log('❌ User NOT Found for this labour');
            }
            console.log('');
        }

        // Test with populate
        console.log('\n📊 Testing with populate...');
        const populatedLabours = await Labour.find()
            .populate('user', 'firstName lastName mobileNumber city state gender')
            .limit(2);

        console.log('Populated labours:', JSON.stringify(populatedLabours, null, 2));

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

testLabourData();
