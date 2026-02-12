import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// You need to replace this with a valid token from your browser
const TOKEN = 'YOUR_TOKEN_HERE';

async function testCreateCard() {
    try {
        console.log('========================================');
        console.log('TESTING CARD CREATION WITH TARGET AUDIENCE');
        console.log('========================================\n');

        // Test creating a User-targeted card
        const userCardData = {
            contractorName: 'TEST API USER CARD',
            phoneNumber: '7777777777',
            city: 'Test City',
            address: 'Test Address',
            businessType: 'Individual Contractor',
            businessName: 'Test Business',
            labourSkill: 'Construction',
            experience: '5 Years',
            workDuration: 'Contract',
            budgetType: 'Fixed Amount',
            budgetAmount: 50000,
            rating: 4,
            profileStatus: 'Active',
            targetAudience: 'User' // Should only show to User
        };

        console.log('📤 Creating User-targeted card...');
        console.log('Target Audience:', userCardData.targetAudience);

        const response = await axios.post(
            `${API_URL}/contractor/jobs`,
            userCardData,
            {
                headers: {
                    'Authorization': `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.data.success) {
            console.log('✅ Card created successfully!');
            console.log('Card ID:', response.data.data.contractorJob._id);
            console.log('Target Audience saved:', response.data.data.contractorJob.targetAudience);
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.response) {
            console.error('Response:', error.response.data);
        } else {
            console.error('Note: You need to replace TOKEN with a valid access token from your browser');
        }
    }
}

testCreateCard();
