import mongoose from 'mongoose';
import ContractorJob from './modules/contractor/models/ContractorJob.model.js';
import Contractor from './modules/contractor/models/Contractor.model.js';
import User from './modules/user/models/User.model.js';

const MONGODB_URI = 'mongodb://localhost:27017/rajghar';

async function testCreateUserCard() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB Connected\n');

        // Find a test user
        const user = await User.findOne({ userType: 'Contractor' });
        if (!user) {
            console.log('❌ No contractor user found');
            return;
        }

        console.log('👤 Using user:', user._id);

        // Find or create contractor profile
        let contractor = await Contractor.findOne({ user: user._id });
        if (!contractor) {
            contractor = await Contractor.create({
                user: user._id,
                businessType: 'Proprietorship',
                businessName: 'Test Contractor',
                city: 'Test City',
                isActive: true
            });
            console.log('✅ Created contractor profile:', contractor._id);
        } else {
            console.log('✅ Found contractor profile:', contractor._id);
        }

        // Create a card with targetAudience: 'User'
        const userCard = await ContractorJob.create({
            contractor: contractor._id,
            user: user._id,
            contractorName: 'TEST USER CARD',
            phoneNumber: '9999999999',
            city: 'Test City',
            address: 'Test Address',
            businessType: 'Individual Contractor',
            businessName: 'Test Business',
            labourSkill: 'Construction',
            experience: '5 Years',
            workDuration: 'Contract',
            budgetType: 'Fixed Amount',
            budgetAmount: 50000,
            rating: 4,
            profileStatus: 'Active',
            targetAudience: 'User' // Only for User
        });

        console.log('\n✅ Created USER card:', userCard._id);
        console.log('   Target Audience:', userCard.targetAudience);

        // Create a card with targetAudience: 'Labour'
        const labourCard = await ContractorJob.create({
            contractor: contractor._id,
            user: user._id,
            contractorName: 'TEST LABOUR CARD',
            phoneNumber: '8888888888',
            city: 'Test City',
            address: 'Test Address',
            businessType: 'Individual Contractor',
            businessName: 'Test Business',
            labourSkill: 'Painting',
            experience: '3 Years',
            workDuration: 'Multiple Days',
            budgetType: 'Negotiable',
            budgetAmount: 0,
            rating: 5,
            profileStatus: 'Active',
            targetAudience: 'Labour' // Only for Labour
        });

        console.log('\n✅ Created LABOUR card:', labourCard._id);
        console.log('   Target Audience:', labourCard.targetAudience);

        // Test filtering
        console.log('\n========================================');
        console.log('TESTING FILTERING');
        console.log('========================================\n');

        // Query for User audience
        const userCards = await ContractorJob.find({
            isActive: true,
            $or: [
                { targetAudience: 'User' },
                { targetAudience: 'Both' }
            ]
        });
        console.log('📊 Cards visible to USER:', userCards.length);
        console.log('   Should include: TEST USER CARD and cards with "Both"');

        // Query for Labour audience
        const labourCards = await ContractorJob.find({
            isActive: true,
            $or: [
                { targetAudience: 'Labour' },
                { targetAudience: 'Both' }
            ]
        });
        console.log('\n📊 Cards visible to LABOUR:', labourCards.length);
        console.log('   Should include: TEST LABOUR CARD and cards with "Both"');

        // Verify TEST USER CARD is NOT in labour results
        const testUserCardInLabour = labourCards.find(c => c.contractorName === 'TEST USER CARD');
        console.log('\n✅ TEST USER CARD in Labour results?', testUserCardInLabour ? 'YES ❌' : 'NO ✅');

        // Verify TEST LABOUR CARD is NOT in user results
        const testLabourCardInUser = userCards.find(c => c.contractorName === 'TEST LABOUR CARD');
        console.log('✅ TEST LABOUR CARD in User results?', testLabourCardInUser ? 'YES ❌' : 'NO ✅');

        console.log('\n========================================');
        console.log('TEST COMPLETE');
        console.log('========================================\n');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.connection.close();
    }
}

testCreateUserCard();
