import mongoose from 'mongoose';
import dotenv from 'dotenv';
import HireRequest from './modules/labour/models/HireRequest.model.js';
import Labour from './modules/labour/models/Labour.model.js';
import User from './modules/user/models/User.model.js';

dotenv.config();

const testLabourUserRequests = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected\n');

        // Find all labours with user requests
        const allLabours = await Labour.find({}).populate('user');
        console.log('========================================');
        console.log('CHECKING ALL LABOURS FOR USER REQUESTS');
        console.log('========================================\n');

        let laboursWithRequests = [];

        for (const labour of allLabours) {
            const requests = await HireRequest.find({
                labourId: labour._id,
                requesterModel: 'User'
            }).sort({ createdAt: -1 });

            if (requests.length > 0) {
                laboursWithRequests.push({
                    labour,
                    requests
                });

                console.log(`👤 Labour: ${labour.user?.firstName || 'N/A'} ${labour.user?.lastName || 'N/A'}`);
                console.log(`   ID: ${labour._id}`);
                console.log(`   User ID: ${labour.user?._id}`);
                console.log(`   Mobile: ${labour.user?.mobileNumber}`);
                console.log(`   Skill: ${labour.skillType}`);
                console.log(`   📨 User Requests: ${requests.length}`);
                
                requests.forEach((req, idx) => {
                    console.log(`   ${idx + 1}. ${req.requesterName} (${req.requesterPhone}) - ${req.status} (${new Date(req.createdAt).toLocaleDateString()})`);
                });
                console.log('');
            }
        }

        console.log('========================================');
        console.log('SUMMARY');
        console.log('========================================');
        console.log(`Total Labours: ${allLabours.length}`);
        console.log(`Labours with User Requests: ${laboursWithRequests.length}`);
        console.log(`Total User Requests: ${laboursWithRequests.reduce((sum, l) => sum + l.requests.length, 0)}`);

        // Test API simulation for first labour with requests
        if (laboursWithRequests.length > 0) {
            const testLabour = laboursWithRequests[0].labour;
            console.log('\n========================================');
            console.log('SIMULATING ADMIN API CALL');
            console.log('========================================\n');
            
            console.log('✅ Testing with labour:');
            console.log(`   ID: ${testLabour._id}`);
            console.log(`   Name: ${testLabour.user?.firstName || 'N/A'} ${testLabour.user?.lastName || 'N/A'}`);
            console.log(`   Mobile: ${testLabour.user?.mobileNumber}`);
            console.log(`   Skill: ${testLabour.skillType}\n`);

            console.log('📡 Simulating API: GET /api/admin/labours/:id/user-requests');
            console.log(`   Labour ID: ${testLabour._id}\n`);

            const userRequests = await HireRequest.find({
                labourId: testLabour._id,
                requesterModel: 'User'
            }).sort({ createdAt: -1 });

            console.log('✅ Query Result:');
            console.log(`   Total Requests: ${userRequests.length}\n`);

            console.log('📋 Requests Details:\n');
            userRequests.forEach((req, idx) => {
                console.log(`${idx + 1}. Request ID: ${req._id}`);
                console.log(`   User: ${req.requesterName}`);
                console.log(`   Phone: ${req.requesterPhone}`);
                console.log(`   Location: ${req.requesterLocation}`);
                console.log(`   Status: ${req.status}`);
                console.log(`   Created: ${req.createdAt}\n`);
            });

            console.log('========================================');
            console.log('API RESPONSE SIMULATION');
            console.log('========================================\n');

            const apiResponse = {
                success: true,
                data: {
                    requests: userRequests,
                    total: userRequests.length
                }
            };

            console.log(JSON.stringify(apiResponse, null, 2));
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.connection.close();
    }
};

testLabourUserRequests();
