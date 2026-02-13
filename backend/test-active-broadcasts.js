import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

async function testActiveBroadcasts() {
    console.log('🧪 Testing Active Broadcasts API\n');

    try {
        // Test 1: Get active broadcasts for USERS
        console.log('📋 Test 1: Fetching active broadcasts for USERS');
        const usersResponse = await axios.get(`${API_BASE_URL}/admin/broadcasts/active`, {
            params: { targetAudience: 'USERS' }
        });
        console.log('✅ USERS broadcasts:', usersResponse.data.data.total);
        if (usersResponse.data.data.broadcasts.length > 0) {
            console.log('   Sample:', usersResponse.data.data.broadcasts[0].title);
        }
        console.log('');

        // Test 2: Get active broadcasts for LABOUR
        console.log('📋 Test 2: Fetching active broadcasts for LABOUR');
        const labourResponse = await axios.get(`${API_BASE_URL}/admin/broadcasts/active`, {
            params: { targetAudience: 'LABOUR' }
        });
        console.log('✅ LABOUR broadcasts:', labourResponse.data.data.total);
        if (labourResponse.data.data.broadcasts.length > 0) {
            console.log('   Sample:', labourResponse.data.data.broadcasts[0].title);
        }
        console.log('');

        // Test 3: Get active broadcasts for CONTRACTORS
        console.log('📋 Test 3: Fetching active broadcasts for CONTRACTORS');
        const contractorsResponse = await axios.get(`${API_BASE_URL}/admin/broadcasts/active`, {
            params: { targetAudience: 'CONTRACTORS' }
        });
        console.log('✅ CONTRACTORS broadcasts:', contractorsResponse.data.data.total);
        if (contractorsResponse.data.data.broadcasts.length > 0) {
            console.log('   Sample:', contractorsResponse.data.data.broadcasts[0].title);
        }
        console.log('');

        // Test 4: Get active broadcasts for ALL
        console.log('📋 Test 4: Fetching active broadcasts for ALL');
        const allResponse = await axios.get(`${API_BASE_URL}/admin/broadcasts/active`, {
            params: { targetAudience: 'ALL' }
        });
        console.log('✅ ALL broadcasts:', allResponse.data.data.total);
        if (allResponse.data.data.broadcasts.length > 0) {
            console.log('   Sample:', allResponse.data.data.broadcasts[0].title);
        }
        console.log('');

        // Display all broadcasts details
        console.log('📊 All Active Broadcasts:');
        allResponse.data.data.broadcasts.forEach((broadcast, index) => {
            console.log(`\n${index + 1}. ${broadcast.title}`);
            console.log(`   Target: ${broadcast.targetAudience}`);
            console.log(`   Priority: ${broadcast.priority}`);
            console.log(`   Message: ${broadcast.message.substring(0, 100)}...`);
            console.log(`   Sent: ${new Date(broadcast.sentAt).toLocaleString()}`);
            if (broadcast.expiresAt) {
                console.log(`   Expires: ${new Date(broadcast.expiresAt).toLocaleString()}`);
            }
        });

        console.log('\n✅ All tests passed!');

    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
}

testActiveBroadcasts();
