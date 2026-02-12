import mongoose from 'mongoose';
import ContractorJob from './modules/contractor/models/ContractorJob.model.js';

const MONGODB_URI = 'mongodb://localhost:27017/rajghar';

async function cleanupTestCards() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB Connected\n');

        // Delete test cards
        const result = await ContractorJob.deleteMany({
            contractorName: { $in: ['TEST USER CARD', 'TEST LABOUR CARD'] }
        });

        console.log('🗑️  Deleted', result.deletedCount, 'test cards');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.connection.close();
    }
}

cleanupTestCards();
