import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ContractorJob from './modules/contractor/models/ContractorJob.model.js';

dotenv.config();

const testAPI = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected\n');

        // Simulate API call - get jobs for a specific user
        const userId = '698d9aab57608664e597f76c'; // User from your console log
        
        console.log('========================================');
        console.log('TESTING API ENDPOINT: GET /api/contractor/jobs');
        console.log('========================================\n');
        
        console.log('User ID:', userId);
        
        const jobs = await ContractorJob.find({ user: userId })
            .sort({ createdAt: -1 });
        
        console.log('\n✅ Found', jobs.length, 'jobs for this user\n');
        
        if (jobs.length > 0) {
            jobs.forEach((job, index) => {
                console.log(`${index + 1}. Job ID: ${job._id}`);
                console.log(`   Contractor Name: ${job.contractorName}`);
                console.log(`   Phone: ${job.phoneNumber}`);
                console.log(`   City: ${job.city}`);
                console.log(`   Skill: ${job.labourSkill}`);
                console.log(`   Status: ${job.profileStatus}`);
                console.log(`   Rating: ${job.rating}`);
                console.log(`   Created: ${job.createdAt}`);
                console.log('');
            });
            
            // Format like frontend expects
            console.log('========================================');
            console.log('FORMATTED FOR FRONTEND:');
            console.log('========================================\n');
            
            const formattedCards = jobs.map(job => ({
                id: job._id,
                contractorName: job.contractorName || 'N/A',
                businessType: job.businessType || 'Individual',
                city: job.city || 'N/A',
                primaryWorkCategory: job.labourSkill || 'Other',
                experience: job.experience || '0',
                contactNo: job.phoneNumber || 'N/A',
                budgetAmount: job.budgetAmount || '0',
                rating: job.rating || 0,
                availabilityStatus: job.profileStatus === 'Active' ? 'Available' : 'Closed',
                createdAt: job.createdAt
            }));
            
            console.log(JSON.stringify(formattedCards, null, 2));
        } else {
            console.log('⚠️ No jobs found for this user');
            console.log('\nTrying to find ANY jobs in database...\n');
            
            const allJobs = await ContractorJob.find().limit(5);
            console.log('Found', allJobs.length, 'total jobs in database');
            
            if (allJobs.length > 0) {
                console.log('\nSample job users:');
                allJobs.forEach(job => {
                    console.log(`- Job ${job._id} belongs to user: ${job.user}`);
                });
            }
        }
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

testAPI();
