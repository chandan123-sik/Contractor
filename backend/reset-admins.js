import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './modules/admin/models/Admin.model.js';

dotenv.config();

const resetAdmins = async () => {
    try {
        // Connect to MongoDB
        const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
        await mongoose.connect(mongoUri);
        console.log('✅ MongoDB Connected');

        // Delete all existing admins
        const deleteResult = await Admin.deleteMany({});
        console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing admin(s)`);

        // Get credentials from environment variables
        const username = process.env.SUPER_ADMIN_USERNAME || 'admin';
        const password = process.env.SUPER_ADMIN_PASSWORD || 'admin123';
        const email = process.env.SUPER_ADMIN_EMAIL || 'admin@rajghar.com';
        const phone = process.env.SUPER_ADMIN_PHONE || '9999999999';

        // Create new Super Admin
        const superAdmin = await Admin.create({
            username: username,
            password: password,
            name: 'Super Admin',
            email: email,
            phone: phone,
            role: 'SUPER_ADMIN',
            isActive: true
        });

        console.log('\n✅ New Super Admin created successfully!');
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📋 SUPER ADMIN CREDENTIALS');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`\n👤 Username: ${username}`);
        console.log(`🔑 Password: ${password}`);
        console.log(`📧 Email: ${email}`);
        console.log(`📱 Phone: ${phone}`);
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('✅ Database reset complete!');
        console.log('🎯 You can now login with these credentials');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

resetAdmins();
