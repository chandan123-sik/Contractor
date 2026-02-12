import mongoose from 'mongoose';
import ContractorJob from './modules/contractor/models/ContractorJob.model.js';

const MONGODB_URI = 'mongodb://localhost:27017/rajghar';

async function checkLatestCard() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB Connected\n');

        // Get the latest card
        const latestCard = await ContractorJob.findOne().sort({ createdAt: -1 });

        if (latestCard) {
            console.log('========================================');
            console.log('LATEST CARD DETAILS');
            console.log('========================================\n');
            console.log('Card ID:', latestCard._id);
            console.log('Contractor Name:', latestCard.contractorName);
            console.log('City:', latestCard.city);
            console.log('Target Audience:', latestCard.targetAudience);
            console.log('Created At:', latestCard.createdAt);
            console.log('\n========================================\n');

            // Check what Labour will see
            const labourCards = await ContractorJob.find({
                isActive: true,
                $or: [
                    { targetAudience: 'Labour' },
                    { targetAudience: 'Both' },
                    { targetAudience: { $exists: false } }
                ]
            }).sort({ createdAt: -1 }).limit(5);

            console.log('CARDS VISIBLE TO LABOUR (Latest 5):');
            console.log('========================================');
            labourCards.forEach((card, index) => {
                console.log(`${index + 1}. ${card.contractorName} - ${card.targetAudience || 'Not Set'}`);
            });

            // Check what User will see
            const userCards = await ContractorJob.find({
                isActive: true,
                $or: [
                    { targetAudience: 'User' },
                    { targetAudience: 'Both' },
                    { targetAudience: { $exists: false } }
                ]
            }).sort({ createdAt: -1 }).limit(5);

            console.log('\nCARDS VISIBLE TO USER (Latest 5):');
            console.log('========================================');
            userCards.forEach((card, index) => {
                console.log(`${index + 1}. ${card.contractorName} - ${card.targetAudience || 'Not Set'}`);
            });

            // Check if latest card is in Labour results
            const isInLabourResults = labourCards.some(c => c._id.toString() === latestCard._id.toString());
            const isInUserResults = userCards.some(c => c._id.toString() === latestCard._id.toString());

            console.log('\n========================================');
            console.log('VISIBILITY CHECK FOR LATEST CARD:');
            console.log('========================================');
            console.log('Visible to Labour?', isInLabourResults ? '✅ YES' : '❌ NO');
            console.log('Visible to User?', isInUserResults ? '✅ YES' : '❌ NO');
            console.log('\n');

        } else {
            console.log('No cards found in database');
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.connection.close();
    }
}

checkLatestCard();
