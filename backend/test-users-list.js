import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './modules/user/models/User.model.js';

dotenv.config();

const listUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rajghar');
        console.log('✅ MongoDB Connected\n');

        const users = await User.find().select('mobileNumber userType firstName lastName city').limit(10);
        
        console.log(`Found ${users.length} users:\n`);
        users.forEach((user, index) => {
            console.log(`${index + 1}. Phone: ${user.mobileNumber}`);
            console.log(`   Type: ${user.userType}`);
            console.log(`   Name: ${user.firstName} ${user.lastName}`);
            console.log(`   City: ${user.city || 'N/A'}`);
            console.log('');
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

listUsers();
