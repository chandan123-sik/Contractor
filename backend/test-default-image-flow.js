import dotenv from 'dotenv';
import mongoose from 'mongoose';
import LabourCategory from './modules/admin/models/LabourCategory.model.js';

dotenv.config();

async function testDefaultImageFlow() {
    try {
        console.log('\n🧪 ===== TESTING DEFAULT IMAGE FLOW =====\n');
        
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Test 1: Category with no image (should use default)
        console.log('Test 1: Creating category WITHOUT image...');
        const testCategory1 = await LabourCategory.create({
            name: 'Test Category No Image',
            // No image field - should use model default
        });
        console.log(`✅ Created: ${testCategory1.name}`);
        console.log(`   Image: ${testCategory1.image}`);
        console.log(`   Expected: https://cdn-icons-png.flaticon.com/512/4825/4825038.png`);
        console.log(`   Match: ${testCategory1.image === 'https://cdn-icons-png.flaticon.com/512/4825/4825038.png' ? '✅ YES' : '❌ NO'}\n`);

        // Test 2: Category with custom URL
        console.log('Test 2: Creating category WITH custom URL...');
        const testCategory2 = await LabourCategory.create({
            name: 'Test Category Custom URL',
            image: 'https://example.com/custom-image.png'
        });
        console.log(`✅ Created: ${testCategory2.name}`);
        console.log(`   Image: ${testCategory2.image}`);
        console.log(`   Expected: https://example.com/custom-image.png`);
        console.log(`   Match: ${testCategory2.image === 'https://example.com/custom-image.png' ? '✅ YES' : '❌ NO'}\n`);

        // Test 3: Fetch all categories and check images
        console.log('Test 3: Fetching all categories...');
        const allCategories = await LabourCategory.find({ isActive: true })
            .select('name icon image')
            .sort({ name: 1 });
        
        console.log(`✅ Found ${allCategories.length} active categories\n`);
        
        console.log('Categories with their images:');
        allCategories.forEach((cat, index) => {
            const hasDefaultImage = cat.image === 'https://cdn-icons-png.flaticon.com/512/4825/4825038.png';
            const hasCloudinaryImage = cat.image && cat.image.includes('cloudinary.com');
            const hasCustomURL = cat.image && cat.image.startsWith('http') && !hasDefaultImage && !hasCloudinaryImage;
            
            console.log(`${index + 1}. ${cat.name}`);
            console.log(`   Image: ${cat.image}`);
            console.log(`   Type: ${hasDefaultImage ? '🎨 Default' : hasCloudinaryImage ? '☁️  Cloudinary' : hasCustomURL ? '🔗 Custom URL' : '❓ Unknown'}`);
            console.log('');
        });

        // Cleanup test categories
        console.log('Cleaning up test categories...');
        await LabourCategory.deleteMany({ 
            name: { $in: ['Test Category No Image', 'Test Category Custom URL'] } 
        });
        console.log('✅ Test categories deleted\n');

        console.log('===== TEST COMPLETE =====\n');
        
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        await mongoose.disconnect();
        process.exit(1);
    }
}

testDefaultImageFlow();
