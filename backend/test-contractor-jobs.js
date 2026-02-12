import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ContractorJob from './modules/contractor/models/ContractorJob.model.js';
import Contractor from './modules/contractor/models/Contractor.model.js';
import User from './modules/user/models/User.model.js';

dotenv.config();

const testContractorJobs = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rajghar');
        console.log('✅ MongoDB Connected\n');

        console.log('========================================');
        console.log('CONTRACTOR JOBS TEST');
        console.log('========================================\n');

        // Check contractor jobs
        const jobs = await ContractorJob.find()
            .populate('user', 'firstName lastName mobileNumber')
            .populate('contractor', 'businessName businessType');
        
        console.log(`Total Contractor Jobs: ${jobs.length}\n`);

        if (jobs.length === 0) {
            console.log('❌ No contractor jobs found in database!');
            console.log('Contractors need to create jobs via PostJob page.\n');
        } else {
            jobs.forEach((job, index) => {
                console.log(`${index + 1}. Job ID: ${job._id}`);
                console.log(`   Contractor: ${job.contractorName}`);
                console.log(`   Phone: ${job.phoneNumber}`);
                console.log(`   City: ${job.city}`);
                console.log(`   Skill: ${job.labourSkill}`);
                console.log(`   Status: ${job.profileStatus}`);
                console.log(`   Active: ${job.isActive}`);
                console.log(`   Created: ${job.createdAt}`);
                console.log('');
            });
        }

        // Check contractors
        console.log('========================================');
        console.log('CONTRACTORS IN DATABASE');
        console.log('========================================\n');
        
        const contractors = await Contractor.find().populate('user', 'firstName lastName mobileNumber');
        console.log(`Total Contractors: ${contractors.length}\n`);

        contractors.forEach((contractor, index) => {
            console.log(`${index + 1}. Contractor ID: ${contractor._id}`);
            console.log(`   User: ${contractor.user?.firstName} ${contractor.user?.lastName}`);
            console.log(`   Phone: ${contractor.user?.mobileNumber}`);
            console.log(`   Business: ${contractor.businessName || 'N/A'}`);
            console.log(`   Type: ${contractor.businessType || 'N/A'}`);
            console.log('');
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

testContractorJobs();
