import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ContractorJob from './modules/contractor/models/ContractorJob.model.js';

dotenv.config();

const testTargetAudience = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected\n');

        console.log('========================================');
        console.log('CHECKING TARGET AUDIENCE FIELD');
        console.log('========================================\n');

        // Get all contractor jobs
        const allJobs = await ContractorJob.find().sort({ createdAt: -1 }).limit(10);
        
        console.log('Total jobs:', allJobs.length);
        console.log('\nRecent jobs:\n');
        
        allJobs.forEach((job, index) => {
            console.log(`${index + 1}. Job ID: ${job._id}`);
            console.log(`   Contractor: ${job.contractorName}`);
            console.log(`   City: ${job.city}`);
            console.log(`   Target Audience: ${job.targetAudience || 'NOT SET (will show to both)'}`);
            console.log(`   Created: ${job.createdAt}`);
            console.log('');
        });

        // Count by targetAudience
        const userCount = await ContractorJob.countDocuments({ targetAudience: 'User' });
        const labourCount = await ContractorJob.countDocuments({ targetAudience: 'Labour' });
        const bothCount = await ContractorJob.countDocuments({ targetAudience: 'Both' });
        const notSetCount = await ContractorJob.countDocuments({ targetAudience: { $exists: false } });

        console.log('========================================');
        console.log('SUMMARY:');
        console.log('========================================');
        console.log(`User cards: ${userCount}`);
        console.log(`Labour cards: ${labourCount}`);
        console.log(`Both cards: ${bothCount}`);
        console.log(`Not set (old data): ${notSetCount}`);
        console.log('');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

testTargetAudience();
