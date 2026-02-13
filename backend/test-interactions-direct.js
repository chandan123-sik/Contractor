import mongoose from 'mongoose';
import dotenv from 'dotenv';
import HireRequest from './modules/labour/models/HireRequest.model.js';
import ContractorHireRequest from './modules/contractor/models/ContractorHireRequest.model.js';
import ContractorJob from './modules/contractor/models/ContractorJob.model.js';

dotenv.config();

async function testInteractions() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected\n');

        // Test 1: Labour Hire Requests
        console.log('📋 Test 1: Labour Hire Requests');
        const labourHireRequests = await HireRequest.find()
            .populate('requesterId', 'firstName lastName mobileNumber')
            .populate('labourId', 'skillType experience')
            .sort({ createdAt: -1 })
            .limit(5);

        console.log(`Found ${labourHireRequests.length} labour hire requests`);
        if (labourHireRequests.length > 0) {
            console.log('Sample:', {
                requester: labourHireRequests[0].requesterId?.firstName,
                requesterModel: labourHireRequests[0].requesterModel,
                labour: labourHireRequests[0].labourId?.skillType,
                status: labourHireRequests[0].status
            });
        }
        console.log('');

        // Test 2: Contractor Hire Requests
        console.log('📋 Test 2: Contractor Hire Requests');
        const contractorHireRequests = await ContractorHireRequest.find()
            .populate('requesterId', 'firstName lastName mobileNumber')
            .populate('contractorId', 'businessName businessType')
            .sort({ createdAt: -1 })
            .limit(5);

        console.log(`Found ${contractorHireRequests.length} contractor hire requests`);
        if (contractorHireRequests.length > 0) {
            console.log('Sample:', {
                requester: contractorHireRequests[0].requesterId?.firstName,
                contractor: contractorHireRequests[0].contractorId?.businessName,
                status: contractorHireRequests[0].status
            });
        }
        console.log('');

        // Test 3: Contractor Job Applications
        console.log('📋 Test 3: Contractor Job Applications');
        const contractorJobs = await ContractorJob.find({ 'applications.0': { $exists: true } })
            .populate('contractorId', 'businessName businessType')
            .sort({ createdAt: -1 })
            .limit(5);

        console.log(`Found ${contractorJobs.length} jobs with applications`);
        if (contractorJobs.length > 0) {
            console.log('Sample job:', {
                contractor: contractorJobs[0].contractorId?.businessName,
                applications: contractorJobs[0].applications.length,
                firstAppStatus: contractorJobs[0].applications[0]?.status
            });
        }
        console.log('');

        // Total count
        const totalInteractions = labourHireRequests.length + contractorHireRequests.length + 
            contractorJobs.reduce((sum, job) => sum + job.applications.length, 0);

        console.log(`📊 Total Interactions: ${totalInteractions}`);

        await mongoose.connection.close();
        console.log('\n✅ Test completed');

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

testInteractions();
