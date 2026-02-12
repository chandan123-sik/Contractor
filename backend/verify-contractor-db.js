import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const verifyContractorData = async () => {
    try {
        console.log('\n🔍 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Get Contractor model
        const Contractor = mongoose.model('Contractor');
        const User = mongoose.model('User');

        // Count total contractors
        const totalContractors = await Contractor.countDocuments();
        console.log(`📊 Total Contractors in Database: ${totalContractors}\n`);

        if (totalContractors === 0) {
            console.log('⚠️  No contractors found in database');
            console.log('💡 Run test-contractor-database.ps1 to create test data\n');
            process.exit(0);
        }

        // Get all contractors with user details
        const contractors = await Contractor.find()
            .populate('user', 'firstName lastName mobileNumber userType')
            .sort({ createdAt: -1 })
            .limit(10);

        console.log('📋 Recent Contractors:\n');
        console.log('='.repeat(80));

        contractors.forEach((contractor, index) => {
            console.log(`\n${index + 1}. Contractor ID: ${contractor._id}`);
            console.log(`   User: ${contractor.user?.firstName || 'N/A'} ${contractor.user?.lastName || ''}`);
            console.log(`   Mobile: ${contractor.user?.mobileNumber || 'N/A'}`);
            console.log(`   Business Name: ${contractor.businessName || 'Not set'}`);
            console.log(`   Business Type: ${contractor.businessType}`);
            console.log(`   City: ${contractor.city || 'Not set'}`);
            console.log(`   State: ${contractor.state || 'Not set'}`);
            console.log(`   Address: ${contractor.addressLine1 || 'Not set'}`);
            console.log(`   Landmark: ${contractor.landmark || 'Not set'}`);
            console.log(`   Profile Status: ${contractor.profileCompletionStatus || 'incomplete'}`);
            console.log(`   Is Active: ${contractor.isActive}`);
            console.log(`   Is Verified: ${contractor.isVerified}`);
            console.log(`   Created: ${contractor.createdAt.toLocaleString()}`);
        });

        console.log('\n' + '='.repeat(80));

        // Check profile completion statistics
        const stats = await Contractor.aggregate([
            {
                $group: {
                    _id: '$profileCompletionStatus',
                    count: { $sum: 1 }
                }
            }
        ]);

        console.log('\n📈 Profile Completion Statistics:');
        stats.forEach(stat => {
            console.log(`   ${stat._id || 'undefined'}: ${stat.count}`);
        });

        console.log('\n✅ Verification complete!\n');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

verifyContractorData();
