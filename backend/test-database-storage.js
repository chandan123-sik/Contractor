import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './modules/user/models/User.model.js';
import Labour from './modules/labour/models/Labour.model.js';
import Contractor from './modules/contractor/models/Contractor.model.js';

dotenv.config();

const testDatabaseStorage = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rajghar');
        console.log('✅ MongoDB Connected\n');

        console.log('========================================');
        console.log('DATABASE STORAGE TEST');
        console.log('========================================\n');

        // Test 1: Check Users
        console.log('📊 TEST 1: Users in Database');
        console.log('----------------------------');
        const users = await User.find().select('mobileNumber userType firstName lastName').limit(5);
        console.log(`Total Users: ${await User.countDocuments()}`);
        users.forEach((user, index) => {
            console.log(`${index + 1}. ${user.mobileNumber} - ${user.userType} - ${user.firstName} ${user.lastName}`);
        });
        console.log('');

        // Test 2: Check Labour Profiles
        console.log('📊 TEST 2: Labour Profiles in Database');
        console.log('---------------------------------------');
        const labours = await Labour.find().populate('user', 'mobileNumber firstName lastName');
        console.log(`Total Labour Profiles: ${labours.length}`);
        labours.forEach((labour, index) => {
            console.log(`${index + 1}. User: ${labour.user?.mobileNumber || 'N/A'}`);
            console.log(`   Name: ${labour.user?.firstName || 'N/A'} ${labour.user?.lastName || 'N/A'}`);
            console.log(`   Skill: ${labour.skillType || 'N/A'}`);
            console.log(`   Has Card: ${labour.hasLabourCard}`);
            console.log(`   Card Name: ${labour.labourCardDetails?.fullName || 'N/A'}`);
            console.log('');
        });

        // Test 3: Check Contractor Profiles
        console.log('📊 TEST 3: Contractor Profiles in Database');
        console.log('------------------------------------------');
        const contractors = await Contractor.find().populate('user', 'mobileNumber firstName lastName');
        console.log(`Total Contractor Profiles: ${contractors.length}`);
        contractors.forEach((contractor, index) => {
            console.log(`${index + 1}. User: ${contractor.user?.mobileNumber || 'N/A'}`);
            console.log(`   Name: ${contractor.user?.firstName || 'N/A'} ${contractor.user?.lastName || 'N/A'}`);
            console.log(`   Business: ${contractor.businessName || 'N/A'}`);
            console.log(`   Type: ${contractor.businessType || 'N/A'}`);
            console.log(`   Completion: ${contractor.profileCompletionStatus || 'N/A'}`);
            console.log('');
        });

        // Test 4: Check Users without Profiles
        console.log('📊 TEST 4: Users Without Labour/Contractor Profiles');
        console.log('---------------------------------------------------');
        const labourUsers = await Labour.find().distinct('user');
        const contractorUsers = await Contractor.find().distinct('user');
        const allProfileUsers = [...labourUsers, ...contractorUsers];
        
        const usersWithoutProfiles = await User.find({
            _id: { $nin: allProfileUsers },
            userType: { $in: ['Labour', 'Contractor'] }
        }).select('mobileNumber userType firstName lastName');
        
        console.log(`Users with Labour/Contractor type but no profile: ${usersWithoutProfiles.length}`);
        usersWithoutProfiles.forEach((user, index) => {
            console.log(`${index + 1}. ${user.mobileNumber} - ${user.userType} - ${user.firstName} ${user.lastName}`);
        });
        console.log('');

        // Test 5: Summary
        console.log('========================================');
        console.log('SUMMARY');
        console.log('========================================');
        console.log(`Total Users: ${await User.countDocuments()}`);
        console.log(`Total Labour Profiles: ${await Labour.countDocuments()}`);
        console.log(`Total Contractor Profiles: ${await Contractor.countDocuments()}`);
        console.log(`Users with Labour type: ${await User.countDocuments({ userType: 'Labour' })}`);
        console.log(`Users with Contractor type: ${await User.countDocuments({ userType: 'Contractor' })}`);
        console.log(`Labour profiles with cards: ${await Labour.countDocuments({ hasLabourCard: true })}`);
        console.log(`Contractor profiles (complete): ${await Contractor.countDocuments({ profileCompletionStatus: 'complete' })}`);
        console.log('');

        // Test 6: Data Integrity Check
        console.log('========================================');
        console.log('DATA INTEGRITY CHECK');
        console.log('========================================');
        
        const labourTypeUsers = await User.countDocuments({ userType: 'Labour' });
        const labourProfiles = await Labour.countDocuments();
        const contractorTypeUsers = await User.countDocuments({ userType: 'Contractor' });
        const contractorProfiles = await Contractor.countDocuments();
        
        if (labourTypeUsers > labourProfiles) {
            console.log(`⚠️  WARNING: ${labourTypeUsers - labourProfiles} Labour users without profiles`);
        } else {
            console.log('✅ All Labour users have profiles');
        }
        
        if (contractorTypeUsers > contractorProfiles) {
            console.log(`⚠️  WARNING: ${contractorTypeUsers - contractorProfiles} Contractor users without profiles`);
        } else {
            console.log('✅ All Contractor users have profiles');
        }
        console.log('');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

testDatabaseStorage();
