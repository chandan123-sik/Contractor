/**
 * Test script to verify login endpoint is working without token
 */

const testLoginEndpoint = async () => {
    console.log('\n🧪 ===== TESTING LOGIN ENDPOINT =====\n');
    
    try {
        console.log('📝 Test: Login without token (should work)...');
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                mobileNumber: '9999999999',
                requestedUserType: 'User'
            })
        });
        
        const data = await response.json();
        
        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(data, null, 2));
        
        if (response.status === 200 && data.success) {
            console.log('\n✅ TEST PASSED: Login endpoint works without token');
        } else if (data.message === 'TOKEN_MISSING') {
            console.log('\n❌ TEST FAILED: Login endpoint requires token (should be public)');
            console.log('   This means auth middleware is incorrectly applied to login route');
        } else {
            console.log('\n⚠️  TEST RESULT:', data.message);
        }
        
    } catch (error) {
        console.error('\n❌ TEST ERROR:', error.message);
        console.log('   Make sure backend server is running on http://localhost:5000');
    }
    
    console.log('\n===== TEST COMPLETED =====\n');
};

// Run the test
testLoginEndpoint().catch(console.error);
