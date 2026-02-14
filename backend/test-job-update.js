import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Job from './modules/user/models/Job.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

async function testJobUpdate() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected\n');

        // Find a job
        const job = await Job.findOne({});
        
        if (!job) {
            console.log('❌ No jobs found in database');
            await mongoose.connection.close();
            return;
        }

        console.log('📋 Found Job:');
        console.log(`ID: ${job._id}`);
        console.log(`Title: ${job.jobTitle}`);
        console.log(`Current Status: ${job.status}`);
        
        // Try to update status to Closed
        const newStatus = job.status === 'Open' ? 'Closed' : 'Open';
        console.log(`\n🔄 Attempting to change status to: ${newStatus}`);
        
        job.status = newStatus;
        await job.save();
        
        console.log(`✅ Status updated successfully to: ${job.status}`);

        await mongoose.connection.close();
        console.log('\n✅ Connection closed');
    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.errors) {
            console.error('Validation Errors:', error.errors);
        }
        process.exit(1);
    }
}

testJobUpdate();
