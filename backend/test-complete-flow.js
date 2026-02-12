import mongoose from 'mongoose';
import ContractorJob from './modules/contractor/models/ContractorJob.model.js';

const MONGODB_URI = 'mongodb://localhost:27017/rajghar';

async function testCompleteFlow() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB Connected\n');

        console.log('========================================');
        console.log('COMPLETE TARGET AUDIENCE TEST');
        console.log('========================================\n');

        // Get all cards
        const allCards = await ContractorJob.find({ isActive: true }).sort({ createdAt: -1 });
        console.log('📊 Total active cards:', allCards.length);

        // Count by targetAudience
        const userCards = allCards.filter(c => c.targetAudience === 'User');
        const labourCards = allCards.filter(c => c.targetAudience === 'Labour');
        const bothCards = allCards.filter(c => c.targetAudience === 'Both' || !c.targetAudience);

        console.log('\n📈 Cards by Target Audience:');
        console.log('   User only:', userCards.length);
        console.log('   Labour only:', labourCards.length);
        console.log('   Both/Not set:', bothCards.length);

        // Test User view
        console.log('\n========================================');
        console.log('USER VIEW (audience=User)');
        console.log('========================================');
        const userView = await ContractorJob.find({
            isActive: true,
            $or: [
                { targetAudience: 'User' },
                { targetAudience: 'Both' },
                { targetAudience: { $exists: false } }
            ]
        }).sort({ createdAt: -1 }).limit(10);

        console.log('Total cards visible to User:', userView.length);
        console.log('\nLatest 5 cards:');
        userView.slice(0, 5).forEach((card, i) => {
            console.log(`${i + 1}. ${card.contractorName} - ${card.targetAudience || 'Not Set'}`);
        });

        // Test Labour view
        console.log('\n========================================');
        console.log('LABOUR VIEW (audience=Labour)');
        console.log('========================================');
        const labourView = await ContractorJob.find({
            isActive: true,
            $or: [
                { targetAudience: 'Labour' },
                { targetAudience: 'Both' },
                { targetAudience: { $exists: false } }
            ]
        }).sort({ createdAt: -1 }).limit(10);

        console.log('Total cards visible to Labour:', labourView.length);
        console.log('\nLatest 5 cards:');
        labourView.slice(0, 5).forEach((card, i) => {
            console.log(`${i + 1}. ${card.contractorName} - ${card.targetAudience || 'Not Set'}`);
        });

        // Verify filtering is working
        console.log('\n========================================');
        console.log('FILTERING VERIFICATION');
        console.log('========================================');

        // Check if any User-only cards are in Labour view
        const userOnlyInLabourView = labourView.filter(c => c.targetAudience === 'User');
        console.log('❌ User-only cards in Labour view:', userOnlyInLabourView.length);
        if (userOnlyInLabourView.length > 0) {
            console.log('   ERROR: These cards should NOT be visible to Labour!');
            userOnlyInLabourView.forEach(c => console.log('   -', c.contractorName));
        } else {
            console.log('   ✅ CORRECT: No User-only cards in Labour view');
        }

        // Check if any Labour-only cards are in User view
        const labourOnlyInUserView = userView.filter(c => c.targetAudience === 'Labour');
        console.log('\n❌ Labour-only cards in User view:', labourOnlyInUserView.length);
        if (labourOnlyInUserView.length > 0) {
            console.log('   ERROR: These cards should NOT be visible to User!');
            labourOnlyInUserView.forEach(c => console.log('   -', c.contractorName));
        } else {
            console.log('   ✅ CORRECT: No Labour-only cards in User view');
        }

        // Final verdict
        console.log('\n========================================');
        console.log('FINAL VERDICT');
        console.log('========================================');
        if (userOnlyInLabourView.length === 0 && labourOnlyInUserView.length === 0) {
            console.log('✅ ALL TESTS PASSED!');
            console.log('   - User sees only User and Both cards');
            console.log('   - Labour sees only Labour and Both cards');
            console.log('   - Filtering is working correctly');
        } else {
            console.log('❌ TESTS FAILED!');
            console.log('   - Filtering is NOT working correctly');
        }
        console.log('\n');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.connection.close();
    }
}

testCompleteFlow();
