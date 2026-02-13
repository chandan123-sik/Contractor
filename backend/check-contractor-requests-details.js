import mongoose from 'mongoose';
import ContractorHireRequest from './modules/contractor/models/ContractorHireRequest.model.js';
import User from './modules/user/models/User.model.js';

const MONGODB_URI = 'mongodb://localhost:27017/rajghar';

async function checkRequestsDetails() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB Connected\n');

        console.log('========================================');
        console.log('ALL CONTRACTOR HIRE REQUESTS');
        console.log('========================================\n');

        const requests = await ContractorHireRequest.find({});
        console.log('📊 Total Requests:', requests.length, '\n');

        for (const req of requests) {
            console.log('📨 Request ID:', req._id);
            console.log('   Contractor:', req.contractorName);
            console.log('   Requester ID:', req.requesterId);
            console.log('   Requester Name:', req.requesterName);
            console.log('   Status:', req.status);
            console.log('   Created:', req.createdAt);
            
            // Check if requester exists
            const user = await User.findById(req.requesterId);
            if (user) {
                console.log('   ✅ User exists:', user.firstName, user.lastName, '-', user.mobileNumber);
            } else {
                console.log('   ❌ User NOT found in database');
            }
            console.log('');
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.connection.close();
    }
}

checkRequestsDetails();
