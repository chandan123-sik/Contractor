import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Replace with actual admin token from browser localStorage
const ADMIN_TOKEN = 'YOUR_ADMIN_TOKEN_HERE';

async function testAdminUsersAPI() {
    try {
        console.log('========================================');
        console.log('TESTING ADMIN USERS API');
        console.log('========================================\n');

        // Test getAllUsers
        console.log('📡 Testing GET /api/admin/users...\n');
        
        const response = await axios.get(`${API_URL}/admin/users`, {
            headers: {
                'Authorization': `Bearer ${ADMIN_TOKEN}`
            },
            params: {
                page: 1,
                limit: 50
            }
        });

        if (response.data.success) {
            console.log('✅ API Response Success');
            console.log('📊 Total Users:', response.data.data.total);
            console.log('📄 Users in Response:', response.data.data.users.length);
            console.log('');

            // Check for "sssa sssa" user
            const sssaUser = response.data.data.users.find(u => 
                u.firstName?.includes('sssa') || u.lastName?.includes('sssa')
            );

            if (sssaUser) {
                console.log('✅ Found "sssa sssa" user in API response:');
                console.log('   ID:', sssaUser._id);
                console.log('   Name:', sssaUser.firstName, sssaUser.lastName);
                console.log('   Mobile:', sssaUser.mobileNumber);
                console.log('   User Type:', sssaUser.userType);
                console.log('');

                // Test getUserContractorRequests for this user
                console.log('📡 Testing GET /api/admin/users/:id/contractor-requests...\n');
                
                const requestsResponse = await axios.get(
                    `${API_URL}/admin/users/${sssaUser._id}/contractor-requests`,
                    {
                        headers: {
                            'Authorization': `Bearer ${ADMIN_TOKEN}`
                        }
                    }
                );

                if (requestsResponse.data.success) {
                    console.log('✅ Contractor Requests API Success');
                    console.log('📨 Total Requests:', requestsResponse.data.data.total);
                    console.log('📋 Requests:', requestsResponse.data.data.requests.length);
                    console.log('');

                    if (requestsResponse.data.data.requests.length > 0) {
                        console.log('Requests Details:');
                        requestsResponse.data.data.requests.forEach((req, i) => {
                            console.log(`${i + 1}. ${req.contractorName} - ${req.status}`);
                        });
                    }
                } else {
                    console.log('❌ Contractor Requests API Failed');
                }
            } else {
                console.log('❌ "sssa sssa" user NOT found in API response');
                console.log('');
                console.log('Users in response:');
                response.data.data.users.forEach((u, i) => {
                    console.log(`${i + 1}. ${u.firstName} ${u.lastName} (${u.userType}) - ${u.mobileNumber}`);
                });
            }
        } else {
            console.log('❌ API Response Failed');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.response) {
            console.error('Response Status:', error.response.status);
            console.error('Response Data:', error.response.data);
        } else {
            console.error('Note: Replace ADMIN_TOKEN with actual token from browser localStorage');
        }
    }
}

testAdminUsersAPI();
