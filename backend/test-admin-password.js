import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './modules/admin/models/Admin.model.js';

dotenv.config();

const testPassword = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const admin = await Admin.findOne({ username: 'admin' }).select('+password');
        
        if (!admin) {
            console.log('❌ Admin not found');
            process.exit(1);
        }

        console.log('\n📋 Admin Details:');
        console.log('Username:', admin.username);
        console.log('Name:', admin.name);
        console.log('Role:', admin.role);
        console.log('Password Hash:', admin.password.substring(0, 20) + '...');
        console.log('Is Hashed:', admin.password.startsWith('$2'));

        // Test password
        console.log('\n🔐 Testing Password:');
        const testPass = 'admin123';
        const isMatch = await admin.comparePassword(testPass);
        console.log(`Password "${testPass}" matches:`, isMatch);

        if (!isMatch) {
            console.log('\n⚠️  Password does not match! Re-seeding required.');
        } else {
            console.log('\n✅ Password is correct!');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

testPassword();
