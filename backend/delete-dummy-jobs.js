import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Job from './modules/user/models/Job.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

async function deleteDummyJobs() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected\n');

        // Delete jobs with undefined or missing critical fields (dummy data)
        const result = await Job.deleteMany({
            $or: [
                { description: { $in: [undefined, null, ''] } },
                { budget: { $in: [undefined, null, 0] } },
                { duration: { $in: [undefined, null, ''] } },
                { location: { $in: [undefined, null, ''] } }
            ]
        });
        
        console.log('========================================');
        console.log('DELETED DUMMY JOBS');
        console.log('========================================\n');
        
        console.log(`🗑️  Deleted ${result.deletedCount} dummy job(s)\n`);

        await mongoose.connection.close();
        console.log('✅ Connection closed');
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

deleteDummyJobs();
