import dotenv from 'dotenv';
import { uploadToCloudinary, uploadMultipleToCloudinary, deleteFromCloudinary } from './utils/cloudinary.utils.js';

dotenv.config();

// Sample base64 image (1x1 red pixel PNG)
const sampleBase64Image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==';

async function testCloudinaryUpload() {
    console.log('\n🧪 ===== TESTING CLOUDINARY UPLOAD =====\n');

    try {
        // Test 1: Single image upload
        console.log('📤 Test 1: Uploading single image...');
        const singleUrl = await uploadToCloudinary(sampleBase64Image, 'rajghar/test');
        console.log('✅ Single upload successful!');
        console.log('🔗 URL:', singleUrl);
        console.log('');

        // Test 2: Multiple images upload
        console.log('📤 Test 2: Uploading multiple images...');
        const multipleUrls = await uploadMultipleToCloudinary(
            [sampleBase64Image, sampleBase64Image, sampleBase64Image],
            'rajghar/test'
        );
        console.log('✅ Multiple upload successful!');
        console.log('🔗 URLs:', multipleUrls);
        console.log('');

        // Test 3: Delete image
        console.log('🗑️  Test 3: Deleting uploaded image...');
        await deleteFromCloudinary(singleUrl);
        console.log('✅ Delete successful!');
        console.log('');

        // Clean up multiple uploads
        console.log('🧹 Cleaning up test images...');
        for (const url of multipleUrls) {
            await deleteFromCloudinary(url);
        }
        console.log('✅ Cleanup complete!');
        console.log('');

        console.log('🎉 All tests passed successfully!');
        console.log('\n===== CLOUDINARY CONFIGURATION VERIFIED =====\n');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error('Stack:', error.stack);
        console.log('\n⚠️  Please check your Cloudinary configuration in .env file');
        console.log('Required variables:');
        console.log('  - CLOUDINARY_CLOUD_NAME');
        console.log('  - CLOUDINARY_API_KEY');
        console.log('  - CLOUDINARY_API_SECRET');
    }
}

// Run tests
testCloudinaryUpload();
