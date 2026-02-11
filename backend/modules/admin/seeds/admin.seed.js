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

// Seed Admin Users
const seedAdmins = async () => {
    try {
        // Clear existing admins
        await Admin.deleteMany({});
        console.log('🗑️  Cleared existing admins');

        // Create default admins one by one (to trigger pre-save hooks)
        const admins = [
            {
                username: 'admin',
                password: 'admin123',
                name: 'Super Admin',
                email: 'admin@rajghar.com',
                phone: '9999999999',
                role: 'SUPER_ADMIN'
            },
            {
                username: 'user_admin',
                password: 'admin123',
                name: 'User Admin',
                email: 'useradmin@rajghar.com',
                phone: '9999999998',
                role: 'ADMIN_USER'
            },
            {
                username: 'labour_admin',
                password: 'admin123',
                name: 'Labour Admin',
                email: 'labouradmin@rajghar.com',
                phone: '9999999997',
                role: 'ADMIN_LABOUR'
            },
            {
                username: 'contractor_admin',
                password: 'admin123',
                name: 'Contractor Admin',
                email: 'contractoradmin@rajghar.com',
                phone: '9999999996',
                role: 'ADMIN_CONTRACTOR'
            }
        ];

        // Create admins one by one to trigger password hashing
        for (const adminData of admins) {
            await Admin.create(adminData);
        }

        console.log('✅ Admin users seeded successfully');
        console.log('\n📋 Default Admin Credentials:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        admins.forEach(admin => {
            console.log(`\n👤 ${admin.role}`);
            console.log(`   Username: ${admin.username}`);
            console.log(`   Password: ${admin.password}`);
            console.log(`   Email: ${admin.email}`);
        });
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    } catch (error) {
        console.error('❌ Error seeding admins:', error.message);
    }
};

// Seed Labour Categories
const seedLabourCategories = async () => {
    try {
        // Clear existing categories
        await LabourCategory.deleteMany({});
        console.log('🗑️  Cleared existing labour categories');

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
    }
};

// Seed CMS Content
const seedCMSContent = async () => {
    try {
        // Clear existing CMS content
        await CMSContent.deleteMany({});
        console.log('🗑️  Cleared existing CMS content');

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
        
        console.log('\n✅ All data seeded successfully!\n');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
        process.exit(1);
    }
};

// Run seeding
seedAll();
