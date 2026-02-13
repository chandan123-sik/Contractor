import mongoose from 'mongoose';
import User from './modules/user/models/User.model.js';
import ContractorHireRequest from './modules/contractor/models/ContractorHireRequest.model.js';

const MONGODB_URI = 'mongodb://localhost:27017/rajghar';

async function checkAllUsersRequests() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB Connected\n');

        console.log('========================================');
        console.log('ALL USERS WITH CONTRACTOR REQUESTS');
        console.log('========================================\n');

        // Get all users
        const users = await User.find({ userType: 'User' });
        console.log('📊 Total Users:', users.length, '\n');

        let usersWithRequests = 0;

        // For each user, check their contractor requests
        for (const user of users) {
            const requests = await ContractorHireRequest.find({
                requesterId: user._id
            }).sort({ createdAt: -1 });

            console.log('👤 User:', user.firstName || 'N/A', user.lastName || '');
            console.log('   Mobile:', user.mobileNumber);
            console.log('   User ID:', user._id);
            console.log('   📨 Contractor Requests:', requests.length);
            
            if (requests.length > 0) {
                usersWithRequests++;
                requests.forEach((req, index) => {
                    console.log(`   ${index + 1}. ${req.contractorName} - ${req.status} (${new Date(req.createdAt).toLocaleDateString()})`);
                });
            }
            console.log('');
        }

        // Summary
        const totalRequests = await ContractorHireRequest.countDocuments();
        console.log('========================================');
        console.log('SUMMARY');
        console.log('========================================');
        console.log('Total Users:', users.length);
        console.log('Users with Requests:', usersWithRequests);
        console.log('Total Contractor Requests:', totalRequests);
        console.log('\n');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.connection.close();
    }
}

checkAllUsersRequests();
