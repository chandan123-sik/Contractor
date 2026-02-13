import mongoose from 'mongoose';
import User from './modules/user/models/User.model.js';
import ContractorHireRequest from './modules/contractor/models/ContractorHireRequest.model.js';

const MONGODB_URI = 'mongodb://localhost:27017/rajghar';

async function findSssaUser() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB Connected\n');

        console.log('========================================');
        console.log('FINDING "sssa sssa" USER');
        console.log('========================================\n');

        // Search for user with name containing "sssa"
        const users = await User.find({
            $or: [
                { firstName: /sssa/i },
                { lastName: /sssa/i },
                { mobileNumber: /sssa/i }
            ]
        });

        console.log('📊 Found', users.length, 'matching users\n');

        for (const user of users) {
            console.log('👤 User Details:');
            console.log('   ID:', user._id);
            console.log('   Name:', user.firstName, user.lastName);
            console.log('   Mobile:', user.mobileNumber);
            console.log('   User Type:', user.userType);
            console.log('   Email:', user.email || 'N/A');
            console.log('');

            // Check contractor hire requests for this user
            const requests = await ContractorHireRequest.find({
                requesterId: user._id
            }).sort({ createdAt: -1 });

            console.log('   📨 Contractor Hire Requests:', requests.length);
            if (requests.length > 0) {
                requests.forEach((req, index) => {
                    console.log(`   ${index + 1}. Contractor: ${req.contractorName}`);
                    console.log(`      Status: ${req.status}`);
                    console.log(`      Request ID: ${req._id}`);
                    console.log(`      Created: ${req.createdAt}`);
                });
            } else {
                console.log('   ⚠️ No contractor hire requests found for this user');
            }
            console.log('\n' + '='.repeat(50) + '\n');
        }

        // Also check all contractor hire requests to see if any match
        console.log('========================================');
        console.log('ALL CONTRACTOR HIRE REQUESTS');
        console.log('========================================\n');

        const allRequests = await ContractorHireRequest.find({});
        console.log('📊 Total Requests in Database:', allRequests.length, '\n');

        for (const req of allRequests) {
            console.log('📨 Request ID:', req._id);
            console.log('   Requester ID:', req.requesterId);
            console.log('   Requester Name:', req.requesterName);
            console.log('   Requester Phone:', req.requesterPhone);
            console.log('   Contractor:', req.contractorName);
            console.log('   Status:', req.status);
            console.log('   Created:', req.createdAt);
            
            // Check if requester exists
            const requester = await User.findById(req.requesterId);
            if (requester) {
                console.log('   ✅ Requester exists:', requester.firstName, requester.lastName);
            } else {
                console.log('   ❌ Requester NOT found in database');
            }
            console.log('');
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.connection.close();
    }
}

findSssaUser();
