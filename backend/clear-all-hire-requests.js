import mongoose from 'mongoose';
import dotenv from 'dotenv';
import HireRequest from './modules/labour/models/HireRequest.model.js';

dotenv.config();

const clearRequests = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rajghar');
        console.log('✅ MongoDB Connected\n');

        const result = await HireRequest.deleteMany({});
        console.log(`✅ Deleted ${result.deletedCount} hire requests`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

clearRequests();
