import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Get admin token from your login
const ADMIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjc4YzI5YzI2YzI5YzI2YzI5YzI2YyIsInJvbGUiOiJTVVBFUl9BRE1JTiIsImlhdCI6MTczOTQ0MzIwMCwiZXhwIjoxNzM5NTI5NjAwfQ.example'; // Replace with actual token

async function testDashboardInteractions() {
    console.log('🧪 Testing Dashboard Interactions\n');

    try {
        // Test 1: Get Analytics
        console.log('📊 Test 1: Fetching Analytics');
        const analyticsResponse = await axios.get(`${API_BASE_URL}/admin/dashboard/analytics`, {
            headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
        });
        console.log('✅ Analytics:', analyticsResponse.data.data.analytics);
        console.log('');

        // Test 2: Get Interactions
        console.log('📋 Test 2: Fetching Interactions');
        const interactionsResponse = await axios.get(`${API_BASE_URL}/admin/dashboard/interactions`, {
            headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
        });
        console.log('✅ Interactions:', interactionsResponse.data.data);
        console.log('Total:', interactionsResponse.data.data.total);
        console.log('');

        if (interactionsResponse.data.data.interactions.length > 0) {
            console.log('📝 Sample Interaction:');
            console.log(JSON.stringify(interactionsResponse.data.data.interactions[0], null, 2));
        }

    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
}

testDashboardInteractions();
