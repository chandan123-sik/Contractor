import mongoose from 'mongoose';
import User from './modules/user/models/User.model.js';
import ContractorHireRequest from './modules/contractor/models/ContractorHireRequest.model.js';

const MONGODB_URI = 'mongodb://localhost:27017/rajghar';

async function testSssaContractorRequestsAPI() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB Connected\n');

        console.log('========================================');
        console.log('SIMULATING ADMIN API CALL');
        console.log('========================================\n');

        // Find sssa user
        const sssaUser = await User.findOne({
            firstName: /sssa/i,
            lastName: /sssa/i
        });

        if (!sssaUser) {
            console.log('❌ sssa user not found');
            return;
        }

        console.log('✅ Found sssa user:');
        console.log('   ID:', sssaUser._id);
        console.log('   Name:', sssaUser.firstName, sssaUser.lastName);
        console.log('   Mobile:', sssaUser.mobileNumber);
        console.log('   User Type:', sssaUser.userType);
        console.log('');

        // Simulate getUserContractorRequests API call
        console.log('📡 Simulating API: GET /api/admin/users/:id/contractor-requests');
        console.log('   User ID:', sssaUser._id);
        console.log('');

        const contractorRequests = await ContractorHireRequest.find({
            requesterId: sssaUser._id
        }).sort({ createdAt: -1 });

        console.log('✅ Query Result:');
        console.log('   Total Requests:', contractorRequests.length);
        console.log('');

        if (contractorRequests.length > 0) {
            console.log('📋 Requests Details:');
            contractorRequests.forEach((req, index) => {
                console.log(`\n${index + 1}. Request ID: ${req._id}`);
                console.log(`   Contractor: ${req.contractorName}`);
                console.log(`   Phone: ${req.contractorPhone}`);
                console.log(`   Business: ${req.contractorBusiness}`);
                console.log(`   City: ${req.contractorCity}`);
                console.log(`   Status: ${req.status}`);
                console.log(`   Created: ${req.createdAt}`);
                if (req.respondedAt) {
                    console.log(`   Responded: ${req.respondedAt}`);
                }
            });
        } else {
            console.log('⚠️ No contractor requests found');
        }

        console.log('\n========================================');
        console.log('API RESPONSE SIMULATION');
        console.log('========================================\n');

        const apiResponse = {
            success: true,
            data: {
                requests: contractorRequests,
                total: contractorRequests.length
            }
        };

        console.log(JSON.stringify(apiResponse, null, 2));

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.connection.close();
    }
}

testSssaContractorRequestsAPI();
