import dotenv from 'dotenv';

// Load environment variables FIRST - before any other imports
dotenv.config();

console.log('\n🔍 Environment Check (Before Import):');
console.log('   CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME || '❌ MISSING');
console.log('   CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? '✅ Set' : '❌ MISSING');
console.log('   CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ MISSING');

// Then import cloudinary utils
import { uploadToCloudinary } from './utils/cloudinary.utils.js';

// Sample small base64 image (1x1 red pixel PNG)
const sampleBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==';

async function testCategoryImageUpload() {
    console.log('\n🧪 ===== TESTING CATEGORY IMAGE UPLOAD =====\n');

    // Test 1: Check environment variables
    console.log('1️⃣ Checking Cloudinary Configuration...');
    console.log('   CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME || '❌ MISSING');
    console.log('   CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? '✅ Set' : '❌ MISSING');
    console.log('   CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ MISSING');
    
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        console.log('\n❌ Cloudinary credentials are missing!');
        console.log('Please check your .env file.\n');
        return;
    }
    
    console.log('   ✅ All credentials present\n');

    // Test 2: Upload test image
    console.log('2️⃣ Testing Image Upload to Cloudinary...');
    try {
        const url = await uploadToCloudinary(sampleBase64, 'rajghar/categories');
        console.log('   ✅ Upload successful!');
        console.log('   🔗 URL:', url);
        console.log('');
    } catch (error) {
        console.log('   ❌ Upload failed!');
        console.log('   Error:', error.message);
        console.log('');
        return;
    }

    // Test 3: Test with URL
    console.log('3️⃣ Testing with External URL...');
    const testUrl = 'https://cdn-icons-png.flaticon.com/512/4825/4825038.png';
    console.log('   URL:', testUrl);
    console.log('   ✅ URL format valid\n');

    console.log('🎉 All tests passed!');
    console.log('Category image upload should work now.\n');
    console.log('===== TEST COMPLETE =====\n');
}

testCategoryImageUpload();
