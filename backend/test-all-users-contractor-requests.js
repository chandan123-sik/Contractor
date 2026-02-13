import mongoose from 'mongoose';
import User from './modules/user/models/User.model.js';
import ContractorHireRequest from './modules/contractor/models/ContractorHireRequest.model.js';

const MONGODB_URI = 'mongodb://localhost:27017/rajghar';

async function testAllUsersContractorRequests() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB Connected\n');

        console.log('========================================');
        console.log('ALL USERS WITH CONTRACTOR REQUESTS');
        console.log('========================================\n');

        // Get ALL users (no filter)
        const allUsers = await User.find({}).sort({ createdAt: -1 });
        console.log('📊 Total Users in Database:', allUsers.length);
        console.log('');

        let usersWithRequests = 0;
        let totalRequests = 0;

        for (const user of allUsers) {
            // Get contractor requests for this user
            const requests = await ContractorHireRequest.find({
                requesterId: user._id
            }).sort({ createdAt: -1 });

            if (requests.length > 0) {
                usersWithRequests++;
                totalRequests += requests.length;

                console.log('👤 User:', user.firstName || 'N/A', user.lastName || '');
                console.log('   ID:', user._id);
                console.log('   Mobile:', user.mobileNumber);
                console.log('   User Type:', user.userType);
                console.log('   📨 Contractor Requests:', requests.length);
                
                requests.forEach((req, index) => {
                    console.log(`   ${index + 1}. ${req.contractorName} - ${req.status} (${new Date(req.createdAt).toLocaleDateString()})`);
                });
                console.log('');
            }
        }

        console.log('========================================');
        console.log('SUMMARY');
        console.log('========================================');
        console.log('Total Users:', allUsers.length);
        console.log('Users with Contractor Requests:', usersWithRequests);
        console.log('Total Contractor Requests:', totalRequests);
        console.log('');

        // Show users WITHOUT requests
        console.log('========================================');
        console.log('USERS WITHOUT CONTRACTOR REQUESTS');
        console.log('========================================\n');

        for (const user of allUsers) {
            const requests = await ContractorHireRequest.find({
                requesterId: user._id
            });

            if (requests.length === 0) {
                console.log(`❌ ${user.firstName || 'N/A'} ${user.lastName || ''} (${user.mobileNumber}) - ${user.userType}`);
            }
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.connection.close();
    }
}

testAllUsersContractorRequests();
