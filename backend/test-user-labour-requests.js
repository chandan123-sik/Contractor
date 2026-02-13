import mongoose from 'mongoose';
import dotenv from 'dotenv';
import HireRequest from './modules/labour/models/HireRequest.model.js';
import User from './modules/user/models/User.model.js';

dotenv.config();

const testUserLabourRequests = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected\n');

        // Find all users with labour requests
        const allUsers = await User.find({});
        console.log('========================================');
        console.log('CHECKING ALL USERS FOR LABOUR REQUESTS');
        console.log('========================================\n');

        let usersWithRequests = [];

        for (const user of allUsers) {
            const requests = await HireRequest.find({
                requesterId: user._id,
                requesterModel: 'User'
            }).sort({ createdAt: -1 });

            if (requests.length > 0) {
                usersWithRequests.push({
                    user,
                    requests
                });

                console.log(`👤 User: ${user.firstName} ${user.lastName}`);
                console.log(`   ID: ${user._id}`);
                console.log(`   Mobile: ${user.mobileNumber}`);
                console.log(`   User Type: ${user.userType}`);
                console.log(`   📨 Labour Requests: ${requests.length}`);
                
                requests.forEach((req, idx) => {
                    console.log(`   ${idx + 1}. ${req.labourName} (${req.labourSkill}) - ${req.status} (${new Date(req.createdAt).toLocaleDateString()})`);
                });
                console.log('');
            }
        }

        console.log('========================================');
        console.log('SUMMARY');
        console.log('========================================');
        console.log(`Total Users: ${allUsers.length}`);
        console.log(`Users with Labour Requests: ${usersWithRequests.length}`);
        console.log(`Total Labour Requests: ${usersWithRequests.reduce((sum, u) => sum + u.requests.length, 0)}`);

        // Test API simulation for first user with requests
        if (usersWithRequests.length > 0) {
            const testUser = usersWithRequests[0].user;
            console.log('\n========================================');
            console.log('SIMULATING ADMIN API CALL');
            console.log('========================================\n');
            
            console.log('✅ Testing with user:');
            console.log(`   ID: ${testUser._id}`);
            console.log(`   Name: ${testUser.firstName} ${testUser.lastName}`);
            console.log(`   Mobile: ${testUser.mobileNumber}`);
            console.log(`   User Type: ${testUser.userType}\n`);

            console.log('📡 Simulating API: GET /api/admin/users/:id/labour-requests');
            console.log(`   User ID: ${testUser._id}\n`);

            const labourRequests = await HireRequest.find({
                requesterId: testUser._id,
                requesterModel: 'User'
            }).sort({ createdAt: -1 });

            console.log('✅ Query Result:');
            console.log(`   Total Requests: ${labourRequests.length}\n`);

            console.log('📋 Requests Details:\n');
            labourRequests.forEach((req, idx) => {
                console.log(`${idx + 1}. Request ID: ${req._id}`);
                console.log(`   Labour: ${req.labourName}`);
                console.log(`   Skill: ${req.labourSkill}`);
                console.log(`   Phone: ${req.labourPhone}`);
                console.log(`   City: ${req.labourCity}`);
                console.log(`   Status: ${req.status}`);
                console.log(`   Created: ${req.createdAt}\n`);
            });

            console.log('========================================');
            console.log('API RESPONSE SIMULATION');
            console.log('========================================\n');

            const apiResponse = {
                success: true,
                data: {
                    requests: labourRequests,
                    total: labourRequests.length
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

testUserLabourRequests();
