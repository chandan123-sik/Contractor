/**
 * Test script to verify labour application data is properly populated
 * 
 * This tests:
 * 1. Labour profile has firstName, lastName in User model
 * 2. Contractor job applications show correct labour name and location
 */

const testLabourApplicationData = async () => {
    console.log('\n🧪 ===== TESTING LABOUR APPLICATION DATA =====\n');
    
    const baseUrl = 'http://localhost:5000/api';
    
    // Step 1: Create a test labour account
    console.log('📝 Step 1: Creating test labour account...');
    try {
        // Login as labour
        const loginResponse = await fetch(`${baseUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                mobileNumber: '7777777777',
                requestedUserType: 'Labour'
            })
        });
        
        const loginData = await loginResponse.json();
        if (!loginData.success) {
            console.log('❌ Login failed:', loginData.message);
            return;
        }
        
        const token = loginData.data.accessToken;
        console.log('✅ Login successful');
        
        // Create labour profile with name
        const profileResponse = await fetch(`${baseUrl}/labour/create-profile`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                mobileNumber: '7777777777',
                firstName: 'Ramesh',
                lastName: 'Kumar',
                gender: 'Male',
                city: 'Mumbai',
                state: 'Maharashtra',
                skillType: 'Plumber',
                experience: '5 years'
            })
        });
        
        const profileData = await profileResponse.json();
        if (profileData.success) {
            console.log('✅ Labour profile created');
            console.log('   Name: Ramesh Kumar');
            console.log('   City: Mumbai');
        } else {
            console.log('⚠️  Profile creation response:', profileData.message);
        }
        
    } catch (error) {
        console.error('❌ Error in Step 1:', error.message);
    }
    
    console.log('\n---\n');
    
    // Step 2: Verify User model has the data
    console.log('📝 Step 2: Verifying User model has firstName and city...');
    console.log('   (This would require direct database access)');
    console.log('   Expected: User.firstName = "Ramesh", User.city = "Mumbai"');
    
    console.log('\n---\n');
    
    // Step 3: Apply to a contractor job
    console.log('📝 Step 3: Apply to contractor job...');
    console.log('   (Requires contractor job to exist)');
    console.log('   Labour should apply with token from Step 1');
    
    console.log('\n---\n');
    
    // Step 4: Check contractor's applications
    console.log('📝 Step 4: Check contractor sees correct labour data...');
    console.log('   Expected in Workers Request:');
    console.log('   - Name: Ramesh Kumar (not "null null")');
    console.log('   - Location: Mumbai (not "Not specified")');
    console.log('   - Phone: 7777777777');
    console.log('   - Skill: Plumber');
    console.log('   - Experience: 5 years');
    
    console.log('\n===== TEST GUIDE COMPLETED =====\n');
    console.log('To fully test:');
    console.log('1. Run this script to create labour profile');
    console.log('2. Login as contractor and create a job');
    console.log('3. Login as labour (7777777777) and apply to the job');
    console.log('4. Login as contractor and check Workers Request page');
    console.log('5. Verify name shows "Ramesh Kumar" and location shows "Mumbai"');
};

// Run the test
testLabourApplicationData().catch(console.error);
