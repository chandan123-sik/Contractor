import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

// Load environment variables
dotenv.config();

console.log('\n🧪 ===== SIMPLE CLOUDINARY TEST =====\n');

// Check environment variables
console.log('1️⃣ Environment Variables:');
console.log('   CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME || '❌ MISSING');
console.log('   CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY || '❌ MISSING');
console.log('   CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '✅ Set (hidden)' : '❌ MISSING');
console.log('');

// Configure Cloudinary
console.log('2️⃣ Configuring Cloudinary...');
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Verify config
const config = cloudinary.config();
console.log('   Cloud Name:', config.cloud_name || '❌ NOT SET');
console.log('   API Key:', config.api_key || '❌ NOT SET');
console.log('   API Secret:', config.api_secret ? '✅ Set' : '❌ NOT SET');
console.log('');

// Sample small base64 image (1x1 red pixel PNG)
const sampleBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==';

// Test upload
console.log('3️⃣ Testing Upload...');
try {
    const result = await cloudinary.uploader.upload(sampleBase64, {
        folder: 'rajghar/test',
        resource_type: 'auto'
    });
    
    console.log('   ✅ Upload Successful!');
    console.log('   🔗 URL:', result.secure_url);
    console.log('   📦 Public ID:', result.public_id);
    console.log('');
    console.log('🎉 Cloudinary is working correctly!\n');
    
} catch (error) {
    console.log('   ❌ Upload Failed!');
    console.log('   Error:', error.message);
    console.log('   Error Name:', error.name);
    console.log('   HTTP Code:', error.http_code);
    console.log('');
    console.log('❌ Cloudinary configuration has issues.\n');
}

console.log('===== TEST COMPLETE =====\n');
