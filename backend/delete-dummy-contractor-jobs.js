import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import ContractorJob from './modules/contractor/models/ContractorJob.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

async function deleteDummyContractorJobs() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected\n');

        // Delete dummy contractor jobs with phone number 5555555555
        const result = await ContractorJob.deleteMany({
            phoneNumber: '5555555555'
        });
        
        console.log('========================================');
        console.log('DELETED DUMMY CONTRACTOR JOBS');
        console.log('========================================\n');
        
        console.log(`🗑️  Deleted ${result.deletedCount} dummy contractor job(s)\n`);

        await mongoose.connection.close();
        console.log('✅ Connection closed');
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

deleteDummyContractorJobs();
