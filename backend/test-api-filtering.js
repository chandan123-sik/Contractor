import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

async function testAPIFiltering() {
    try {
        console.log('========================================');
        console.log('TESTING API FILTERING');
        console.log('========================================\n');

        // Test User audience
        console.log('📡 Testing User audience...');
        const userResponse = await axios.get(`${API_URL}/contractor/jobs/browse?audience=User`);
        console.log('✅ User API Response:', userResponse.data.success);
        console.log('   Total jobs:', userResponse.data.data.jobs.length);
        
        const userHasTestUserCard = userResponse.data.data.jobs.some(j => j.contractorName === 'TEST USER CARD');
        const userHasTestLabourCard = userResponse.data.data.jobs.some(j => j.contractorName === 'TEST LABOUR CARD');
        
        console.log('   Has TEST USER CARD?', userHasTestUserCard ? 'YES ✅' : 'NO ❌');
        console.log('   Has TEST LABOUR CARD?', userHasTestLabourCard ? 'NO ✅' : 'YES ❌');

        // Test Labour audience
        console.log('\n📡 Testing Labour audience...');
        const labourResponse = await axios.get(`${API_URL}/contractor/jobs/browse?audience=Labour`);
        console.log('✅ Labour API Response:', labourResponse.data.success);
        console.log('   Total jobs:', labourResponse.data.data.jobs.length);
        
        const labourHasTestUserCard = labourResponse.data.data.jobs.some(j => j.contractorName === 'TEST USER CARD');
        const labourHasTestLabourCard = labourResponse.data.data.jobs.some(j => j.contractorName === 'TEST LABOUR CARD');
        
        console.log('   Has TEST USER CARD?', labourHasTestUserCard ? 'YES ❌' : 'NO ✅');
        console.log('   Has TEST LABOUR CARD?', labourHasTestLabourCard ? 'YES ✅' : 'NO ❌');

        console.log('\n========================================');
        console.log('FILTERING TEST RESULTS');
        console.log('========================================');
        
        const userFilterCorrect = userHasTestUserCard && !userHasTestLabourCard;
        const labourFilterCorrect = !labourHasTestUserCard && labourHasTestLabourCard;
        
        if (userFilterCorrect && labourFilterCorrect) {
            console.log('✅ ALL TESTS PASSED!');
            console.log('   - User sees only User-targeted cards');
            console.log('   - Labour sees only Labour-targeted cards');
        } else {
            console.log('❌ TESTS FAILED!');
            if (!userFilterCorrect) {
                console.log('   - User filtering is incorrect');
            }
            if (!labourFilterCorrect) {
                console.log('   - Labour filtering is incorrect');
            }
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.response) {
            console.error('   Response:', error.response.data);
        }
    }
}

testAPIFiltering();
