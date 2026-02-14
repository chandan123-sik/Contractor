import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import ContractorJob from './modules/contractor/models/ContractorJob.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

async function checkContractorJobs() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected\n');

        const jobs = await ContractorJob.find({});
        
        console.log('========================================');
        console.log('ALL CONTRACTOR JOBS IN DATABASE');
        console.log('========================================\n');
        
        console.log(`📊 Total Jobs: ${jobs.length}\n`);
        
        jobs.forEach((job, index) => {
            console.log(`\n--- Job ${index + 1} ---`);
            console.log(`ID: ${job._id}`);
            console.log(`Contractor Name: ${job.contractorName}`);
            console.log(`Phone: ${job.phoneNumber}`);
            console.log(`City: ${job.city}`);
            console.log(`Business Type: ${job.businessType}`);
            console.log(`Labour Skill: ${job.labourSkill}`);
            console.log(`Target Audience: ${job.targetAudience}`);
            console.log(`Profile Status: ${job.profileStatus}`);
            console.log(`Created At: ${job.createdAt}`);
        });

        await mongoose.connection.close();
        console.log('\n✅ Connection closed');
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

checkContractorJobs();
