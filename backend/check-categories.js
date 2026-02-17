import dotenv from 'dotenv';
import mongoose from 'mongoose';
import LabourCategory from './modules/admin/models/LabourCategory.model.js';

dotenv.config();

async function checkCategories() {
    try {
        console.log('\n🔍 ===== CHECKING CATEGORIES =====\n');
        
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Fetch all categories
        const categories = await LabourCategory.find();
        
        console.log(`📊 Total Categories: ${categories.length}\n`);
        
        if (categories.length === 0) {
            console.log('⚠️  No categories found in database\n');
        } else {
            console.log('Categories:\n');
            categories.forEach((cat, index) => {
                console.log(`${index + 1}. ${cat.name}`);
                console.log(`   ID: ${cat._id}`);
                console.log(`   Image: ${cat.image || 'NOT SET'}`);
                console.log(`   Icon: ${cat.icon || 'NOT SET'}`);
                console.log(`   Active: ${cat.isActive}`);
                console.log(`   Created: ${cat.createdAt}`);
                console.log('');
            });
        }

        console.log('===== CHECK COMPLETE =====\n');
        
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

checkCategories();
