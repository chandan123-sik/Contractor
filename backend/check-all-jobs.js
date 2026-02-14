import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Job from './modules/user/models/Job.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

async function checkAllJobs() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected\n');

        const jobs = await Job.find({});
        
        console.log('========================================');
        console.log('ALL JOBS IN DATABASE');
        console.log('========================================\n');
        
        console.log(`📊 Total Jobs: ${jobs.length}\n`);
        
        jobs.forEach((job, index) => {
            console.log(`\n--- Job ${index + 1} ---`);
            console.log(`ID: ${job._id}`);
            console.log(`Job Title: ${job.jobTitle}`);
            console.log(`Description: ${job.description}`);
            console.log(`Category: ${job.category}`);
            console.log(`Duration: ${job.duration}`);
            console.log(`Budget: ₹${job.budget}`);
            console.log(`Location: ${job.location}`);
            console.log(`Status: ${job.status}`);
            console.log(`User: ${job.userId?.firstName || 'N/A'} ${job.userId?.lastName || ''}`);
            console.log(`Created At: ${job.createdAt}`);
        });

        await mongoose.connection.close();
        console.log('\n✅ Connection closed');
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

checkAllJobs();
