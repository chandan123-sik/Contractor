import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import User from './modules/user/models/User.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

async function checkUserProfile() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected\n');

        const users = await User.find({});
        
        console.log('========================================');
        console.log('ALL USERS IN DATABASE');
        console.log('========================================\n');
        
        console.log(`📊 Total Users: ${users.length}\n`);
        
        users.forEach((user, index) => {
            console.log(`\n--- User ${index + 1} ---`);
            console.log(`ID: ${user._id}`);
            console.log(`Mobile: ${user.mobileNumber}`);
            console.log(`User Type: ${user.userType}`);
            console.log(`First Name: ${user.firstName || 'NOT SET'}`);
            console.log(`Middle Name: ${user.middleName || 'NOT SET'}`);
            console.log(`Last Name: ${user.lastName || 'NOT SET'}`);
            console.log(`Gender: ${user.gender || 'NOT SET'}`);
            console.log(`City: ${user.city || 'NOT SET'}`);
            console.log(`Created At: ${user.createdAt}`);
        });

        await mongoose.connection.close();
        console.log('\n✅ Connection closed');
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

checkUserProfile();
