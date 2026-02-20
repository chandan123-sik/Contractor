import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/Admin.model.js';
import LabourCategory from '../models/LabourCategory.model.js';
import CMSContent from '../models/CMSContent.model.js';

dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
        await mongoose.connect(mongoUri);
        console.log('✅ MongoDB Connected for seeding');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        process.exit(1);
    }
};

// Seed Admin Users (Production-Ready)
const seedAdmins = async () => {
    try {
        // Check if any admin already exists
        const existingAdminCount = await Admin.countDocuments();
        
        if (existingAdminCount > 0) {
            console.log('⚠️  Admins already exist in database. Skipping admin seeding.');
            console.log(`   Found ${existingAdminCount} admin(s) in database.`);
            console.log('   To reset admins, manually delete them from database first.');
            return;
        }

        // Get super admin credentials from environment or use defaults
        const superAdminUsername = process.env.SUPER_ADMIN_USERNAME || 'admin';
        const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD || 'admin123';
        const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || 'admin@rajghar.com';
        const superAdminPhone = process.env.SUPER_ADMIN_PHONE || '9999999999';

        // Create only Super Admin
        const superAdmin = await Admin.create({
            username: superAdminUsername,
            password: superAdminPassword,
            name: 'Super Admin',
            email: superAdminEmail,
            phone: superAdminPhone,
            role: 'SUPER_ADMIN',
            isActive: true
        });

        console.log('✅ Super Admin created successfully');
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📋 SUPER ADMIN CREDENTIALS (SAVE THESE!)');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`\n👤 Username: ${superAdminUsername}`);
        console.log(`🔑 Password: ${superAdminPassword}`);
        console.log(`📧 Email: ${superAdminEmail}`);
        console.log(`📱 Phone: ${superAdminPhone}`);
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('⚠️  IMPORTANT FOR PRODUCTION:');
        console.log('   1. Change the password immediately after first login');
        console.log('   2. Use Admin Management dashboard to create other admins');
        console.log('   3. Set strong passwords for production deployment');
        console.log('   4. Use environment variables for credentials');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    } catch (error) {
        console.error('❌ Error seeding admins:', error.message);
        throw error;
    }
};

// Seed Labour Categories
const seedLabourCategories = async () => {
    try {
        // Check if categories already exist
        const existingCategoriesCount = await LabourCategory.countDocuments();
        
        if (existingCategoriesCount > 0) {
            console.log('⚠️  Labour categories already exist. Skipping category seeding.');
            return;
        }

        // Create default categories
        const categories = [
            { name: 'Plumber', image: 'https://cdn-icons-png.flaticon.com/512/2966/2966334.png' },
            { name: 'Electrician', image: 'https://cdn-icons-png.flaticon.com/512/2966/2966486.png' },
            { name: 'Mason', image: 'https://cdn-icons-png.flaticon.com/512/2966/2966470.png' },
            { name: 'Carpenter', image: 'https://cdn-icons-png.flaticon.com/512/2966/2966442.png' },
            { name: 'Painter', image: 'https://cdn-icons-png.flaticon.com/512/2966/2966367.png' },
            { name: 'Welder', image: 'https://cdn-icons-png.flaticon.com/512/2966/2966453.png' },
            { name: 'Daily Wager', image: 'https://cdn-icons-png.flaticon.com/512/2966/2966497.png' }
        ];

        await LabourCategory.insertMany(categories);
        console.log('✅ Labour categories seeded successfully');

    } catch (error) {
        console.error('❌ Error seeding labour categories:', error.message);
        throw error;
    }
};

// Seed CMS Content
const seedCMSContent = async () => {
    try {
        // Check if CMS content already exists
        const existingContentCount = await CMSContent.countDocuments();
        
        if (existingContentCount > 0) {
            console.log('⚠️  CMS content already exists. Skipping CMS seeding.');
            return;
        }

        // Create default CMS content
        const cmsContent = [
            {
                section: 'aboutUs',
                content: {
                    title: 'Welcome to Rajghar',
                    description: 'This platform helps skilled labours find genuine work opportunities from verified users and contractors in their local area.',
                    vision: 'Provide regular work opportunities and financial stability to skilled labours.',
                    mission: 'Connect labours directly with users and contractors through a trusted digital platform.'
                }
            },
            {
                section: 'contactUs',
                content: {
                    email: 'support@rajghar.com',
                    phone: '+91 1800-123-4567',
                    address: 'Indore, Madhya Pradesh, India - 452001',
                    workingHours: 'Monday - Saturday: 9:00 AM - 6:00 PM'
                }
            },
            {
                section: 'terms',
                content: 'Terms and Conditions content goes here...'
            },
            {
                section: 'privacy',
                content: 'Privacy Policy content goes here...'
            }
        ];

        await CMSContent.insertMany(cmsContent);
        console.log('✅ CMS content seeded successfully');

    } catch (error) {
        console.error('❌ Error seeding CMS content:', error.message);
        throw error;
    }
};

// Main seed function
const seedAll = async () => {
    try {
        await connectDB();
        
        console.log('\n🌱 Starting database seeding...\n');
        
        await seedAdmins();
        await seedLabourCategories();
        await seedCMSContent();
        
        console.log('\n✅ Database seeding completed!\n');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
        process.exit(1);
    }
};

// Run seeding
seedAll();

