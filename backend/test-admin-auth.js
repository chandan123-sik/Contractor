import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

// Load environment variables
dotenv.config();

console.log('\n🔍 ADMIN AUTHENTICATION CONFIGURATION TEST\n');
console.log('='.repeat(60));

// Test 1: Check if JWT_SECRET is loaded
console.log('\n1️⃣ JWT_SECRET Configuration:');
console.log('   Exists:', !!process.env.JWT_SECRET);
console.log('   Length:', process.env.JWT_SECRET?.length || 0);
console.log('   Value (first 10 chars):', process.env.JWT_SECRET?.substring(0, 10) + '...');

// Test 2: Check JWT_EXPIRE
console.log('\n2️⃣ JWT_EXPIRE Configuration:');
console.log('   Value:', process.env.JWT_EXPIRE || 'NOT SET (will use 7d default)');

// Test 3: Check JWT_REFRESH_SECRET
console.log('\n3️⃣ JWT_REFRESH_SECRET Configuration:');
console.log('   Exists:', !!process.env.JWT_REFRESH_SECRET);
console.log('   Length:', process.env.JWT_REFRESH_SECRET?.length || 0);

// Test 4: Check JWT_REFRESH_EXPIRE
console.log('\n4️⃣ JWT_REFRESH_EXPIRE Configuration:');
console.log('   Value:', process.env.JWT_REFRESH_EXPIRE || 'NOT SET (will use 30d default)');

// Test 5: Generate and verify a test token
console.log('\n5️⃣ Token Generation & Verification Test:');
try {
    const testUserId = '507f1f77bcf86cd799439011'; // Sample MongoDB ObjectId
    
    // Generate token
    const token = jwt.sign(
        { id: testUserId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
    
    console.log('   ✅ Token generated successfully');
    console.log('   Token length:', token.length);
    console.log('   Token (first 50 chars):', token.substring(0, 50) + '...');
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('   ✅ Token verified successfully');
    console.log('   Decoded user ID:', decoded.id);
    console.log('   Token expires at:', new Date(decoded.exp * 1000).toLocaleString());
    
    // Calculate expiry time
    const now = Math.floor(Date.now() / 1000);
    const expiresIn = decoded.exp - now;
    const daysUntilExpiry = Math.floor(expiresIn / (60 * 60 * 24));
    console.log('   Days until expiry:', daysUntilExpiry);
    
} catch (error) {
    console.log('   ❌ Token test failed:', error.message);
}

// Test 6: Check MongoDB URI
console.log('\n6️⃣ MongoDB Configuration:');
console.log('   URI exists:', !!process.env.MONGODB_URI);
console.log('   URI:', process.env.MONGODB_URI?.replace(/\/\/.*@/, '//***:***@') || 'NOT SET');

// Test 7: Check PORT
console.log('\n7️⃣ Server Configuration:');
console.log('   PORT:', process.env.PORT || '5000 (default)');
console.log('   NODE_ENV:', process.env.NODE_ENV || 'NOT SET');

console.log('\n' + '='.repeat(60));
console.log('\n✅ Configuration test completed!\n');

// Recommendations
console.log('📋 RECOMMENDATIONS:\n');

if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'your_jwt_secret_key_here_change_in_production') {
    console.log('⚠️  WARNING: JWT_SECRET is using default value. Change it in production!');
}

if (!process.env.JWT_EXPIRE) {
    console.log('⚠️  INFO: JWT_EXPIRE not set, using default 7d');
} else if (process.env.JWT_EXPIRE === '30d') {
    console.log('✅ JWT_EXPIRE is set to 30 days - Good for admin sessions');
}

if (!process.env.JWT_REFRESH_SECRET || process.env.JWT_REFRESH_SECRET === 'your_refresh_secret_key_here_change_in_production') {
    console.log('⚠️  WARNING: JWT_REFRESH_SECRET is using default value. Change it in production!');
}

console.log('\n');
